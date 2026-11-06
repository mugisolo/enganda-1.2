import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldAlert,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Users,
  Search,
  Download,
  Upload,
  Lock,
  KeyRound,
  Mail,
  Globe,
  FileSpreadsheet,
  AlertTriangle,
  Save,
  Building2,
  Award,
  Camera,
  Fingerprint,
  Images,
  Compass,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  PublicGroupProfile,
  PrivateMemberRecord,
  GroupAdminAssignment,
  KnownUserAccount,
  SupportEnquiryRecord,
  SiteMediaSettings,
  SafariEventItem,
  SafariEventCategory,
} from '../types';
import {
  AI_GENERATED_PHOTO_LIBRARY,
  DEFAULT_SITE_MEDIA,
  DEFAULT_SAFARI_EVENTS,
  SAFARI_LAKE_VICTORIA_IMAGE,
} from '../data/content';

export type AdminTabType =
  | 'members'
  | 'bulk-import'
  | 'groups'
  | 'site-media'
  | 'safaris-events'
  | 'assignments'
  | 'enquiries';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PublicGroupProfile[];
  siteMedia: SiteMediaSettings;
  safariEvents?: SafariEventItem[];
  initialTab?: AdminTabType;
  initialGroupId?: string;
  onDataMutated: () => void;
}

interface ParsedCsvRowPreview {
  rowNumber: number;
  uniqueId: string;
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  nationalId: string;
  skills: string[];
  location: string;
  groupId: string;
  isValid: boolean;
  validationNote: string;
}

const PRESET_SKILLS = [
  'SACCO Governance',
  'Financial Literacy',
  'Bookkeeping',
  'Automotive Mechanics',
  'Sports Coaching & Mentorship',
  'Digital & Creative Media',
  'Cold-Chain Fish Processing',
  'Sustainable Agriculture',
  'Carpentry & Joinery',
  'Tailoring & Garment Design',
  'Enterprise Management',
  'Youth Mobilisation',
];

const PRESET_COMPANIES = [
  'SIZ Football Academy',
  'BEP Auto Garage',
  'LeoLeo Enterprise',
  'EGYA Association',
  'Kiwafu Community SACCO',
  'Kigungu Fisheries Cooperative',
];

const SITE_MEDIA_SLOTS: {
  key: keyof SiteMediaSettings;
  label: string;
  section: string;
}[] = [
  {
    key: 'heroBannerImage',
    label: 'Hero Section Main Banner',
    section: 'Hero Section (Top Right Editorial Showcase)',
  },
  {
    key: 'aboutMissionImage',
    label: 'About Section Mission Showcase',
    section: 'About ENGANDA (Right-Column Showcase)',
  },
  {
    key: 'organiseStageImage',
    label: 'Stage 01: Organise Photo',
    section: 'Operating Model (Organise Card Banner)',
  },
  {
    key: 'formaliseStageImage',
    label: 'Stage 02: Formalise Photo',
    section: 'Operating Model (Formalise Card Banner)',
  },
  {
    key: 'growStageImage',
    label: 'Stage 03: Grow Photo',
    section: 'Operating Model (Grow Card Banner)',
  },
  {
    key: 'humanCapacityImage',
    label: 'Pillar 1: Human Capacity Photo',
    section: 'Three Connected Areas of Capacity',
  },
  {
    key: 'economicStructureImage',
    label: 'Pillar 2: Economic Structure Photo',
    section: 'Three Connected Areas of Capacity',
  },
  {
    key: 'civicAgencyImage',
    label: 'Pillar 3: Civic Agency Photo',
    section: 'Three Connected Areas of Capacity',
  },
  {
    key: 'sizStewardshipImage',
    label: 'SIZ "Plant a Tree, Plant a Player" Photo',
    section: 'Flagship Programmes (SIZ Football Academy)',
  },
  {
    key: 'egyaBannerImage',
    label: 'EGYA Association Default Banner',
    section: 'Flagship Programmes (EGYA Association)',
  },
  {
    key: 'leoleoBannerImage',
    label: 'LeoLeo Programme Default Banner',
    section: 'Flagship Programmes (LeoLeo)',
  },
  {
    key: 'founderMugisaImage',
    label: 'Founder Portrait: Mugisa Solomon Byakutaaga',
    section: 'Executive Leadership Section',
  },
  {
    key: 'founderRonnieImage',
    label: 'Co-Founder Portrait: Ronnie Tumusiime',
    section: 'Executive Leadership Section',
  },
];

function makeFallbackAvatarSvg(fullName: string): string {
  const parts = String(fullName || 'Member')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (parts[0]?.slice(0, 2) || 'EM').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#0F5132"/><circle cx="48" cy="48" r="44" fill="none" stroke="#D97706" stroke-width="2" stroke-opacity="0.65"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FEF3C7" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="32" font-weight="800">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function parseCsvText(csvText: string): Record<string, string>[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim().length > 0);

  if (lines.length < 2) return [];

  const splitCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = splitCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    if (cells.every((c) => c === '')) continue;
    const obj: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      const cleanHeader = h.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      obj[cleanHeader] = cells[idx] ?? '';
    });
    rows.push(obj);
  }

  return rows;
}

