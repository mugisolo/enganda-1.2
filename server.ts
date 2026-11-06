import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  loadOrInitializeStore,
  saveStore,
  normalizeDuplicateKey,
  generateAvatarDataUri,
  type NetworkGroupRecord,
  type PrivateMemberRecord,
  type SupportEnquiryRecord,
  type NewsletterSubscriptionRecord,
  type SafariEventRecord,
  type SafariEventCategory,
  PHOTO_ASSETS,
} from './server-data/seedStore.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = loadOrInitializeStore();
const GLOBAL_ADMIN_EMAILS = new Set(['mugisolo@gmail.com']);

interface CallerContext {
  email: string;
  uid: string;
  isGlobalAdmin: boolean;
  assignedGroupIds: string[];
}

function resolveCaller(req: Request): CallerContext | null {
  const rawEmail = String(req.headers['x-user-email'] || '').trim().toLowerCase();
  const rawUid = String(req.headers['x-user-uid'] || '').trim();

  if (!rawEmail || !rawEmail.includes('@')) {
    return null;
  }

  const isGlobalAdmin = GLOBAL_ADMIN_EMAILS.has(rawEmail);
  const assignedGroupIds = isGlobalAdmin
    ? store.groups.map((g) => g.id)
    : store.assignments
        .filter((a) => a.email.toLowerCase() === rawEmail)
        .map((a) => a.groupId);

  return {
    email: rawEmail,
    uid: rawUid || `uid-${rawEmail}`,
    isGlobalAdmin,
    assignedGroupIds: Array.from(new Set(assignedGroupIds)),
  };
}

function canManageGroup(caller: CallerContext | null, groupId: string): boolean {
  if (!caller) return false;
  if (caller.isGlobalAdmin) return true;
  return caller.assignedGroupIds.includes(groupId);
}

/**
 * STRICT SERVER-SIDE FIELD WHITELISTING FOR PUBLIC DIRECTORY RESPONSES.
 * Public responses NEVER expose full member lists, other members' full names,
 * phone numbers, email addresses, national ID numbers, or private member records.
 */
function toPublicGroupProfile(group: NetworkGroupRecord, memberCount: number) {
  return {
    id: group.id,
    uniqueGroupCode: group.uniqueGroupCode,
    slug: group.slug,
    name: group.name,
    programmeType: group.programmeType,
    sector: group.sector,
    companyAffiliation: group.companyAffiliation,
    isProgrammeOnly: group.isProgrammeOnly,
    location: group.location,
    mapCoords: group.mapCoords,
    summary: group.summary,
    representativeName: group.representativeName,
    representativeTitle: group.representativeTitle,
    memberCount: group.isProgrammeOnly ? 0 : memberCount,
    projectName: group.projectName,
    projectDescription: group.projectDescription,
    supportFocus: group.supportFocus,
    websiteUrl: group.websiteUrl || '',
    activities: group.activities || [],
    sponsorshipPackages: group.sponsorshipPackages || [],
    galleryImages: Array.isArray(group.galleryImages)
      ? group.galleryImages.slice(0, 5)
      : [],
    updatedAt: group.updatedAt,
  };
}

function getGroupMemberCountMap(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of store.members) {
    counts.set(m.groupId, (counts.get(m.groupId) || 0) + 1);
  }
  return counts;
}