function normalizePreviewDupKey(fullName: string, phone: string): string {
  const nName = String(fullName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  const nPhone = String(phone || '').replace(/[^0-9]/g, '').slice(-9);
  return `${nName}::${nPhone}`;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  profiles,
  siteMedia,
  safariEvents,
  initialTab,
  initialGroupId,
  onDataMutated,
}) => {
  const {
    user,
    isGlobalAdmin,
    assignedGroupIds,
    hasGroupAccess,
    signIn,
    signOut,
    getAuthHeaders,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab || 'members');

  // Private Members State
  const [members, setMembers] = useState<PrivateMemberRecord[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [memberSearch, setMemberSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  // Manual Add / Edit Member State
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<PrivateMemberRecord | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [memberForm, setMemberForm] = useState({
    uniqueId: '',
    groupId: 'grp-abayita-ababiri',
    company: 'SIZ Football Academy',
    fullName: '',
    title: 'Registered Member',
    phone: '',
    email: '',
    nationalId: '',
    photoUrl: '',
    skills: ['Financial Literacy', 'SACCO Governance'] as string[],
    location: 'Entebbe, Uganda',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Bulk CSV Import State
  const [importGroupId, setImportGroupId] = useState<string>('grp-abayita-ababiri');
  const [csvRawText, setCsvRawText] = useState('');
  const [previewRows, setPreviewRows] = useState<ParsedCsvRowPreview[]>([]);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    skippedCount: number;
    skippedReasons: { row: number; name: string; reason: string }[];
  } | null>(null);
  const [importing, setImporting] = useState(false);

  // Group Profile & 5-Photo Gallery Editor State
  const [editingGroupId, setEditingGroupId] = useState<string>('grp-siz-academy');
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [groupEditForm, setGroupEditForm] = useState({
    summary: '',
    representativeName: '',
    representativeTitle: '',
    projectName: '',
    projectDescription: '',
    supportFocus: '',
    websiteUrl: '',
    galleryImages: [] as string[],
  });

  // Site Media (Blank-Space & Section Photos) Editor State
  const [siteMediaForm, setSiteMediaForm] = useState<SiteMediaSettings>({
    ...DEFAULT_SITE_MEDIA,
    ...siteMedia,
  });
  const [savingSiteMedia, setSavingSiteMedia] = useState(false);

  // ENGANDA Safaris, Events & Upcoming Programs State
  const [editingSafariId, setEditingSafariId] = useState<string | null>(null);
  const [savingSafariEvent, setSavingSafariEvent] = useState(false);
  const [safariForm, setSafariForm] = useState<{
    code: string;
    title: string;
    category: SafariEventCategory;
    dateLabel: string;
    durationLabel: string;
    location: string;
    feeOrSponsorshipLabel: string;
    organizer: string;
    summary: string;
    highlightsText: string;
    imageUrl: string;
    showOnCarousel: boolean;
    showInUpcoming: boolean;
    ctaLabel: string;
  }>({
    code: '',
    title: '',
    category: 'ENGANDA Safari & Eco-Trip',
    dateLabel: 'October 18 – October 20, 2025',
    durationLabel: '3 Days / 2 Nights',
    location: 'Entebbe Pier → Ssese Islands, Lake Victoria',
    feeOrSponsorshipLabel: 'UGX 180,000 / Person • Partner Sponsored Slots Available',
    organizer: 'ENGANDA Safaris & Community Cooperatives',
    summary: '',
    highlightsText:
      'Guided Lake Victoria eco-boat excursion\nCommunity SACCO & fisheries cooperative exchange\nYouth conservation & leadership campfire session',
    imageUrl: SAFARI_LAKE_VICTORIA_IMAGE,
    showOnCarousel: true,
    showInUpcoming: true,
    ctaLabel: 'Book Safari / Register',
  });

  // Global Admin Assignments & Enquiries State
  const [assignments, setAssignments] = useState<GroupAdminAssignment[]>([]);
  const [knownUsers, setKnownUsers] = useState<KnownUserAccount[]>([]);
  const [assignEmail, setAssignEmail] = useState('');
  const [assignGroupId, setAssignGroupId] = useState('grp-abayita-ababiri');
  const [enquiries, setEnquiries] = useState<SupportEnquiryRecord[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<
    {
      id: string;
      reference: string;
      email: string;
      name: string;
      organisation: string;
      consent: boolean;
      subscribedAt: string;
    }[]
  >([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');

  // Status Notices
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showBanner = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 5000);
  };

  const allowedProfiles = profiles.filter(
    (p) => isGlobalAdmin || assignedGroupIds.includes(p.id)
  );
  const allowedMemberGroups = allowedProfiles.filter((p) => !p.isProgrammeOnly);

  const populateGroupEditForm = useCallback((prof: PublicGroupProfile) => {
    setEditingGroupId(prof.id);
    setGroupEditForm({
      summary: prof.summary,
      representativeName: prof.representativeName,
      representativeTitle: prof.representativeTitle,
      projectName: prof.projectName,
      projectDescription: prof.projectDescription,
      supportFocus: prof.supportFocus,
      websiteUrl: prof.websiteUrl || '',
      galleryImages: Array.isArray(prof.galleryImages)
        ? prof.galleryImages.slice(0, 5)
        : [],
    });
  }, []);

  const fetchMembers = useCallback(async () => {
    if (!user || !hasGroupAccess) return;
    setLoadingMembers(true);
    try {
      const params = new URLSearchParams();
      if (selectedGroupFilter !== 'all') {
        params.set('groupId', selectedGroupFilter);
      }
      if (memberSearch.trim() !== '') {
        params.set('search', memberSearch.trim());
      }
      const res = await fetch(`/api/admin/members?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setPage(1);
      }
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setLoadingMembers(false);
    }
  }, [user, hasGroupAccess, selectedGroupFilter, memberSearch, getAuthHeaders]);

  const fetchGlobalAdminData = useCallback(async () => {
    if (!user || !isGlobalAdmin) return;
    try {
      const [asgnRes, enqRes] = await Promise.all([
        fetch('/api/admin/assignments', { headers: getAuthHeaders() }),
        fetch('/api/admin/enquiries', { headers: getAuthHeaders() }),
      ]);
      if (asgnRes.ok) {
        const aData = await asgnRes.json();
        setAssignments(aData.assignments || []);
        setKnownUsers(aData.knownUsers || []);
      }
      if (enqRes.ok) {
        const eData = await enqRes.json();
        setEnquiries(eData.enquiries || []);
        setNewsletterSubs(eData.newsletterSubscriptions || []);
      }
    } catch (err) {
      console.error('Error loading global admin data:', err);
    }
  }, [user, isGlobalAdmin, getAuthHeaders]);

  useEffect(() => {
    if (isOpen && user && hasGroupAccess) {
      fetchMembers();
      if (isGlobalAdmin) {
        fetchGlobalAdminData();
      }
    }
  }, [isOpen, user, hasGroupAccess, isGlobalAdmin, fetchMembers, fetchGlobalAdminData]);

  useEffect(() => {
    setSiteMediaForm({
      ...DEFAULT_SITE_MEDIA,
      ...siteMedia,
    });
  }, [siteMedia, isOpen]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (allowedMemberGroups.length > 0) {
      const firstGrp = allowedMemberGroups[0];
      setMemberForm((prev) => ({
        ...prev,
        groupId: firstGrp.id,
        company: firstGrp.companyAffiliation || firstGrp.name,
      }));
      setImportGroupId(firstGrp.id);
    }
    if (allowedProfiles.length > 0) {
      const preferredProf =
        (initialGroupId && allowedProfiles.find((p) => p.id === initialGroupId)) ||
        allowedProfiles[0];
      populateGroupEditForm(preferredProf);
    }
  }, [isOpen, isGlobalAdmin, assignedGroupIds.length, initialGroupId, populateGroupEditForm]);

  if (!isOpen) return null;

  // Handle selecting a group to edit in Tab 3
  const handleSelectGroupToEdit = (groupId: string) => {
    const found = profiles.find((p) => p.id === groupId);
    if (found) {
      populateGroupEditForm(found);
    }
  };

  // Group 5-Photo Gallery Handlers
  const handleAddGalleryPhoto = (urlOrDataUri: string) => {
    const clean = urlOrDataUri.trim();
    if (!clean) return;
    setGroupEditForm((prev) => {
      if (prev.galleryImages.length >= 5) {
        showBanner('error', 'Each group gallery can hold up to 5 pictures. Remove or replace one first.');
        return prev;
      }
      return {
        ...prev,
        galleryImages: [...prev.galleryImages, clean].slice(0, 5),
      };
    });
  };

  const handleReplaceGalleryPhotoAt = (idx: number, urlOrDataUri: string) => {
    const clean = urlOrDataUri.trim();
    if (!clean) return;
    setGroupEditForm((prev) => {
      const next = [...prev.galleryImages];
      next[idx] = clean;
      return { ...prev, galleryImages: next.slice(0, 5) };
    });
  };

  const handleRemoveGalleryPhotoAt = (idx: number) => {
    setGroupEditForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  const handleSetGalleryCoverPhoto = (idx: number) => {
    if (idx === 0) return;
    setGroupEditForm((prev) => {
      const next = [...prev.galleryImages];
      const [chosen] = next.splice(idx, 1);
      next.unshift(chosen);
      return { ...prev, galleryImages: next };
    });
  };

  const handleUploadGroupGalleryFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    replaceIdx?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = String(evt.target?.result || '');
      if (!dataUrl) return;
      if (typeof replaceIdx === 'number') {
        handleReplaceGalleryPhotoAt(replaceIdx, dataUrl);
      } else {
        handleAddGalleryPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Site Media Photo Upload / Replacement Handlers
  const handleSiteMediaFileUpload = (
    key: keyof SiteMediaSettings,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = String(evt.target?.result || '');
      if (dataUrl) {
        setSiteMediaForm((prev) => ({ ...prev, [key]: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSiteMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSiteMedia(true);
    try {
      const res = await fetch('/api/admin/site-media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(siteMediaForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Could not save site photos.');
      } else {
        showBanner('success', 'Site photos updated and saved persistently.');
        onDataMutated();
      }
    } catch (err) {
      console.error('Save site media error:', err);
      showBanner('error', 'Network error while saving site photos.');
    } finally {
      setSavingSiteMedia(false);
    }
  };

  // Toggle skill chip in memberForm
  const handleToggleSkill = (skill: string) => {
    setMemberForm((prev) => {
      const exists = prev.skills.includes(skill);
      const updated = exists
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  const handleAddCustomSkills = () => {
    const raw = customSkillInput.trim();
    if (!raw) return;
    const parts = raw
      .split(/[,;|]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setMemberForm((prev) => {
      const merged = Array.from(new Set([...prev.skills, ...parts]));
      return { ...prev, skills: merged };
    });
    setCustomSkillInput('');
  };

  // Handle member photo upload (converts image to Data URI)
  const handleMemberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = String(evt.target?.result || '');
      if (dataUrl) {
        setMemberForm((prev) => ({ ...prev, photoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save manual member creation or update
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember
        ? `/api/admin/members/${editingMember.id}`
        : '/api/admin/members';
      const method = editingMember ? 'PUT' : 'POST';

      const payload = {
        ...memberForm,
        photoUrl:
          memberForm.photoUrl.trim() || makeFallbackAvatarSvg(memberForm.fullName),
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Could not save member record.');
        return;
      }

      showBanner(
        'success',
        editingMember
          ? `Updated member record for ${data.member.fullName} (${data.member.uniqueId}).`
          : `Added member record for ${data.member.fullName} (${data.member.uniqueId}).`
      );
      setShowMemberForm(false);
      setEditingMember(null);
      await fetchMembers();
      onDataMutated();
    } catch (err) {
      console.error('Save member error:', err);
      showBanner('error', 'Network error while saving member record.');
    }
  };

  const handleConfirmDeleteMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Failed to delete member.');
        return;
      }
      setConfirmDeleteId(null);
      showBanner('success', 'Member record deleted and group count updated.');
      await fetchMembers();
      onDataMutated();
    } catch (err) {
      console.error('Delete member error:', err);
      showBanner('error', 'Failed to delete member.');
    }
  };

  // Export Group Directory CSV for local record-keeping
  const handleExportDirectoryCsv = () => {
    const directorySource = allowedProfiles.length > 0 ? allowedProfiles : profiles;
    const headers = [
      'Unique Group ID',
      'Group / Programme Name',
      'Programme Type',
      'Sector',
      'Company Affiliation',
      'Location',
      'Public Representative',
      'Representative Title',
      'Member Count',
      'Project Name',
      'Project Description',
      'Support Focus',
      'Website URL',
      'Gallery Photos Count',
      'Updated At',
    ];

    const escapeCell = (val: string | number) => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = directorySource.map((g, idx) => [
      g.uniqueGroupCode || `ENG-GRP-${String(idx + 1).padStart(3, '0')}`,
      g.name,
      g.programmeType,
      g.sector || 'Community Development & Livelihoods',
      g.companyAffiliation || g.name,
      g.location,
      g.representativeName,
      g.representativeTitle,
      g.memberCount ?? 0,
      g.projectName,
      g.projectDescription,
      g.supportFocus,
      g.websiteUrl || '',
      Array.isArray(g.galleryImages) ? g.galleryImages.length : 0,
      g.updatedAt || '',
    ]);

    const csv = [
      headers.map(escapeCell).join(','),
      ...rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `ENGANDA_Group_Directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showBanner(
      'success',
      `Exported ${directorySource.length} group directory profiles to CSV for local record-keeping.`
    );
  };

  // Private Member CSV Export
  const handleExportMembersCsv = () => {
    const headers = [
      'Unique Member ID',
      'Full Name',
      'Title / Role',
      'Group ID',
      'Group Name',
      'Company / Enterprise',
      'National ID / Passport No.',
      'Skills',
      'Phone Number',
      'Email Address',
      'Location',
    ];
    const escapeCell = (val: string) => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = members.map((m) => [
      m.uniqueId || m.id,
      m.fullName,
      m.title,
      m.groupId,
      m.groupName || m.groupId,
      m.company || m.groupName || '',
      m.nationalId,
      Array.isArray(m.skills) ? m.skills.join('; ') : '',
      m.phone,
      m.email,
      m.location,
    ]);

    const csv = [
      headers.map(escapeCell).join(','),
      ...rows.map((r) => r.map(escapeCell).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `ENGANDA_Private_Members_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showBanner('success', `Exported ${members.length} member records to CSV.`);
  };

  // Download CSV Import Template
  const handleDownloadCsvTemplate = () => {
    const sampleGroupId = importGroupId || 'grp-abayita-ababiri';
    const templateContent = [
      'uniqueId,fullName,title,company,phone,email,nationalId,skills,location,groupId',
      `ENG-MEM-0701,John Ssemakula,Registered Member,SIZ Football Academy,+256772990101,john.ssemakula@example.org,CM92019910ABCD,"Sports Coaching & Mentorship; Financial Literacy","Abayita Ababiri, Entebbe",${sampleGroupId}`,
      `ENG-MEM-0702,Mary Namukasa,Treasurer,BEP Auto Garage,+256701880202,mary.namukasa@example.org,PP-UG8849201,"Bookkeeping; SACCO Governance; Automotive Mechanics","Entebbe, Uganda",${sampleGroupId}`,
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'enganda_member_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Validate & Preview CSV before submission
  const handleGenerateCsvPreview = (rawText: string, targetGrpId: string) => {
    setImportResult(null);
    const parsedObjects = parseCsvText(rawText);
    if (parsedObjects.length === 0) {
      setPreviewRows([]);
      return;
    }

    if (parsedObjects.length > 500) {
      showBanner(
        'error',
        `CSV contains ${parsedObjects.length} rows. Maximum allowed is 500 valid rows per import.`
      );
    }

    const existingSet = new Set(
      members.map((m) => normalizePreviewDupKey(m.fullName, m.phone))
    );
    const seenInBatch = new Set<string>();

    const defaultGroupProfile = profiles.find((p) => p.id === targetGrpId);

    const previews: ParsedCsvRowPreview[] = parsedObjects.slice(0, 500).map((row, idx) => {
      const uniqueId = row.uniqueid || row.memberid || row.id || '';
      const fullName =
        row.fullname || row.name || row.membername || row.member || '';
      const title =
        row.title || row.role || row.position || 'Registered Member';
      const company =
        row.company ||
        row.enterprise ||
        row.organisation ||
        defaultGroupProfile?.companyAffiliation ||
        defaultGroupProfile?.name ||
        'SIZ Football Academy';
      const phone =
        row.phone || row.contact || row.phonenumber || row.telephone || row.mobile || '';
      const email = row.email || row.emailaddress || '';
      const nationalId = (
        row.nationalid ||
        row.nin ||
        row.passport ||
        row.passportno ||
        row.nationalidpassportno ||
        ''
      ).toUpperCase();
      const rawSkills = row.skills || row.skill || row.competencies || '';
      const skills = rawSkills
        ? rawSkills
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : ['Financial Literacy', 'SACCO Governance'];
      const location =
        row.location ||
        row.area ||
        row.residence ||
        defaultGroupProfile?.location ||
        'Entebbe, Uganda';
      const rawGroup = row.groupid || row.group || row.groupname || targetGrpId;

      const matchedGrp = profiles.find(
        (p) =>
          p.id === rawGroup ||
          p.slug.toLowerCase() === rawGroup.toLowerCase() ||
          p.name.toLowerCase() === rawGroup.toLowerCase()
      );
      const resolvedGroupId = matchedGrp ? matchedGrp.id : targetGrpId;

      let isValid = true;
      let validationNote = 'Ready to import';

      if (!fullName || fullName.trim().length < 2) {
        isValid = false;
        validationNote = 'Missing valid fullName';
      } else if (!phone || phone.replace(/[^0-9]/g, '').length < 6) {
        isValid = false;
        validationNote = 'Missing valid phone';
      } else {
        const key = normalizePreviewDupKey(fullName, phone);
        if (existingSet.has(key)) {
          isValid = false;
          validationNote = 'Duplicate (already in database)';
        } else if (seenInBatch.has(key)) {
          isValid = false;
          validationNote = 'Duplicate row within CSV';
        } else {
          seenInBatch.add(key);
        }
      }

      return {
        rowNumber: idx + 1,
        uniqueId,
        fullName,
        title,
        company,
        phone,
        email,
        nationalId,
        skills,
        location,
        groupId: resolvedGroupId,
        isValid,
        validationNote,
      };
    });

    setPreviewRows(previews);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = String(evt.target?.result || '');
      setCsvRawText(text);
      handleGenerateCsvPreview(text, importGroupId);
    };
    reader.readAsText(file);
  };

  const handleSubmitBulkImport = async () => {
    if (previewRows.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch('/api/admin/members/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          defaultGroupId: importGroupId,
          rows: previewRows.map((r) => ({
            uniqueId: r.uniqueId,
            fullName: r.fullName,
            title: r.title,
            company: r.company,
            phone: r.phone,
            email: r.email,
            nationalId: r.nationalId,
            skills: r.skills,
            location: r.location,
            groupId: r.groupId,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Bulk import failed.');
      } else {
        setImportResult({
          importedCount: data.importedCount,
          skippedCount: data.skippedCount,
          skippedReasons: data.skippedReasons || [],
        });
        showBanner(
          'success',
          `Bulk import complete: ${data.importedCount} imported, ${data.skippedCount} skipped.`
        );
        await fetchMembers();
        onDataMutated();
      }
    } catch (err) {
      console.error('Bulk import error:', err);
      showBanner('error', 'Network error during bulk import.');
    } finally {
      setImporting(false);
    }
  };

  // Save Group Profile, Website & 5-Photo Gallery Updates
  const handleSaveGroupProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/groups/${editingGroupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...groupEditForm,
          galleryImages: groupEditForm.galleryImages.slice(0, 5),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Failed to update group profile.');
      } else {
        showBanner(
          'success',
          `Updated public profile and ${data.profile.galleryImages?.length || 0}-photo gallery for ${data.profile.name}.`
        );
        onDataMutated();
      }
    } catch (err) {
      console.error('Update group error:', err);
      showBanner('error', 'Failed to update group profile.');
    }
  };

  // ENGANDA Safaris, Events & Trips Handlers
  const displayedSafariEvents =
    safariEvents && safariEvents.length > 0 ? safariEvents : DEFAULT_SAFARI_EVENTS;

  const resetSafariForm = () => {
    setEditingSafariId(null);
    setSafariForm({
      code: '',
      title: '',
      category: 'ENGANDA Safari & Eco-Trip',
      dateLabel: 'October 18 – October 20, 2025',
      durationLabel: '3 Days / 2 Nights',
      location: 'Entebbe Pier → Ssese Islands, Lake Victoria',
      feeOrSponsorshipLabel: 'UGX 180,000 / Person • Partner Sponsored Slots Available',
      organizer: 'ENGANDA Safaris & Community Cooperatives',
      summary: '',
      highlightsText:
        'Guided Lake Victoria eco-boat excursion\nCommunity SACCO & fisheries cooperative exchange\nYouth conservation & leadership campfire session',
      imageUrl: SAFARI_LAKE_VICTORIA_IMAGE,
      showOnCarousel: true,
      showInUpcoming: true,
      ctaLabel: 'Book Safari / Register',
    });
  };

  const handleEditSafariItem = (item: SafariEventItem) => {
    setEditingSafariId(item.id);
    setSafariForm({
      code: item.code,
      title: item.title,
      category: item.category,
      dateLabel: item.dateLabel,
      durationLabel: item.durationLabel,
      location: item.location,
      feeOrSponsorshipLabel: item.feeOrSponsorshipLabel,
      organizer: item.organizer,
      summary: item.summary,
      highlightsText: Array.isArray(item.highlights) ? item.highlights.join('\n') : '',
      imageUrl: item.imageUrl,
      showOnCarousel: item.showOnCarousel,
      showInUpcoming: item.showInUpcoming,
      ctaLabel: item.ctaLabel || 'Book Safari / Register',
    });
  };

  const handleSaveSafariEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safariForm.title.trim() || !safariForm.dateLabel.trim() || !safariForm.location.trim()) {
      showBanner('error', 'Please provide an event/trip title, date, and location.');
      return;
    }

    setSavingSafariEvent(true);
    try {
      const url = editingSafariId
        ? `/api/admin/safari-events/${editingSafariId}`
        : '/api/admin/safari-events';
      const method = editingSafariId ? 'PUT' : 'POST';

      const highlights = safariForm.highlightsText
        .split(/[\n;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          code: safariForm.code.trim(),
          title: safariForm.title.trim(),
          category: safariForm.category,
          dateLabel: safariForm.dateLabel.trim(),
          durationLabel: safariForm.durationLabel.trim(),
          location: safariForm.location.trim(),
          feeOrSponsorshipLabel: safariForm.feeOrSponsorshipLabel.trim(),
          organizer: safariForm.organizer.trim(),
          summary: safariForm.summary.trim(),
          highlights,
          imageUrl: safariForm.imageUrl.trim() || SAFARI_LAKE_VICTORIA_IMAGE,
          showOnCarousel: safariForm.showOnCarousel,
          showInUpcoming: safariForm.showInUpcoming,
          ctaLabel: safariForm.ctaLabel.trim() || 'Book Safari / Register',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Failed to save safari trip / event.');
      } else {
        showBanner(
          'success',
          editingSafariId
            ? `Updated "${data.safariEvent?.title}".`
            : `Loaded new event/trip "${data.safariEvent?.title}" (${
                safariForm.showOnCarousel ? 'On Carousel' : ''
              }${safariForm.showOnCarousel && safariForm.showInUpcoming ? ' & ' : ''}${
                safariForm.showInUpcoming ? 'In Upcoming Programs' : ''
              }).`
        );
        resetSafariForm();
        onDataMutated();
      }
    } catch (err) {
      console.error('Save safari event error:', err);
      showBanner('error', 'Network error while saving event / trip.');
    } finally {
      setSavingSafariEvent(false);
    }
  };

  const handleToggleSafariPlacement = async (
    item: SafariEventItem,
    field: 'showOnCarousel' | 'showInUpcoming'
  ) => {
    try {
      const res = await fetch(`/api/admin/safari-events/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          [field]: !item[field],
        }),
      });
      if (res.ok) {
        showBanner(
          'success',
          `Updated ${item.code}: ${
            field === 'showOnCarousel' ? 'Featured Carousel' : 'Upcoming Programs'
          } set to ${!item[field] ? 'ON' : 'OFF'}.`
        );
        onDataMutated();
      }
    } catch (err) {
      console.error('Toggle safari placement error:', err);
    }
  };

  const handleDeleteSafariEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/safari-events/${eventId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showBanner('success', 'Removed event / trip from schedule.');
        if (editingSafariId === eventId) resetSafariForm();
        onDataMutated();
      }
    } catch (err) {
      console.error('Delete safari event error:', err);
    }
  };

  const handleSafariPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      showBanner('error', 'Please select an image smaller than 2.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = String(evt.target?.result || '');
      if (dataUrl) {
        setSafariForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Assign Group Access (Global Admin Only)
  const handleAssignGroupAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          email: assignEmail.trim(),
          groupId: assignGroupId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Could not assign group access.');
      } else {
        showBanner(
          'success',
          `Assigned ${data.assignment.email} as administrator for ${data.assignment.groupName}.`
        );
        setAssignEmail('');
        await fetchGlobalAdminData();
      }
    } catch (err) {
      console.error('Assign access error:', err);
      showBanner('error', 'Failed to assign group access.');
    }
  };

  const handleRevokeAssignment = async (assignmentId: string) => {
    try {
      const res = await fetch(`/api/admin/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showBanner('success', 'Group administrator access revoked.');
        await fetchGlobalAdminData();
      }
    } catch (err) {
      console.error('Revoke error:', err);
    }
  };

  const handleUpdateEnquiryStatus = async (
    enquiryId: string,
    status: 'NEW' | 'IN_REVIEW' | 'RESPONDED'
  ) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchGlobalAdminData();
      }
    } catch (err) {
      console.error('Update enquiry error:', err);
    }
  };

  const paginatedMembers = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[92dvh] sm:h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Top Header */}
        <div className="bg-[#0B2B1E] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-emerald-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight truncate font-['Plus_Jakarta_Sans',sans-serif]">
                  ENGANDA Member Administration & Media Governance Console
                </h3>
                {user && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest bg-emerald-800 text-amber-300 rounded border border-emerald-600">
                    {isGlobalAdmin
                      ? 'GLOBAL ADMIN'
                      : hasGroupAccess
                      ? `GROUP ADMIN (${assignedGroupIds.length})`
                      : 'UNASSIGNED ACCOUNT'}
                  </span>
                )}
              </div>
              <p className="text-emerald-200/80 text-xs truncate">
                Member IDs, NIN/Passport, Skills • Up-to-5 Group Photo Galleries • Site Photo Replacement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {user && hasGroupAccess && (
              <button
                type="button"
                onClick={handleExportDirectoryCsv}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer shadow-sm"
                title="Export Group Directory as CSV for local record-keeping"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Group Directory CSV</span>
              </button>
            )}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[180px]">{user.email}</span>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-amber-300 hover:text-amber-200 font-bold ml-1.5 underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-emerald-200 hover:text-white p-2 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {notice && (
          <div
            className={`px-4 sm:px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b shrink-0 ${
              notice.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-red-900 text-white border-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              )}
              <span>{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STATE 1: Anonymous / Unauthenticated Visitor */}
        {!user ? (
          <div className="flex-1 bg-[#FAF9F6] p-6 sm:p-12 flex items-center justify-center overflow-y-auto">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#0F5132]/10 border border-[#0F5132]/20 flex items-center justify-center text-[#0F5132] mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
                  Protected Member & Media Console
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Administrator Sign-In Required
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sign in with your authorised Google account to manage private member records,
                  replace website section photos, or update your group’s 5-photo gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={signIn}
                className="w-full py-3 px-5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Sign In with Google
              </button>
            </div>
          </div>
        ) : !hasGroupAccess ? (
          /* STATE 2: Authenticated User WITHOUT Any Assigned Groups */
          <div className="flex-1 bg-[#FAF9F6] p-6 sm:p-12 flex items-center justify-center overflow-y-auto">
            <div className="max-w-lg w-full bg-white rounded-3xl border border-amber-200 p-8 text-center shadow-sm space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mx-auto">
                <KeyRound className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                  No Group Access Assigned
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 mt-2 font-['Plus_Jakarta_Sans',sans-serif]">
                  No group access assigned
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You are signed in as <strong className="text-slate-900">{user.email}</strong>. Your
                  account has been registered in the ENGANDA system, but no specific community group
                  has been assigned to your account yet.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#0F5132] text-white text-xs font-bold cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STATE 3: Authorised Group Admin or Global Admin */
          <>
            {/* Navigation Tabs — Wrapped & Bounded so Zero Words Overflow Out of Boundaries */}
            <div className="bg-slate-900 px-3 sm:px-6 py-2.5 flex flex-wrap items-center gap-1.5 border-b border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Members ({members.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('safaris-events')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'safaris-events'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Safaris, Events &amp; Trips ({displayedSafariEvents.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('groups')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'groups'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Images className="w-3.5 h-3.5 shrink-0" />
                <span>Group 5-Photo Galleries ({allowedProfiles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('site-media')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'site-media'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>Site Photos (13)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bulk-import')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'bulk-import'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span>Bulk CSV Import</span>
              </button>

              {isGlobalAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'assignments'
                        ? 'bg-[#0F5132] text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 shrink-0" />
                    <span>Group Access ({assignments.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === 'enquiries'
                        ? 'bg-[#0F5132] text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>Enquiries ({enquiries.length})</span>
                  </button>
                </>
              )}
            </div>

            {/* Tab Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
              {/* TAB 1: PRIVATE MEMBER REGISTRY */}
              {activeTab === 'members' && (
                <div className="space-y-5">
                  {/* Filter & Actions Bar */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                      <select
                        value={selectedGroupFilter}
                        onChange={(e) => setSelectedGroupFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-semibold text-slate-900"
                      >
                        <option value="all">
                          All Assigned Groups ({allowedProfiles.length})
                        </option>
                        {allowedProfiles.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.uniqueGroupCode ? `[${g.uniqueGroupCode}] ` : ''}
                            {g.name} ({g.memberCount ?? 0} records)
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Search ID, name, company (SIZ), skills, NIN/Passport, phone..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleExportDirectoryCsv}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold cursor-pointer"
                        title="Export Group Directory as CSV for local record-keeping"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                        <span>Export Group Directory CSV ({allowedProfiles.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportMembersCsv}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Members CSV ({members.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingMember(null);
                          const defaultGrpId =
                            selectedGroupFilter !== 'all'
                              ? selectedGroupFilter
                              : allowedMemberGroups[0]?.id || 'grp-abayita-ababiri';
                          const foundGrp = profiles.find((p) => p.id === defaultGrpId);
                          const nextUniqueId = `ENG-MEM-${String(members.length + 1).padStart(4, '0')}`;
                          setMemberForm({
                            uniqueId: nextUniqueId,
                            groupId: defaultGrpId,
                            company:
                              foundGrp?.companyAffiliation ||
                              foundGrp?.name ||
                              'SIZ Football Academy',
                            fullName: '',
                            title: 'Registered Member',
                            phone: '',
                            email: '',
                            nationalId: '',
                            photoUrl: '',
                            skills: ['Financial Literacy', 'SACCO Governance'],
                            location: foundGrp?.location || 'Entebbe, Uganda',
                          });
                          setShowMemberForm(!showMemberForm);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Member</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit Member Form */}
                  {showMemberForm && (
                    <form
                      onSubmit={handleSaveMember}
                      className="bg-white p-5 rounded-xl border-2 border-[#0F5132] shadow-md space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded bg-emerald-950 text-amber-300 font-mono text-xs font-extrabold">
                            {memberForm.uniqueId || 'AUTO-ID'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {editingMember
                              ? `Edit Member Record: ${editingMember.fullName}`
                              : 'Create New Member Record (with Photo, Unique ID, Company & Skills)'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMemberForm(false);
                            setEditingMember(null);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Unique Member ID */}
                        <div>
                          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                            <Fingerprint className="w-3.5 h-3.5 text-[#0F5132]" />
                            <span>Unique Member ID *</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.uniqueId}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, uniqueId: e.target.value.toUpperCase() })
                            }
                            placeholder="e.g. ENG-MEM-0691"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono font-bold text-slate-900 bg-slate-50"
                          />
                        </div>

                        {/* Assigned Group */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Group / SACCO *
                          </label>
                          <select
                            value={memberForm.groupId}
                            onChange={(e) => {
                              const newGroupId = e.target.value;
                              const grp = profiles.find((p) => p.id === newGroupId);
                              setMemberForm({
                                ...memberForm,
                                groupId: newGroupId,
                                company: grp?.companyAffiliation || grp?.name || memberForm.company,
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white font-semibold"
                          >
                            {allowedProfiles.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.uniqueGroupCode ? `${g.uniqueGroupCode} — ` : ''}
                                {g.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Company / Enterprise Affiliation (like SIZ) */}
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-[#0F5132]" />
                            <span>Company / Enterprise Affiliation (e.g. SIZ, BEP, LeoLeo) *</span>
                          </label>
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              required
                              value={memberForm.company}
                              onChange={(e) =>
                                setMemberForm({ ...memberForm, company: e.target.value })
                              }
                              placeholder="e.g. SIZ Football Academy, BEP Auto Garage, LeoLeo Enterprise"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                            />
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-400 mr-1">
                                Quick Select:
                              </span>
                              {PRESET_COMPANIES.map((comp) => (
                                <button
                                  key={comp}
                                  type="button"
                                  onClick={() => setMemberForm({ ...memberForm, company: comp })}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                    memberForm.company === comp
                                      ? 'bg-[#0F5132] text-white border-[#0F5132]'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {comp}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.fullName}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, fullName: e.target.value })
                            }
                            placeholder="e.g. Ronald Ssemakula"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        {/* Title / Role */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Title / Role *
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.title}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, title: e.target.value })
                            }
                            placeholder="e.g. Treasurer / Registered Member"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        {/* National ID / Passport No. */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            National ID (NIN) / Passport No. *
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.nationalId}
                            onChange={(e) =>
                              setMemberForm({
                                ...memberForm,
                                nationalId: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="CM90000000ABCD or PP-UG123456"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.phone}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, phone: e.target.value })
                            }
                            placeholder="+256772100200"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={memberForm.email}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, email: e.target.value })
                            }
                            placeholder="member@enganda.org"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={memberForm.location}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, location: e.target.value })
                            }
                            placeholder="Entebbe, Uganda"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                          />
                        </div>

                        {/* Member Photo Upload & URL */}
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1">
                            <Camera className="w-3.5 h-3.5 text-[#0F5132]" />
                            <span>Member Passport Photo (Upload Image or Paste Photo URL)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                memberForm.photoUrl ||
                                makeFallbackAvatarSvg(memberForm.fullName || 'Member')
                              }
                              alt="Member avatar preview"
                              className="w-11 h-11 rounded-full object-cover border-2 border-[#0F5132] shrink-0 bg-emerald-950"
                            />
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="url"
                                value={
                                  memberForm.photoUrl.startsWith('data:')
                                    ? ''
                                    : memberForm.photoUrl
                                }
                                onChange={(e) =>
                                  setMemberForm({ ...memberForm, photoUrl: e.target.value })
                                }
                                placeholder="https://... or upload photo ->"
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleMemberPhotoUpload}
                                className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-[#0F5132] hover:file:bg-emerald-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dedicated Skills & Vocational Competencies Section */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                              <Award className="w-4 h-4 text-[#0F5132]" />
                              <span>Member Skills & Vocational Competencies ({memberForm.skills.length})</span>
                            </label>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Select applicable trade, financial, or technical skills for this member or add custom competencies.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={customSkillInput}
                              onChange={(e) => setCustomSkillInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomSkills();
                                }
                              }}
                              placeholder="Add custom skill (e.g. Solar Installation)..."
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white w-56"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomSkills}
                              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                            >
                              + Add Skill
                            </button>
                          </div>
                        </div>

                        {/* Preset Skill Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_SKILLS.map((skill) => {
                            const active = memberForm.skills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleToggleSkill(skill)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {active ? `✓ ${skill}` : `+ ${skill}`}
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Selected Skills Summary */}
                        {memberForm.skills.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/80">
                            <span className="text-[11px] font-bold text-slate-500 mr-1">
                              Assigned Skills:
                            </span>
                            {memberForm.skills.map((sk) => (
                              <span
                                key={sk}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-[#0F5132] text-[11px] font-bold"
                              >
                                {sk}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSkill(sk)}
                                  className="hover:text-red-700 ml-0.5 font-extrabold cursor-pointer"
                                  title="Remove skill"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowMemberForm(false);
                            setEditingMember(null);
                          }}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#0F5132] hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
                        >
                          {editingMember ? 'Save Member Changes' : 'Create Member Record'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Private Member Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1060px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-3.5">Photo & Member</th>
                            <th className="py-3 px-3.5">Unique ID</th>
                            <th className="py-3 px-3.5">Group & Company (e.g. SIZ)</th>
                            <th className="py-3 px-3.5">National ID / Passport No.</th>
                            <th className="py-3 px-3.5">Skills</th>
                            <th className="py-3 px-3.5">Phone & Location</th>
                            <th className="py-3 px-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs">
                          {loadingMembers ? (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-500">
                                Loading private member records...
                              </td>
                            </tr>
                          ) : paginatedMembers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-10 text-center text-slate-500">
                                No member records found matching your filter.
                              </td>
                            </tr>
                          ) : (
                            paginatedMembers.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-50">
                                <td className="py-3 px-3.5">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={m.photoUrl || makeFallbackAvatarSvg(m.fullName)}
                                      alt={m.fullName}
                                      className="w-9 h-9 rounded-full object-cover border border-emerald-700/30 shrink-0 bg-emerald-950"
                                    />
                                    <div>
                                      <div className="font-bold text-slate-900">{m.fullName}</div>
                                      <div className="text-slate-500 text-[11px]">{m.title}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] font-extrabold">
                                    {m.uniqueId || m.id}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5">
                                  <div className="font-bold text-[#0F5132]">
                                    {m.groupName || m.groupId}
                                  </div>
                                  <div className="text-slate-600 text-[11px] flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-3 h-3 text-amber-700 shrink-0" />
                                    <span>{m.company || m.groupName || 'ENGANDA Network'}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                                  {m.nationalId || '—'}
                                </td>
                                <td className="py-3 px-3.5 max-w-[230px]">
                                  <div className="flex flex-wrap gap-1">
                                    {Array.isArray(m.skills) && m.skills.length > 0 ? (
                                      m.skills.map((sk) => (
                                        <span
                                          key={sk}
                                          className="px-2 py-0.5 rounded bg-emerald-50 text-[#0F5132] border border-emerald-200 text-[10px] font-bold"
                                        >
                                          {sk}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-slate-400 text-[11px]">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-3.5">
                                  <div className="font-mono text-slate-800">{m.phone}</div>
                                  <div className="text-slate-500 text-[11px]">{m.location}</div>
                                </td>
                                <td className="py-3 px-3.5 text-right whitespace-nowrap">
                                  {confirmDeleteId === m.id ? (
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleConfirmDeleteMember(m.id)}
                                        className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold cursor-pointer"
                                      >
                                        Confirm Delete
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingMember(m);
                                          setMemberForm({
                                            uniqueId: m.uniqueId || m.id,
                                            groupId: m.groupId,
                                            company: m.company || m.groupName || 'SIZ Football Academy',
                                            fullName: m.fullName,
                                            title: m.title,
                                            phone: m.phone,
                                            email: m.email,
                                            nationalId: m.nationalId,
                                            photoUrl: m.photoUrl || '',
                                            skills:
                                              Array.isArray(m.skills) && m.skills.length > 0
                                                ? m.skills
                                                : ['Financial Literacy'],
                                            location: m.location,
                                          });
                                          setShowMemberForm(true);
                                        }}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-[#0F5132] cursor-pointer"
                                        title="Edit Member"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteId(m.id)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 cursor-pointer"
                                        title="Delete Member"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                      <span>
                        Showing {(page - 1) * PAGE_SIZE + (members.length > 0 ? 1 : 0)}–
                        {Math.min(page * PAGE_SIZE, members.length)} of{' '}
                        <strong>{members.length}</strong> records
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-40 font-bold cursor-pointer"
                        >
                          Previous
                        </button>
                        <span className="font-bold">
                          Page {page} of {totalPages}
                        </span>
                        <button
                          type="button"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-40 font-bold cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BULK CSV IMPORT */}
              {activeTab === 'bulk-import' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          Bulk CSV Member Import (Max 500 Rows per Import)
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Supports headers: uniqueId, fullName, title, company, phone, email,
                          nationalId (NIN / Passport No.), skills, location, groupId. Exact
                          duplicates (normalized name + phone) are automatically skipped.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadCsvTemplate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-200 text-xs font-bold shrink-0 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Download CSV Template</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Default Target Group (if row omits group column)
                        </label>
                        <select
                          value={importGroupId}
                          onChange={(e) => {
                            setImportGroupId(e.target.value);
                            if (csvRawText) {
                              handleGenerateCsvPreview(csvRawText, e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white font-semibold"
                        >
                          {allowedProfiles.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Upload CSV File (.csv)
                        </label>
                        <input
                          type="file"
                          accept=".csv,text/csv"
                          onChange={handleFileUpload}
                          className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Or Paste CSV Rows Directly (Including Header Line)
                      </label>
                      <textarea
                        rows={5}
                        value={csvRawText}
                        onChange={(e) => {
                          setCsvRawText(e.target.value);
                          handleGenerateCsvPreview(e.target.value, importGroupId);
                        }}
                        placeholder={
                          'uniqueId,fullName,title,company,phone,email,nationalId,skills,location\nENG-MEM-0701,Samuel Kato,Member,SIZ Football Academy,+256772555111,samuel@example.org,CM9011223344,"Sports Coaching & Mentorship; Financial Literacy","Entebbe, Uganda"'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>

                    {/* Preview Table Before Submission */}
                    {previewRows.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            CSV Validation Preview ({previewRows.length} rows parsed •{' '}
                            <span className="text-[#0F5132]">
                              {previewRows.filter((r) => r.isValid).length} valid
                            </span>{' '}
                            •{' '}
                            <span className="text-amber-700">
                              {previewRows.filter((r) => !r.isValid).length} will be skipped
                            </span>
                            )
                          </span>

                          <button
                            type="button"
                            disabled={importing}
                            onClick={handleSubmitBulkImport}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold shadow-sm cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {importing ? 'Importing Records...' : 'Confirm & Submit Import'}
                            </span>
                          </button>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                                <th className="py-2 px-3">#</th>
                                <th className="py-2 px-3">Full Name</th>
                                <th className="py-2 px-3">Company</th>
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">NIN / Passport</th>
                                <th className="py-2 px-3">Skills</th>
                                <th className="py-2 px-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {previewRows.slice(0, 50).map((r) => (
                                <tr key={r.rowNumber}>
                                  <td className="py-2 px-3 font-mono">{r.rowNumber}</td>
                                  <td className="py-2 px-3 font-semibold">{r.fullName || '—'}</td>
                                  <td className="py-2 px-3">{r.company || '—'}</td>
                                  <td className="py-2 px-3 font-mono">{r.phone || '—'}</td>
                                  <td className="py-2 px-3 font-mono">{r.nationalId || '—'}</td>
                                  <td className="py-2 px-3">{r.skills.join(', ')}</td>
                                  <td className="py-2 px-3">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        r.isValid
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-amber-100 text-amber-800'
                                      }`}
                                    >
                                      {r.validationNote}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Import Result Summary */}
                    {importResult && (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                        <div className="font-extrabold text-[#0F5132] text-sm">
                          Import Summary: {importResult.importedCount} Imported •{' '}
                          {importResult.skippedCount} Skipped
                        </div>
                        {importResult.skippedReasons.length > 0 && (
                          <div className="text-slate-600 space-y-1 max-h-32 overflow-y-auto">
                            {importResult.skippedReasons.map((sr, i) => (
                              <div key={i}>
                                Row {sr.row} ({sr.name}): <strong>{sr.reason}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GROUP 5-PHOTO GALLERIES, PROJECTS & DIRECTORY CSV EXPORT */}
              {activeTab === 'groups' && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Group 5-Photo Galleries, Projects & Directory CSV Export
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage up to 5 gallery pictures per group, update public project details, or
                        export the group directory as a CSV file.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportDirectoryCsv}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-sm shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Group Directory CSV ({allowedProfiles.length})</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Group or Programme to Edit
                    </label>
                    <select
                      value={editingGroupId}
                      onChange={(e) => handleSelectGroupToEdit(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 font-bold text-slate-900"
                    >
                      {allowedProfiles.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.uniqueGroupCode ? `[${p.uniqueGroupCode}] ` : ''}
                          {p.name} ({p.programmeType}) — {p.galleryImages?.length || 0}/5 Photos
                        </option>
                      ))}
                    </select>
                  </div>

                  <form onSubmit={handleSaveGroupProfile} className="space-y-6">
                    {/* GROUP PHOTO GALLERY EDITOR (UP TO 5 PICTURES) */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Images className="w-4 h-4 text-[#0F5132]" />
                            <h5 className="font-extrabold text-slate-900 text-sm">
                              Group Photo Gallery ({groupEditForm.galleryImages.length} / 5 Pictures)
                            </h5>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Each group can display up to 5 pictures. Upload new photos, replace any
                            picture slot, or choose from the AI photo library below.
                          </p>
                        </div>

                        {groupEditForm.galleryImages.length < 5 && (
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer shrink-0">
                            <Camera className="w-3.5 h-3.5" />
                            <span>+ Upload New Photo ({groupEditForm.galleryImages.length}/5)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadGroupGalleryFile(e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* 5 Photo Slots Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {[0, 1, 2, 3, 4].map((slotIdx) => {
                          const imgUrl = groupEditForm.galleryImages[slotIdx];
                          return (
                            <div
                              key={slotIdx}
                              className="bg-white rounded-xl border border-slate-200 p-2.5 flex flex-col justify-between space-y-2 shadow-2xs"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                                  <span>
                                    {slotIdx === 0 ? 'Slot 1 (Cover)' : `Slot ${slotIdx + 1}`}
                                  </span>
                                  {imgUrl && slotIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetGalleryCoverPhoto(slotIdx)}
                                      className="text-[#0F5132] hover:underline cursor-pointer"
                                    >
                                      Make Cover
                                    </button>
                                  )}
                                </div>

                                {imgUrl ? (
                                  <div className="relative h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                                    <img
                                      src={imgUrl}
                                      alt={`Gallery slot ${slotIdx + 1}`}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-24 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 text-[11px]">
                                    <Camera className="w-4 h-4 mb-1" />
                                    <span>Empty Slot</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 pt-1">
                                <label className="flex-1 text-center py-1 px-2 rounded bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] text-[10px] font-bold cursor-pointer">
                                  {imgUrl ? 'Replace' : 'Upload'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleUploadGroupGalleryFile(
                                        e,
                                        imgUrl ? slotIdx : undefined
                                      )
                                    }
                                    className="hidden"
                                  />
                                </label>
                                {imgUrl && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryPhotoAt(slotIdx)}
                                    className="py-1 px-2 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold cursor-pointer"
                                    title="Remove photo"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Photo by URL or AI Photo Library */}
                      <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="url"
                            value={newGalleryUrlInput}
                            onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                            placeholder="Or paste an image URL to add to this group's 5-photo gallery..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                          <button
                            type="button"
                            disabled={groupEditForm.galleryImages.length >= 5}
                            onClick={() => {
                              handleAddGalleryPhoto(newGalleryUrlInput);
                              setNewGalleryUrlInput('');
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                          >
                            + Add URL to Gallery
                          </button>
                        </div>

                        <div>
                          <span className="block text-[11px] font-bold text-slate-600 mb-1.5">
                            Quick-Add from AI-Generated Community Photo Library (Click to add to gallery):
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                            {AI_GENERATED_PHOTO_LIBRARY.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleAddGalleryPhoto(item.url)}
                                className="group text-left bg-white rounded-lg border border-slate-200 hover:border-[#0F5132] p-1.5 transition-all cursor-pointer"
                              >
                                <img
                                  src={item.url}
                                  alt={item.label}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-12 object-cover rounded"
                                />
                                <div className="text-[10px] font-semibold text-slate-700 truncate mt-1">
                                  {item.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Designated Public Representative Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={groupEditForm.representativeName}
                          onChange={(e) =>
                            setGroupEditForm({
                              ...groupEditForm,
                              representativeName: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Representative Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={groupEditForm.representativeTitle}
                          onChange={(e) =>
                            setGroupEditForm({
                              ...groupEditForm,
                              representativeTitle: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Website URL (Leave blank if none supplied; do not fabricate)
                      </label>
                      <input
                        type="url"
                        value={groupEditForm.websiteUrl}
                        onChange={(e) =>
                          setGroupEditForm({ ...groupEditForm, websiteUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Public Group Summary *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={groupEditForm.summary}
                        onChange={(e) =>
                          setGroupEditForm({ ...groupEditForm, summary: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Active Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={groupEditForm.projectName}
                        onChange={(e) =>
                          setGroupEditForm({ ...groupEditForm, projectName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Project Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={groupEditForm.projectDescription}
                        onChange={(e) =>
                          setGroupEditForm({
                            ...groupEditForm,
                            projectDescription: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Partnership or Support Focus *
                      </label>
                      <input
                        type="text"
                        required
                        value={groupEditForm.supportFocus}
                        onChange={(e) =>
                          setGroupEditForm({ ...groupEditForm, supportFocus: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Group Profile & 5-Photo Gallery</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: REPLACE SITE SECTION PHOTOS (HERO, ABOUT, STAGES, PILLARS, LEADERSHIP) */}
              {activeTab === 'site-media' && (
                <form
                  onSubmit={handleSaveSiteMedia}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-5xl space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        Replace Website Section & Blank-Space Photos
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Replace any AI-generated photo across the Hero, About section, Operating
                        Model stages, Capacity pillars, Flagship banners, or Leadership portraits
                        with your own uploaded image or URL.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={savingSiteMedia}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-sm shrink-0 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingSiteMedia ? 'Saving Photos...' : 'Save All Site Photos'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SITE_MEDIA_SLOTS.map((slot) => {
                      const currentUrl = siteMediaForm[slot.key] || DEFAULT_SITE_MEDIA[slot.key];
                      return (
                        <div
                          key={slot.key}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={currentUrl}
                              alt={slot.label}
                              referrerPolicy="no-referrer"
                              className="w-24 h-20 rounded-lg object-cover border border-slate-300 bg-slate-900 shrink-0"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="text-xs font-extrabold text-slate-900">
                                {slot.label}
                              </div>
                              <div className="text-[11px] text-slate-500">{slot.section}</div>
                              <input
                                type="text"
                                value={
                                  currentUrl.startsWith('data:')
                                    ? '[Uploaded Custom Image]'
                                    : currentUrl
                                }
                                onChange={(e) =>
                                  setSiteMediaForm((prev) => ({
                                    ...prev,
                                    [slot.key]: e.target.value,
                                  }))
                                }
                                placeholder="Paste image URL or upload file below..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-[11px] font-bold cursor-pointer">
                              <Camera className="w-3.5 h-3.5" />
                              <span>Upload Replacement Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSiteMediaFileUpload(slot.key, e)}
                                className="hidden"
                              />
                            </label>

                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  setSiteMediaForm((prev) => ({
                                    ...prev,
                                    [slot.key]: e.target.value,
                                  }));
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] bg-white font-semibold text-slate-700"
                            >
                              <option value="">Or Choose AI Preset Photo...</option>
                              {AI_GENERATED_PHOTO_LIBRARY.map((preset) => (
                                <option key={preset.id} value={preset.url}>
                                  {preset.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={savingSiteMedia}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingSiteMedia ? 'Saving Photos...' : 'Save All Site Photos'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: GLOBAL ADMIN — GROUP ACCESS ASSIGNMENTS */}
              {activeTab === 'assignments' && isGlobalAdmin && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed">
                    <strong>Global Administrator Rule:</strong> Group administrators can access and
                    manage member records only for groups explicitly assigned to their account email
                    below.{' '}
                    <strong>
                      If a person has not signed in before, ask them to sign in once before
                      assigning access.
                    </strong>
                  </div>

                  <form
                    onSubmit={handleAssignGroupAccess}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"
                  >
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Assign Group Administrator Access by Email
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          User Account Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={assignEmail}
                          onChange={(e) => setAssignEmail(e.target.value)}
                          placeholder="leader@example.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target Group / Programme *
                        </label>
                        <select
                          value={assignGroupId}
                          onChange={(e) => setAssignGroupId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        >
                          {profiles.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer"
                        >
                          Assign Group Access
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Assignments */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h5 className="font-extrabold text-slate-900 text-sm">
                        Active Group-Admin Assignments ({assignments.length})
                      </h5>
                      {assignments.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          No delegated group-admin assignments created yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {assignments.map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">{a.email}</div>
                                <div className="text-[#0F5132] font-semibold truncate">
                                  {a.groupName || a.groupId}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRevokeAssignment(a.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold shrink-0 cursor-pointer"
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Known Signed-In Accounts */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <h5 className="font-extrabold text-slate-900 text-sm">
                        Verified Accounts That Have Signed In ({knownUsers.length})
                      </h5>
                      <div className="space-y-2">
                        {knownUsers.map((u) => (
                          <div
                            key={u.email}
                            className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {u.displayName}
                              </div>
                              <div className="text-slate-500 font-mono truncate">{u.email}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAssignEmail(u.email)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 text-[#0F5132] text-[11px] font-bold shrink-0 cursor-pointer"
                            >
                              Select Email
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GLOBAL ADMIN — PRIVATE ENQUIRIES INBOX */}
              {activeTab === 'enquiries' && isGlobalAdmin && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Private Inbox: Sponsorship, Investment & Partnership Enquiries
                      </h4>
                      <p className="text-xs text-slate-500">
                        Visible exclusively to Global ENGANDA Administrators.
                      </p>
                    </div>

                    <select
                      value={enquiryFilter}
                      onChange={(e) => setEnquiryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                    >
                      <option value="all">All Enquiry Types ({enquiries.length})</option>
                      <option value="Sponsor">Sponsor Enquiries</option>
                      <option value="Invest">Investment Enquiries</option>
                      <option value="Partner">Partnership Enquiries</option>
                    </select>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-500">
                      No sponsorship, investment, or partnership enquiries recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enquiries
                        .filter((e) => enquiryFilter === 'all' || e.supportType === enquiryFilter)
                        .map((enq) => (
                          <div
                            key={enq.id}
                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-300 font-mono text-xs font-extrabold">
                                  {enq.reference}
                                </span>
                                <span className="px-2.5 py-1 rounded bg-emerald-100 text-[#0F5132] text-xs font-extrabold">
                                  {enq.supportType}: {enq.groupName}
                                </span>
                                <span className="text-xs text-slate-500 font-semibold">
                                  Package: {enq.packageName}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {(['NEW', 'IN_REVIEW', 'RESPONDED'] as const).map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleUpdateEnquiryStatus(enq.id, st)}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer ${
                                      enq.status === st
                                        ? 'bg-[#0F5132] text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                              <div>
                                <span className="text-slate-400">Contact:</span>{' '}
                                <strong>{enq.contactName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400">Email:</span>{' '}
                                <strong className="font-mono">{enq.email}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400">Phone / Org:</span>{' '}
                                <strong>
                                  {enq.phone || '—'} {enq.organisation ? `(${enq.organisation})` : ''}
                                </strong>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                              {enq.message}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Quarterly Impact Newsletter Subscriptions Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 mt-6">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Quarterly ENGANDA Impact Newsletter Subscriptions ({newsletterSubs.length})
                        </h4>
                        <p className="text-xs text-slate-500">
                          Partners subscribed to updates on the 2,000,000 youth transition goal with verified consent.
                        </p>
                      </div>
                    </div>

                    {newsletterSubs.length === 0 ? (
                      <div className="text-xs text-slate-500 py-4 text-center bg-slate-50 rounded-xl border border-slate-100">
                        No newsletter subscriptions recorded yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                              <th className="py-2 pr-3">Ref</th>
                              <th className="py-2 pr-3">Email</th>
                              <th className="py-2 pr-3">Name / Organisation</th>
                              <th className="py-2 pr-3">Consent</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {newsletterSubs.map((sub) => (
                              <tr key={sub.id}>
                                <td className="py-2 pr-3 font-mono font-bold text-[#0F5132]">
                                  {sub.reference}
                                </td>
                                <td className="py-2 pr-3 font-mono text-slate-900">{sub.email}</td>
                                <td className="py-2 pr-3 text-slate-700">
                                  {sub.name || '—'}{' '}
                                  {sub.organisation ? `(${sub.organisation})` : ''}
                                </td>
                                <td className="py-2 pr-3">
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#0F5132] font-bold text-[10px]">
                                    {sub.consent ? 'CONSENTED' : 'NO'}
                                  </span>
                                </td>
                                <td className="py-2 text-slate-500">
                                  {new Date(sub.subscribedAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4B: ENGANDA SAFARIS, EVENTS & UPCOMING PROGRAMS (Carousel vs. Upcoming) */}
              {activeTab === 'safaris-events' && (
                <div className="space-y-6">
                  {/* Form to Load New Event / Safari Trip or Edit Existing */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F5132]">
                          ENGANDA Safaris, Expeditions &amp; Network Events
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg mt-0.5">
                          {editingSafariId
                            ? `Editing Event / Safari Trip: ${safariForm.title}`
                            : 'Load New Event, Safari Trip, or Upcoming Program'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Choose whether each event or trip appears on the{' '}
                          <strong>Featured Carousel</strong>, inside{' '}
                          <strong>Upcoming Programs</strong>, or both.
                        </p>
                      </div>
                      {editingSafariId && (
                        <button
                          type="button"
                          onClick={resetSafariForm}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          + Switch to New Event / Trip
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveSafariEvent} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Event / Safari Trip Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={safariForm.title}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, title: e.target.value })
                            }
                            placeholder="e.g. ENGANDA Safaris: Murchison Falls & Youth Agro-Cooperative Tour"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={safariForm.category}
                            onChange={(e) =>
                              setSafariForm({
                                ...safariForm,
                                category: e.target.value as SafariEventCategory,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                          >
                            <option value="ENGANDA Safari & Eco-Trip">
                              ENGANDA Safari &amp; Eco-Trip
                            </option>
                            <option value="Youth Sports & Gala">Youth Sports &amp; Gala</option>
                            <option value="SACCO & Enterprise Exchange">
                              SACCO &amp; Enterprise Exchange
                            </option>
                            <option value="Tree Stewardship & Conservation">
                              Tree Stewardship &amp; Conservation
                            </option>
                            <option value="Community Cultural Expedition">
                              Community Cultural Expedition
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Event / Trip Date *
                          </label>
                          <input
                            type="text"
                            required
                            value={safariForm.dateLabel}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, dateLabel: e.target.value })
                            }
                            placeholder="e.g. October 18 – October 20, 2025"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={safariForm.durationLabel}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, durationLabel: e.target.value })
                            }
                            placeholder="e.g. 3 Days / 2 Nights"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Reference Code (Auto if blank)
                          </label>
                          <input
                            type="text"
                            value={safariForm.code}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, code: e.target.value })
                            }
                            placeholder="e.g. SAF-2025-07"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Route / Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={safariForm.location}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, location: e.target.value })
                            }
                            placeholder="e.g. Nakiwogo Pier, Entebbe → Kalangala"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Organiser / Host Group
                          </label>
                          <input
                            type="text"
                            value={safariForm.organizer}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, organizer: e.target.value })
                            }
                            placeholder="e.g. ENGANDA Safaris & SIZ Football Academy"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Fee / Sponsorship Details
                          </label>
                          <input
                            type="text"
                            value={safariForm.feeOrSponsorshipLabel}
                            onChange={(e) =>
                              setSafariForm({
                                ...safariForm,
                                feeOrSponsorshipLabel: e.target.value,
                              })
                            }
                            placeholder="e.g. UGX 180,000 / Person • Partner Slots Open"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Trip / Event Summary
                          </label>
                          <textarea
                            rows={3}
                            value={safariForm.summary}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, summary: e.target.value })
                            }
                            placeholder="Describe the safari itinerary, community exchange goals, or programme overview..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Key Highlights (One per line)
                          </label>
                          <textarea
                            rows={3}
                            value={safariForm.highlightsText}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, highlightsText: e.target.value })
                            }
                            placeholder="Guided boat excursion&#10;SACCO leadership exchange&#10;Tree planting ceremony"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      {/* Photo Selection + Placement Checkboxes (Carousel vs. Upcoming Programs) */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 items-center">
                        <div className="lg:col-span-3">
                          <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-300">
                            <img
                              src={safariForm.imageUrl || SAFARI_LAKE_VICTORIA_IMAGE}
                              alt="Safari / Event preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-5 space-y-2">
                          <label className="block text-xs font-bold text-slate-800">
                            Event / Safari Cover Photo
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-bold cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleSafariPhotoUpload}
                                className="hidden"
                              />
                            </label>

                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  setSafariForm({ ...safariForm, imageUrl: e.target.value });
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold"
                            >
                              <option value="">Choose AI Safari / Community Photo...</option>
                              {AI_GENERATED_PHOTO_LIBRARY.map((lib) => (
                                <option key={lib.id} value={lib.url}>
                                  {lib.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <input
                            type="text"
                            value={safariForm.imageUrl}
                            onChange={(e) =>
                              setSafariForm({ ...safariForm, imageUrl: e.target.value })
                            }
                            placeholder="Or paste image URL..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] bg-white font-mono"
                          />
                        </div>

                        <div className="lg:col-span-4 space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                          <div className="text-xs font-extrabold text-slate-900">
                            Display Placement Controls
                          </div>
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={safariForm.showOnCarousel}
                              onChange={(e) =>
                                setSafariForm({
                                  ...safariForm,
                                  showOnCarousel: e.target.checked,
                                })
                              }
                              className="rounded border-slate-300 text-[#0F5132] focus:ring-[#0F5132]"
                            />
                            <span>Show on Featured Carousel (Hero &amp; Safaris)</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={safariForm.showInUpcoming}
                              onChange={(e) =>
                                setSafariForm({
                                  ...safariForm,
                                  showInUpcoming: e.target.checked,
                                })
                              }
                              className="rounded border-slate-300 text-[#0F5132] focus:ring-[#0F5132]"
                            />
                            <span>Show in Upcoming Programs &amp; Trips</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          disabled={savingSafariEvent}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F5132] hover:bg-emerald-900 text-white text-xs font-extrabold shadow-sm cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>
                            {savingSafariEvent
                              ? 'Saving...'
                              : editingSafariId
                              ? 'Save Changes to Event / Trip'
                              : 'Load New Event / Safari Trip'}
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Current Loaded Events & Safari Trips List with One-Click Carousel / Upcoming Toggles */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          Loaded ENGANDA Safaris, Trips &amp; Upcoming Programs (
                          {displayedSafariEvents.length})
                        </h5>
                        <p className="text-xs text-slate-500">
                          Toggle any item on or off the <strong>Featured Carousel</strong> or{' '}
                          <strong>Upcoming Programs</strong> with one click.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedSafariEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-2xl border border-slate-200 p-4 flex flex-col justify-between gap-3 bg-slate-50/70"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <img
                              src={ev.imageUrl || SAFARI_LAKE_VICTORIA_IMAGE}
                              alt={ev.title}
                              referrerPolicy="no-referrer"
                              className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0 bg-slate-900"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-bold">
                                  {ev.code}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-[#0F5132] text-[10px] font-extrabold truncate">
                                  {ev.category}
                                </span>
                              </div>
                              <h6 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug break-words">
                                {ev.title}
                              </h6>
                              <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#0F5132] shrink-0" />
                                <span className="truncate">
                                  {ev.dateLabel} • {ev.location}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSafariPlacement(ev, 'showOnCarousel')
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                                  ev.showOnCarousel
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                              >
                                {ev.showOnCarousel ? '✓ On Carousel' : '+ Add to Carousel'}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSafariPlacement(ev, 'showInUpcoming')
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                                  ev.showInUpcoming
                                    ? 'bg-[#0F5132] text-white'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                              >
                                {ev.showInUpcoming ? '✓ In Upcoming' : '+ Add to Upcoming'}
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditSafariItem(ev)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-[11px] font-bold cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSafariEvent(ev.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