function parseSkillsInput(rawSkills: unknown): string[] {
  if (Array.isArray(rawSkills)) {
    return rawSkills
      .map((s) => String(s || '').trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 12);
  }
  if (typeof rawSkills === 'string' && rawSkills.trim() !== '') {
    return rawSkills
      .split(/[,;|]/)
      .map((s) => s.trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 12);
  }
  return ['Group Savings', 'Enterprise Trade'];
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // ===========================================================================
  // 1. PUBLIC DIRECTORY API (Strict Field Whitelisting)
  // ===========================================================================
  app.get('/api/directory', (req: Request, res: Response) => {
    const { search, location, programmeType, sector, representative } = req.query;
    const countMap = getGroupMemberCountMap();

    let profiles = store.groups.map((g) =>
      toPublicGroupProfile(g, countMap.get(g.id) || 0)
    );

    if (location && location !== 'all') {
      const locQuery = String(location).toLowerCase();
      profiles = profiles.filter((p) => p.location.toLowerCase() === locQuery);
    }

    if (programmeType && programmeType !== 'all') {
      const typeQuery = String(programmeType).toLowerCase();
      profiles = profiles.filter((p) => p.programmeType.toLowerCase() === typeQuery);
    }

    if (sector && sector !== 'all') {
      const sectorQuery = String(sector).toLowerCase();
      profiles = profiles.filter((p) => p.sector.toLowerCase().includes(sectorQuery));
    }

    if (representative && representative !== 'all') {
      const repQuery = String(representative).toLowerCase();
      profiles = profiles.filter((p) =>
        p.representativeName.toLowerCase().includes(repQuery)
      );
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).trim().toLowerCase();
      profiles = profiles.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.uniqueGroupCode.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.representativeName.toLowerCase().includes(q) ||
          p.programmeType.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }

    const totalMemberRecords = store.groups
      .filter((g) => !g.isProgrammeOnly)
      .reduce((sum, g) => sum + (countMap.get(g.id) || 0), 0);

    const uniqueLocations = Array.from(new Set(store.groups.map((g) => g.location)));
    const uniqueTypes = Array.from(new Set(store.groups.map((g) => g.programmeType)));
    const uniqueSectors = Array.from(new Set(store.groups.map((g) => g.sector)));
    const uniqueRepresentatives = Array.from(
      new Set(store.groups.map((g) => g.representativeName))
    );

    res.json({
      profiles,
      siteMedia: store.siteMedia,
      safariEvents: store.safariEvents || [],
      meta: {
        totalPublicProfiles: store.groups.length,
        memberGroupsCount: store.groups.filter((g) => !g.isProgrammeOnly).length,
        programmeProfilesCount: store.groups.filter((g) => g.isProgrammeOnly).length,
        totalSuppliedMemberRecords: totalMemberRecords,
        locations: uniqueLocations,
        programmeTypes: uniqueTypes,
        sectors: uniqueSectors,
        representatives: uniqueRepresentatives,
      },
    });
  });

  app.get('/api/site-media', (_req: Request, res: Response) => {
    res.json({ siteMedia: store.siteMedia });
  });

  app.get('/api/safari-events', (_req: Request, res: Response) => {
    res.json({ safariEvents: store.safariEvents || [] });
  });

  app.get('/api/directory/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const group = store.groups.find(
      (g) => g.id === idOrSlug || g.slug === idOrSlug
    );
    if (!group) {
      return res.status(404).json({ error: 'Profile not found in ENGANDA directory.' });
    }
    const countMap = getGroupMemberCountMap();
    return res.json({
      profile: toPublicGroupProfile(group, countMap.get(group.id) || 0),
    });
  });

  // ===========================================================================
  // 2. PUBLIC ENQUIRY SUBMISSION (Sponsor, Invest, Partner — No Fake Payments)
  // ===========================================================================
  app.post('/api/enquiries', (req: Request, res: Response) => {
    const {
      groupId,
      supportType,
      contactName,
      email,
      phone,
      organisation,
      packageName,
      message,
      consent,
    } = req.body;

    if (!groupId || !supportType || !contactName || !email || !message) {
      return res.status(400).json({
        error:
          'Please complete all required fields: selected group, support type, contact name, email, and message.',
      });
    }

    if (consent !== true) {
      return res.status(400).json({
        error: 'Please confirm consent for ENGANDA to store and respond to your enquiry.',
      });
    }

    const validTypes = ['Sponsor', 'Invest', 'Partner'];
    const normalizedType = validTypes.includes(supportType) ? supportType : 'Sponsor';

    const targetGroup = store.groups.find(
      (g) => g.id === groupId || g.slug === groupId || g.name === groupId
    );
    const resolvedGroupName = targetGroup ? targetGroup.name : 'ENGANDA Network Umbrella';
    const resolvedGroupId = targetGroup ? targetGroup.id : 'enganda-umbrella';

    store.enquirySequence = (store.enquirySequence || 0) + 1;
    const reference = `ENG-${String(store.enquirySequence).padStart(5, '0')}`;

    const newEnquiry: SupportEnquiryRecord = {
      id: `enq-${Date.now()}-${store.enquirySequence}`,
      reference,
      groupId: resolvedGroupId,
      groupName: resolvedGroupName,
      supportType: normalizedType as 'Sponsor' | 'Invest' | 'Partner',
      contactName: String(contactName).trim().slice(0, 140),
      email: String(email).trim().slice(0, 254),
      phone: String(phone || '').trim().slice(0, 40),
      organisation: String(organisation || '').trim().slice(0, 160),
      packageName: String(packageName || 'General Support').trim().slice(0, 140),
      message: String(message).trim().slice(0, 2500),
      consent: true,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    store.enquiries.unshift(newEnquiry);
    saveStore(store);

    return res.status(201).json({
      success: true,
      reference,
      enquiry: {
        reference: newEnquiry.reference,
        groupName: newEnquiry.groupName,
        supportType: newEnquiry.supportType,
        packageName: newEnquiry.packageName,
        createdAt: newEnquiry.createdAt,
      },
      notice:
        'No payment or investment transaction occurs on this website. Your enquiry has been persistently logged for direct follow-up by the ENGANDA secretariat.',
    });
  });

  // ===========================================================================
  // 2B. QUARTERLY IMPACT NEWSLETTER SUBSCRIPTION (With Consent & Storage)
  // ===========================================================================
  app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
    const { email, name, organisation, consent } = req.body;

    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (consent !== true) {
      return res.status(400).json({
        error:
          'Please check the consent box to subscribe to the quarterly ENGANDA Impact Newsletter.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 254);
    const existing = store.newsletterSubscriptions.find((s) => s.email === cleanEmail);
    if (existing) {
      return res.status(200).json({
        success: true,
        reference: existing.reference,
        alreadySubscribed: true,
        message: 'Your email is already subscribed to the quarterly ENGANDA Impact Newsletter.',
      });
    }

    store.newsletterSequence = (store.newsletterSequence || 0) + 1;
    const reference = `NEWS-${String(store.newsletterSequence).padStart(5, '0')}`;

    const record: NewsletterSubscriptionRecord = {
      id: `sub-${Date.now()}-${store.newsletterSequence}`,
      reference,
      email: cleanEmail,
      name: String(name || '').trim().slice(0, 120),
      organisation: String(organisation || '').trim().slice(0, 160),
      consent: true,
      subscribedAt: new Date().toISOString(),
    };

    store.newsletterSubscriptions.unshift(record);
    saveStore(store);

    return res.status(201).json({
      success: true,
      reference,
      subscription: record,
      message:
        'Subscribed to the quarterly ENGANDA Impact Newsletter. Consent recorded in the ENGANDA database.',
    });
  });

  // ===========================================================================
  // 3. AUTH SESSION REGISTRATION & ACCESS RESOLUTION
  // ===========================================================================
  app.post('/api/auth/session', (req: Request, res: Response) => {
    const email = String(req.body.email || req.headers['x-user-email'] || '')
      .trim()
      .toLowerCase();
    const uid = String(req.body.uid || req.headers['x-user-uid'] || '').trim();
    const displayName = String(req.body.displayName || '').trim();

    if (!email || !email.includes('@')) {
      return res.status(401).json({ error: 'Valid authenticated email is required.' });
    }

    const now = new Date().toISOString();
    const existingUser = store.knownUsers.find((u) => u.email.toLowerCase() === email);
    if (existingUser) {
      existingUser.lastSeenAt = now;
      if (uid) existingUser.uid = uid;
      if (displayName) existingUser.displayName = displayName;
    } else {
      store.knownUsers.push({
        email,
        uid: uid || `uid-${Date.now()}`,
        displayName: displayName || email.split('@')[0],
        firstSignedInAt: now,
        lastSeenAt: now,
      });
    }
    saveStore(store);

    const isGlobalAdmin = GLOBAL_ADMIN_EMAILS.has(email);
    const assignedGroupIds = isGlobalAdmin
      ? store.groups.map((g) => g.id)
      : store.assignments
          .filter((a) => a.email.toLowerCase() === email)
          .map((a) => a.groupId);

    return res.json({
      email,
      isGlobalAdmin,
      assignedGroupIds: Array.from(new Set(assignedGroupIds)),
      hasAccess: isGlobalAdmin || assignedGroupIds.length > 0,
    });
  });

  app.get('/api/admin/access', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({
        error: 'Authentication required. Anonymous users cannot access administration.',
      });
    }

    const assignedGroups = store.groups
      .filter((g) => caller.assignedGroupIds.includes(g.id))
      .map((g) => ({
        id: g.id,
        name: g.name,
        programmeType: g.programmeType,
        isProgrammeOnly: g.isProgrammeOnly,
      }));

    return res.json({
      email: caller.email,
      isGlobalAdmin: caller.isGlobalAdmin,
      assignedGroupIds: caller.assignedGroupIds,
      assignedGroups,
      hasAccess: caller.isGlobalAdmin || caller.assignedGroupIds.length > 0,
    });
  });

  // ===========================================================================
  // 4. PRIVATE MEMBER REGISTRY API (Strict Server-Level Access Control)
  // ===========================================================================
  const handleGetMembers = (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({
        error: 'Authentication required. Anonymous users cannot query member records.',
      });
    }

    if (!caller.isGlobalAdmin && caller.assignedGroupIds.length === 0) {
      return res.status(403).json({
        error: 'No group access assigned',
        code: 'NO_GROUP_ASSIGNED',
      });
    }

    const { groupId, search } = req.query;

    if (groupId && groupId !== 'all') {
      const requestedGroupId = String(groupId);
      if (!canManageGroup(caller, requestedGroupId)) {
        return res.status(403).json({
          error: 'Access denied: You are not assigned as an administrator for this group.',
        });
      }
    }

    const allowedGroupSet = new Set(caller.assignedGroupIds);
    let results = store.members.filter((m) => allowedGroupSet.has(m.groupId));

    if (groupId && groupId !== 'all') {
      results = results.filter((m) => m.groupId === String(groupId));
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).trim().toLowerCase();
      results = results.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          (m.uniqueId || '').toLowerCase().includes(q) ||
          (m.company || '').toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.phone.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.nationalId.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          (Array.isArray(m.skills) && m.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    const groupNameMap = new Map(store.groups.map((g) => [g.id, g.name]));
    const enriched = results.map((m) => ({
      ...m,
      groupName: groupNameMap.get(m.groupId) || m.groupId,
    }));

    return res.json({
      members: enriched,
      totalCount: enriched.length,
    });
  };

  app.get('/api/members', handleGetMembers);
  app.get('/api/admin/members', handleGetMembers);

  app.post('/api/admin/members', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({
        error: 'Authentication required. Anonymous users cannot create member records.',
      });
    }

    const {
      uniqueId,
      groupId,
      company,
      photoUrl,
      fullName,
      title,
      phone,
      email,
      nationalId,
      skills,
      location,
    } = req.body;
    if (!groupId || !fullName || !phone) {
      return res.status(400).json({
        error: 'Group, full name, and phone number are required.',
      });
    }

    if (!canManageGroup(caller, String(groupId))) {
      return res.status(403).json({
        error: 'Access denied: You do not have permission to add members to this group.',
      });
    }

    const targetGroup = store.groups.find((g) => g.id === groupId);
    if (!targetGroup) {
      return res.status(404).json({ error: 'Selected group does not exist.' });
    }

    const dupKey = normalizeDuplicateKey(fullName, phone);
    const existingDup = store.members.find(
      (m) => normalizeDuplicateKey(m.fullName, m.phone) === dupKey
    );
    if (existingDup) {
      return res.status(409).json({
        error: 'A member with this exact full name and phone number already exists.',
      });
    }

    const now = new Date().toISOString();
    const nextCodeNum = store.members.length + 1;
    const resolvedUniqueId =
      uniqueId && String(uniqueId).trim() !== ''
        ? String(uniqueId).trim().toUpperCase().slice(0, 40)
        : `ENG-MEM-${String(nextCodeNum).padStart(4, '0')}`;

    const cleanFullName = String(fullName).trim().slice(0, 140);
    const resolvedPhoto =
      photoUrl && String(photoUrl).trim() !== ''
        ? String(photoUrl).trim()
        : generateAvatarDataUri(cleanFullName, nextCodeNum);

    const newMember: PrivateMemberRecord = {
      id: `mem-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      uniqueId: resolvedUniqueId,
      groupId: String(groupId),
      company: String(company || targetGroup.companyAffiliation || targetGroup.name)
        .trim()
        .slice(0, 140),
      photoUrl: resolvedPhoto,
      fullName: cleanFullName,
      title: String(title || 'Registered Member').trim().slice(0, 100),
      phone: String(phone).trim().slice(0, 40),
      email: String(email || '').trim().slice(0, 254),
      nationalId: String(nationalId || '').trim().toUpperCase().slice(0, 40),
      skills: parseSkillsInput(skills),
      location: String(location || targetGroup.location).trim().slice(0, 140),
      createdAt: now,
      updatedAt: now,
    };

    store.members.unshift(newMember);
    saveStore(store);

    return res.status(201).json({
      success: true,
      member: {
        ...newMember,
        groupName: targetGroup.name,
      },
    });
  });

  app.put('/api/admin/members/:memberId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { memberId } = req.params;
    const idx = store.members.findIndex((m) => m.id === memberId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Member record not found.' });
    }

    const existing = store.members[idx];
    if (!canManageGroup(caller, existing.groupId)) {
      return res.status(403).json({
        error: 'Access denied: You cannot edit members in an unassigned group.',
      });
    }

    const targetGroupId = req.body.groupId ? String(req.body.groupId) : existing.groupId;
    if (!canManageGroup(caller, targetGroupId)) {
      return res.status(403).json({
        error: 'Access denied: You cannot move a member to an unassigned group.',
      });
    }

    const updatedFullName =
      req.body.fullName !== undefined
        ? String(req.body.fullName).trim().slice(0, 140)
        : existing.fullName;

    const updated: PrivateMemberRecord = {
      ...existing,
      uniqueId:
        req.body.uniqueId !== undefined && String(req.body.uniqueId).trim() !== ''
          ? String(req.body.uniqueId).trim().toUpperCase().slice(0, 40)
          : existing.uniqueId,
      groupId: targetGroupId,
      company:
        req.body.company !== undefined
          ? String(req.body.company).trim().slice(0, 140)
          : existing.company,
      photoUrl:
        req.body.photoUrl !== undefined && String(req.body.photoUrl).trim() !== ''
          ? String(req.body.photoUrl).trim()
          : existing.photoUrl || generateAvatarDataUri(updatedFullName, idx + 1),
      fullName: updatedFullName,
      title:
        req.body.title !== undefined
          ? String(req.body.title).trim().slice(0, 100)
          : existing.title,
      phone:
        req.body.phone !== undefined
          ? String(req.body.phone).trim().slice(0, 40)
          : existing.phone,
      email:
        req.body.email !== undefined
          ? String(req.body.email).trim().slice(0, 254)
          : existing.email,
      nationalId:
        req.body.nationalId !== undefined
          ? String(req.body.nationalId).trim().toUpperCase().slice(0, 40)
          : existing.nationalId,
      skills:
        req.body.skills !== undefined ? parseSkillsInput(req.body.skills) : existing.skills,
      location:
        req.body.location !== undefined
          ? String(req.body.location).trim().slice(0, 140)
          : existing.location,
      updatedAt: new Date().toISOString(),
    };

    store.members[idx] = updated;
    saveStore(store);

    const groupName = store.groups.find((g) => g.id === updated.groupId)?.name || updated.groupId;
    return res.json({
      success: true,
      member: { ...updated, groupName },
    });
  });

  app.delete('/api/admin/members/:memberId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { memberId } = req.params;
    const existing = store.members.find((m) => m.id === memberId);
    if (!existing) {
      return res.status(404).json({ error: 'Member record not found.' });
    }

    if (!canManageGroup(caller, existing.groupId)) {
      return res.status(403).json({
        error: 'Access denied: You cannot delete members from an unassigned group.',
      });
    }

    store.members = store.members.filter((m) => m.id !== memberId);
    saveStore(store);

    return res.json({
      success: true,
      deletedId: memberId,
    });
  });

  app.post('/api/admin/members/bulk-import', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { defaultGroupId, rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'No rows provided for import.' });
    }

    if (rows.length > 500) {
      return res.status(400).json({
        error: `Import exceeds the maximum limit of 500 rows per upload (${rows.length} rows supplied).`,
      });
    }

    const existingKeys = new Set(
      store.members.map((m) => normalizeDuplicateKey(m.fullName, m.phone))
    );

    let importedCount = 0;
    let skippedCount = 0;
    const skippedReasons: { row: number; name: string; reason: string }[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || {};
      const fullName = String(r.fullName || r.name || '').trim();
      const phone = String(r.phone || r.contact || '').trim();
      const title = String(r.title || r.role || 'Registered Member').trim();
      const email = String(r.email || '').trim();
      const nationalId = String(r.nationalId || r.nin || r.passport || '')
        .trim()
        .toUpperCase();
      const company = String(r.company || r.enterprise || '').trim();
      const uniqueId = String(r.uniqueId || r.memberId || '').trim().toUpperCase();
      const skills = parseSkillsInput(r.skills);
      const rawGroup = String(r.groupId || r.group || defaultGroupId || '').trim();

      const matchedGroup = store.groups.find(
        (g) =>
          g.id === rawGroup ||
          g.uniqueGroupCode?.toLowerCase() === rawGroup.toLowerCase() ||
          g.slug.toLowerCase() === rawGroup.toLowerCase() ||
          g.name.toLowerCase() === rawGroup.toLowerCase()
      );

      if (!matchedGroup) {
        skippedCount++;
        skippedReasons.push({
          row: i + 1,
          name: fullName || 'Unknown',
          reason: 'Invalid or missing target group',
        });
        continue;
      }

      if (!canManageGroup(caller, matchedGroup.id)) {
        skippedCount++;
        skippedReasons.push({
          row: i + 1,
          name: fullName || 'Unknown',
          reason: `Unassigned group (${matchedGroup.name})`,
        });
        continue;
      }

      if (!fullName || fullName.length < 2 || !phone || phone.replace(/[^0-9]/g, '').length < 6) {
        skippedCount++;
        skippedReasons.push({
          row: i + 1,
          name: fullName || 'Empty',
          reason: 'Missing valid full name or phone number',
        });
        continue;
      }

      const dupKey = normalizeDuplicateKey(fullName, phone);
      if (existingKeys.has(dupKey)) {
        skippedCount++;
        skippedReasons.push({
          row: i + 1,
          name: fullName,
          reason: 'Exact duplicate (normalized full name + phone)',
        });
        continue;
      }

      existingKeys.add(dupKey);
      const location = String(r.location || matchedGroup.location).trim();
      const seqNum = store.members.length + 1;

      store.members.push({
        id: `mem-${Date.now()}-${i}-${Math.floor(100 + Math.random() * 899)}`,
        uniqueId: uniqueId || `ENG-MEM-${String(seqNum).padStart(4, '0')}`,
        groupId: matchedGroup.id,
        company: (company || matchedGroup.companyAffiliation || matchedGroup.name).slice(0, 140),
        photoUrl:
          r.photoUrl && String(r.photoUrl).trim() !== ''
            ? String(r.photoUrl).trim()
            : generateAvatarDataUri(fullName, seqNum),
        fullName: fullName.slice(0, 140),
        title: title.slice(0, 100),
        phone: phone.slice(0, 40),
        email: email.slice(0, 254),
        nationalId: nationalId.slice(0, 40),
        skills,
        location: location.slice(0, 140),
        createdAt: now,
        updatedAt: now,
      });

      importedCount++;
    }

    if (importedCount > 0) {
      saveStore(store);
    }

    return res.json({
      success: true,
      importedCount,
      skippedCount,
      skippedReasons,
    });
  });

  // ===========================================================================
  // 5. GROUP PROFILE & PROJECT ADMINISTRATION (Website, Project, Support Focus)
  // ===========================================================================
  app.put('/api/admin/groups/:groupId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { groupId } = req.params;
    if (!canManageGroup(caller, groupId)) {
      return res.status(403).json({
        error: 'Access denied: You are not authorized to edit this group profile.',
      });
    }

    const idx = store.groups.findIndex((g) => g.id === groupId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Group profile not found.' });
    }

    const existing = store.groups[idx];
    const updated: NetworkGroupRecord = {
      ...existing,
      summary:
        req.body.summary !== undefined
          ? String(req.body.summary).trim().slice(0, 600)
          : existing.summary,
      representativeName:
        req.body.representativeName !== undefined
          ? String(req.body.representativeName).trim().slice(0, 140)
          : existing.representativeName,
      representativeTitle:
        req.body.representativeTitle !== undefined
          ? String(req.body.representativeTitle).trim().slice(0, 140)
          : existing.representativeTitle,
      projectName:
        req.body.projectName !== undefined
          ? String(req.body.projectName).trim().slice(0, 180)
          : existing.projectName,
      projectDescription:
        req.body.projectDescription !== undefined
          ? String(req.body.projectDescription).trim().slice(0, 1200)
          : existing.projectDescription,
      supportFocus:
        req.body.supportFocus !== undefined
          ? String(req.body.supportFocus).trim().slice(0, 600)
          : existing.supportFocus,
      websiteUrl:
        req.body.websiteUrl !== undefined
          ? String(req.body.websiteUrl).trim().slice(0, 300)
          : existing.websiteUrl,
      galleryImages: Array.isArray(req.body.galleryImages)
        ? req.body.galleryImages
            .map((img: unknown) => String(img || '').trim())
            .filter(Boolean)
            .slice(0, 5)
        : existing.galleryImages || [],
      updatedAt: new Date().toISOString(),
    };

    store.groups[idx] = updated;
    saveStore(store);

    const countMap = getGroupMemberCountMap();
    return res.json({
      success: true,
      profile: toPublicGroupProfile(updated, countMap.get(updated.id) || 0),
    });
  });

  app.put('/api/admin/site-media', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || (!caller.isGlobalAdmin && caller.assignedGroupIds.length === 0)) {
      return res.status(403).json({
        error: 'Administrator privileges required to replace site photos.',
      });
    }

    const allowedKeys = [
      'heroBannerImage',
      'aboutMissionImage',
      'organiseStageImage',
      'formaliseStageImage',
      'growStageImage',
      'humanCapacityImage',
      'economicStructureImage',
      'civicAgencyImage',
      'sizStewardshipImage',
      'egyaBannerImage',
      'leoleoBannerImage',
      'founderMugisaImage',
      'founderRonnieImage',
    ] as const;

    const updatedMedia = { ...store.siteMedia };
    for (const key of allowedKeys) {
      if (req.body[key] !== undefined && String(req.body[key]).trim() !== '') {
        updatedMedia[key] = String(req.body[key]).trim();
      }
    }

    store.siteMedia = updatedMedia;
    saveStore(store);

    return res.json({
      success: true,
      siteMedia: store.siteMedia,
    });
  });

  // ===========================================================================
  // 5B. ADMIN: ENGANDA SAFARIS, EVENTS & UPCOMING PROGRAMS (Carousel & Upcoming)
  // ===========================================================================
  app.post('/api/admin/safari-events', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || (!caller.isGlobalAdmin && caller.assignedGroupIds.length === 0)) {
      return res.status(403).json({
        error: 'Administrator privileges required to load new events or trips.',
      });
    }

    const {
      code,
      title,
      category,
      dateLabel,
      durationLabel,
      location,
      feeOrSponsorshipLabel,
      organizer,
      summary,
      highlights,
      imageUrl,
      showOnCarousel,
      showInUpcoming,
      ctaLabel,
    } = req.body;

    if (!title || !dateLabel || !location) {
      return res.status(400).json({
        error: 'Event / Trip title, date, and location are required.',
      });
    }

    const validCategories: SafariEventCategory[] = [
      'ENGANDA Safari & Eco-Trip',
      'Youth Sports & Gala',
      'SACCO & Enterprise Exchange',
      'Tree Stewardship & Conservation',
      'Community Cultural Expedition',
    ];
    const resolvedCategory: SafariEventCategory = validCategories.includes(category)
      ? category
      : 'ENGANDA Safari & Eco-Trip';

    const now = new Date().toISOString();
    const seq = (store.safariEvents?.length || 0) + 1;
    const parsedHighlights = Array.isArray(highlights)
      ? highlights.map((h) => String(h || '').trim()).filter(Boolean).slice(0, 6)
      : typeof highlights === 'string' && highlights.trim() !== ''
      ? highlights
          .split(/[\n;]+/)
          .map((h) => h.trim())
          .filter(Boolean)
          .slice(0, 6)
      : ['Community guided itinerary', 'Youth enterprise & conservation focus'];

    const newEvent: SafariEventRecord = {
      id: `saf-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
      code:
        code && String(code).trim() !== ''
          ? String(code).trim().toUpperCase().slice(0, 24)
          : `SAF-2025-${String(seq).padStart(2, '0')}`,
      title: String(title).trim().slice(0, 160),
      category: resolvedCategory,
      dateLabel: String(dateLabel).trim().slice(0, 80),
      durationLabel: String(durationLabel || 'Full Day Experience').trim().slice(0, 60),
      location: String(location).trim().slice(0, 140),
      feeOrSponsorshipLabel: String(
        feeOrSponsorshipLabel || 'Open Registration • Partner Sponsorship Available'
      )
        .trim()
        .slice(0, 120),
      organizer: String(organizer || 'ENGANDA Safaris & Network Secretariat')
        .trim()
        .slice(0, 120),
      summary: String(
        summary ||
          'Community expedition and capacity-building event organized under the ENGANDA umbrella.'
      )
        .trim()
        .slice(0, 600),
      highlights: parsedHighlights,
      imageUrl:
        imageUrl && String(imageUrl).trim() !== ''
          ? String(imageUrl).trim()
          : PHOTO_ASSETS.SAFARI_LAKE,
      showOnCarousel: showOnCarousel !== undefined ? Boolean(showOnCarousel) : true,
      showInUpcoming: showInUpcoming !== undefined ? Boolean(showInUpcoming) : true,
      ctaLabel: String(ctaLabel || 'Book Safari / Register').trim().slice(0, 50),
      createdAt: now,
      updatedAt: now,
    };

    if (!Array.isArray(store.safariEvents)) {
      store.safariEvents = [];
    }
    store.safariEvents.unshift(newEvent);
    saveStore(store);

    return res.status(201).json({
      success: true,
      safariEvent: newEvent,
      safariEvents: store.safariEvents,
    });
  });

  app.put('/api/admin/safari-events/:eventId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || (!caller.isGlobalAdmin && caller.assignedGroupIds.length === 0)) {
      return res.status(403).json({
        error: 'Administrator privileges required to update events or trips.',
      });
    }

    const { eventId } = req.params;
    if (!Array.isArray(store.safariEvents)) {
      store.safariEvents = [];
    }
    const idx = store.safariEvents.findIndex((e) => e.id === eventId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Safari trip or event not found.' });
    }

    const existing = store.safariEvents[idx];
    const parsedHighlights =
      req.body.highlights !== undefined
        ? Array.isArray(req.body.highlights)
          ? req.body.highlights
              .map((h: unknown) => String(h || '').trim())
              .filter(Boolean)
              .slice(0, 6)
          : String(req.body.highlights)
              .split(/[\n;]+/)
              .map((h) => h.trim())
              .filter(Boolean)
              .slice(0, 6)
        : existing.highlights;

    const updated: SafariEventRecord = {
      ...existing,
      code:
        req.body.code !== undefined && String(req.body.code).trim() !== ''
          ? String(req.body.code).trim().toUpperCase().slice(0, 24)
          : existing.code,
      title:
        req.body.title !== undefined
          ? String(req.body.title).trim().slice(0, 160)
          : existing.title,
      category:
        req.body.category !== undefined ? req.body.category : existing.category,
      dateLabel:
        req.body.dateLabel !== undefined
          ? String(req.body.dateLabel).trim().slice(0, 80)
          : existing.dateLabel,
      durationLabel:
        req.body.durationLabel !== undefined
          ? String(req.body.durationLabel).trim().slice(0, 60)
          : existing.durationLabel,
      location:
        req.body.location !== undefined
          ? String(req.body.location).trim().slice(0, 140)
          : existing.location,
      feeOrSponsorshipLabel:
        req.body.feeOrSponsorshipLabel !== undefined
          ? String(req.body.feeOrSponsorshipLabel).trim().slice(0, 120)
          : existing.feeOrSponsorshipLabel,
      organizer:
        req.body.organizer !== undefined
          ? String(req.body.organizer).trim().slice(0, 120)
          : existing.organizer,
      summary:
        req.body.summary !== undefined
          ? String(req.body.summary).trim().slice(0, 600)
          : existing.summary,
      highlights: parsedHighlights,
      imageUrl:
        req.body.imageUrl !== undefined && String(req.body.imageUrl).trim() !== ''
          ? String(req.body.imageUrl).trim()
          : existing.imageUrl,
      showOnCarousel:
        req.body.showOnCarousel !== undefined
          ? Boolean(req.body.showOnCarousel)
          : existing.showOnCarousel,
      showInUpcoming:
        req.body.showInUpcoming !== undefined
          ? Boolean(req.body.showInUpcoming)
          : existing.showInUpcoming,
      ctaLabel:
        req.body.ctaLabel !== undefined
          ? String(req.body.ctaLabel).trim().slice(0, 50)
          : existing.ctaLabel,
      updatedAt: new Date().toISOString(),
    };

    store.safariEvents[idx] = updated;
    saveStore(store);

    return res.json({
      success: true,
      safariEvent: updated,
      safariEvents: store.safariEvents,
    });
  });

  app.delete('/api/admin/safari-events/:eventId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || (!caller.isGlobalAdmin && caller.assignedGroupIds.length === 0)) {
      return res.status(403).json({
        error: 'Administrator privileges required to delete events or trips.',
      });
    }

    const { eventId } = req.params;
    const prevLen = store.safariEvents?.length || 0;
    store.safariEvents = (store.safariEvents || []).filter((e) => e.id !== eventId);
    if (store.safariEvents.length === prevLen) {
      return res.status(404).json({ error: 'Safari trip or event not found.' });
    }

    saveStore(store);
    return res.json({
      success: true,
      deletedId: eventId,
      safariEvents: store.safariEvents,
    });
  });

  // ===========================================================================
  // 6. GLOBAL ADMIN: GROUP-ADMIN ASSIGNMENTS & KNOWN USERS
  // ===========================================================================
  app.get('/api/admin/assignments', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required to view group assignments.',
      });
    }

    const groupNameMap = new Map(store.groups.map((g) => [g.id, g.name]));
    return res.json({
      assignments: store.assignments.map((a) => ({
        ...a,
        groupName: groupNameMap.get(a.groupId) || a.groupId,
      })),
      knownUsers: store.knownUsers,
    });
  });

  app.post('/api/admin/assignments', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required to assign group access.',
      });
    }

    const email = String(req.body.email || '').trim().toLowerCase();
    const groupId = String(req.body.groupId || '').trim();

    if (!email || !email.includes('@') || !groupId) {
      return res.status(400).json({ error: 'Account email and target group are required.' });
    }

    const targetGroup = store.groups.find((g) => g.id === groupId);
    if (!targetGroup) {
      return res.status(404).json({ error: 'Selected group does not exist.' });
    }

    const hasSignedIn = store.knownUsers.some((u) => u.email.toLowerCase() === email);
    if (!hasSignedIn) {
      return res.status(400).json({
        error:
          'This person has not signed in to ENGANDA yet. Please ask them to sign in once with their account before assigning group access.',
        code: 'USER_NOT_SIGNED_IN_YET',
      });
    }

    const alreadyAssigned = store.assignments.find(
      (a) => a.email.toLowerCase() === email && a.groupId === groupId
    );
    if (alreadyAssigned) {
      return res.status(409).json({
        error: `${email} is already assigned as a group administrator for ${targetGroup.name}.`,
      });
    }

    const newAssignment = {
      id: `asgn-${Date.now()}-${Math.floor(100 + Math.random() * 899)}`,
      email,
      groupId,
      assignedBy: caller.email,
      assignedAt: new Date().toISOString(),
    };

    store.assignments.push(newAssignment);
    saveStore(store);

    return res.status(201).json({
      success: true,
      assignment: {
        ...newAssignment,
        groupName: targetGroup.name,
      },
    });
  });

  app.delete('/api/admin/assignments/:assignmentId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required to revoke group access.',
      });
    }

    const { assignmentId } = req.params;
    const prevLen = store.assignments.length;
    store.assignments = store.assignments.filter((a) => a.id !== assignmentId);
    if (store.assignments.length === prevLen) {
      return res.status(404).json({ error: 'Assignment record not found.' });
    }

    saveStore(store);
    return res.json({ success: true, revokedId: assignmentId });
  });

  // ===========================================================================
  // 7. GLOBAL ADMIN: PRIVATE ENQUIRIES INBOX
  // ===========================================================================
  app.get('/api/admin/enquiries', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required to access partnership enquiries.',
      });
    }

    return res.json({
      enquiries: store.enquiries,
      newsletterSubscriptions: store.newsletterSubscriptions,
    });
  });

  app.patch('/api/admin/enquiries/:enquiryId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required.',
      });
    }

    const { enquiryId } = req.params;
    const { status } = req.body;
    const item = store.enquiries.find((e) => e.id === enquiryId || e.reference === enquiryId);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    if (['NEW', 'IN_REVIEW', 'RESPONDED'].includes(status)) {
      item.status = status;
      saveStore(store);
    }

    return res.json({ success: true, enquiry: item });
  });

  app.delete('/api/admin/enquiries/:enquiryId', (req: Request, res: Response) => {
    const caller = resolveCaller(req);
    if (!caller || !caller.isGlobalAdmin) {
      return res.status(403).json({
        error: 'Global ENGANDA administrator privileges required.',
      });
    }

    const { enquiryId } = req.params;
    store.enquiries = store.enquiries.filter(
      (e) => e.id !== enquiryId && e.reference !== enquiryId
    );
    saveStore(store);
    return res.json({ success: true, deletedId: enquiryId });
  });

  // Serve Frontend
  const distPath = path.resolve(__dirname, 'dist');
  const distIndex = path.resolve(distPath, 'index.html');
  if (process.env.NODE_ENV === 'production' && fs.existsSync(distIndex)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndex);
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ENGANDA] Application server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ENGANDA] Fatal server startup error:', err);
  process.exit(1);
});
