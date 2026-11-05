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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  PublicGroupProfile,
  PrivateMemberRecord,
  GroupAdminAssignment,
  KnownUserAccount,
  SupportEnquiryRecord,
} from '../types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PublicGroupProfile[];
  onDataMutated: () => void;
}

interface ParsedCsvRowPreview {
  rowNumber: number;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  nationalId: string;
  location: string;
  groupId: string;
  isValid: boolean;
  validationNote: string;
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

  const [activeTab, setActiveTab] = useState<
    'members' | 'bulk-import' | 'groups' | 'assignments' | 'enquiries'
  >('members');

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
  const [memberForm, setMemberForm] = useState({
    groupId: 'grp-abayita-ababiri',
    fullName: '',
    title: 'Registered Member',
    phone: '',
    email: '',
    nationalId: '',
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

  // Group Profile Editor State
  const [editingGroupId, setEditingGroupId] = useState<string>('grp-siz-academy');
  const [groupEditForm, setGroupEditForm] = useState({
    summary: '',
    representativeName: '',
    representativeTitle: '',
    projectName: '',
    projectDescription: '',
    supportFocus: '',
    websiteUrl: '',
  });

  // Global Admin Assignments & Enquiries State
  const [assignments, setAssignments] = useState<GroupAdminAssignment[]>([]);
  const [knownUsers, setKnownUsers] = useState<KnownUserAccount[]>([]);
  const [assignEmail, setAssignEmail] = useState('');
  const [assignGroupId, setAssignGroupId] = useState('grp-abayita-ababiri');
  const [enquiries, setEnquiries] = useState<SupportEnquiryRecord[]>([]);
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
    if (allowedMemberGroups.length > 0) {
      const firstId = allowedMemberGroups[0].id;
      setMemberForm((prev) => ({ ...prev, groupId: firstId }));
      setImportGroupId(firstId);
    }
    if (allowedProfiles.length > 0) {
      const firstProf = allowedProfiles[0];
      setEditingGroupId(firstProf.id);
      setGroupEditForm({
        summary: firstProf.summary,
        representativeName: firstProf.representativeName,
        representativeTitle: firstProf.representativeTitle,
        projectName: firstProf.projectName,
        projectDescription: firstProf.projectDescription,
        supportFocus: firstProf.supportFocus,
        websiteUrl: firstProf.websiteUrl || '',
      });
    }
  }, [isOpen, isGlobalAdmin, assignedGroupIds.length]);

  if (!isOpen) return null;

  // Handle selecting a group to edit in Tab 3
  const handleSelectGroupToEdit = (groupId: string) => {
    setEditingGroupId(groupId);
    const found = profiles.find((p) => p.id === groupId);
    if (found) {
      setGroupEditForm({
        summary: found.summary,
        representativeName: found.representativeName,
        representativeTitle: found.representativeTitle,
        projectName: found.projectName,
        projectDescription: found.projectDescription,
        supportFocus: found.supportFocus,
        websiteUrl: found.websiteUrl || '',
      });
    }
  };

  // Save manual member creation or update
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember
        ? `/api/admin/members/${editingMember.id}`
        : '/api/admin/members';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(memberForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Could not save member record.');
        return;
      }

      showBanner(
        'success',
        editingMember
          ? `Updated member record for ${data.member.fullName}.`
          : `Added member record for ${data.member.fullName}.`
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

  // Private CSV Export
  const handleExportMembersCsv = () => {
    const headers = [
      'Full Name',
      'Title / Role',
      'Phone Number',
      'Email Address',
      'National ID (NIN)',
      'Location',
      'Group ID',
      'Group Name',
    ];
    const escapeCell = (val: string) => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const rows = members.map((m) => [
      m.fullName,
      m.title,
      m.phone,
      m.email,
      m.nationalId,
      m.location,
      m.groupId,
      m.groupName || m.groupId,
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
      'fullName,title,phone,email,nationalId,location,groupId',
      `John Ssemakula,Registered Member,+256772990101,john.ssemakula@example.org,CM92019910ABCD,"Abayita Ababiri, Entebbe",${sampleGroupId}`,
      `Mary Namukasa,Treasurer,+256701880202,mary.namukasa@example.org,CF94028820EFGH,"Entebbe, Uganda",${sampleGroupId}`,
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
      const fullName =
        row.fullname || row.name || row.membername || row.member || '';
      const title =
        row.title || row.role || row.position || 'Registered Member';
      const phone =
        row.phone || row.contact || row.phonenumber || row.telephone || row.mobile || '';
      const email = row.email || row.emailaddress || '';
      const nationalId = (row.nationalid || row.nin || '').toUpperCase();
      const location =
        row.location || row.area || row.residence || defaultGroupProfile?.location || 'Entebbe, Uganda';
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
        fullName,
        title,
        phone,
        email,
        nationalId,
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
            fullName: r.fullName,
            title: r.title,
            phone: r.phone,
            email: r.email,
            nationalId: r.nationalId,
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

  // Save Group Profile & Website Updates
  const handleSaveGroupProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/groups/${editingGroupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(groupEditForm),
      });
      const data = await res.json();
      if (!res.ok) {
        showBanner('error', data.error || 'Failed to update group profile.');
      } else {
        showBanner('success', `Updated public profile for ${data.profile.name}.`);
        onDataMutated();
      }
    } catch (err) {
      console.error('Update group error:', err);
      showBanner('error', 'Failed to update group profile.');
    }
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
                  ENGANDA Member Administration & Governance Console
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
                Server-enforced access control • Private member records, CSV operations & enquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
                  Protected Member Registry
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Administrator Sign-In Required
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To protect member privacy, anonymous visitors cannot query member names, phone
                  numbers, emails, or National IDs. Sign in with your authorised Google account to
                  manage your assigned group(s) or global ENGANDA records.
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
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-700 text-left space-y-1">
                  <div className="font-bold text-slate-900">Next Step:</div>
                  <p>
                    Ask a Global ENGANDA Administrator to open the{' '}
                    <strong>Access Control</strong> tab and assign your email (
                    <code className="font-mono font-bold">{user.email}</code>) to your designated
                    community group or SACCO.
                  </p>
                </div>
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
            {/* Navigation Tabs */}
            <div className="bg-slate-900 px-3 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('members')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Private Member Registry ({members.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bulk-import')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'bulk-import'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Bulk CSV Import</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('groups')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'groups'
                    ? 'bg-[#0F5132] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Edit Group Projects & Websites ({allowedProfiles.length})</span>
              </button>

              {isGlobalAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('assignments')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'assignments'
                        ? 'bg-[#0F5132] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Group Access Assignments ({assignments.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('enquiries')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'enquiries'
                        ? 'bg-[#0F5132] text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Partnership & Sponsor Enquiries ({enquiries.length})</span>
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
                          All Assigned Member Groups ({allowedMemberGroups.length})
                        </option>
                        {allowedMemberGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.memberCount} records)
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Search name, role, phone, email, NIN, or location..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleExportMembersCsv}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Private CSV ({members.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingMember(null);
                          setMemberForm({
                            groupId:
                              selectedGroupFilter !== 'all'
                                ? selectedGroupFilter
                                : allowedMemberGroups[0]?.id || 'grp-abayita-ababiri',
                            fullName: '',
                            title: 'Registered Member',
                            phone: '',
                            email: '',
                            nationalId: '',
                            location: 'Entebbe, Uganda',
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
                      className="bg-white p-5 rounded-xl border-2 border-[#0F5132] shadow-md space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {editingMember
                            ? `Edit Member: ${editingMember.fullName}`
                            : 'Create New Member Record'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setShowMemberForm(false);
                            setEditingMember(null);
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Assigned Group *
                          </label>
                          <select
                            value={memberForm.groupId}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, groupId: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
                          >
                            {allowedMemberGroups.map((g) => (
                              <option key={g.id} value={g.id}>
                                {g.name}
                              </option>
                            ))}
                          </select>
                        </div>

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

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            National ID (NIN)
                          </label>
                          <input
                            type="text"
                            value={memberForm.nationalId}
                            onChange={(e) =>
                              setMemberForm({ ...memberForm, nationalId: e.target.value })
                            }
                            placeholder="CM900000000000"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
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

                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#0F5132] hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
                          >
                            {editingMember ? 'Save Member Changes' : 'Create Member Record'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Private Member Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[860px] text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                            <th className="py-3 px-4">Full Name & Role</th>
                            <th className="py-3 px-4">Group</th>
                            <th className="py-3 px-4">Phone & Email</th>
                            <th className="py-3 px-4">National ID (NIN)</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-xs">
                          {loadingMembers ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-500">
                                Loading private member records...
                              </td>
                            </tr>
                          ) : paginatedMembers.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-500">
                                No member records found matching your filter.
                              </td>
                            </tr>
                          ) : (
                            paginatedMembers.map((m) => (
                              <tr key={m.id} className="hover:bg-slate-50">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-900">{m.fullName}</div>
                                  <div className="text-slate-500 text-[11px]">{m.title}</div>
                                </td>
                                <td className="py-3 px-4 font-semibold text-[#0F5132]">
                                  {m.groupName || m.groupId}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-mono text-slate-800">{m.phone}</div>
                                  <div className="text-slate-400 text-[11px]">{m.email || '—'}</div>
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-700">
                                  {m.nationalId || '—'}
                                </td>
                                <td className="py-3 px-4 text-slate-600">{m.location}</td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
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
                                            groupId: m.groupId,
                                            fullName: m.fullName,
                                            title: m.title,
                                            phone: m.phone,
                                            email: m.email,
                                            nationalId: m.nationalId,
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
                          Supports common headers (fullName/name, title/role, phone/contact, email,
                          nationalId/NIN, location, groupId/group). Exact duplicates (normalized
                          name + phone) are automatically detected and skipped.
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
                          {allowedMemberGroups.map((g) => (
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
                          'fullName,title,phone,email,nationalId,location\nSamuel Kato,Member,+256772555111,samuel@example.org,CM9011223344,"Entebbe, Uganda"'
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
                                <th className="py-2 px-3">Phone</th>
                                <th className="py-2 px-3">NIN</th>
                                <th className="py-2 px-3">Validation Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {previewRows.slice(0, 50).map((r) => (
                                <tr key={r.rowNumber}>
                                  <td className="py-2 px-3 font-mono">{r.rowNumber}</td>
                                  <td className="py-2 px-3 font-semibold">{r.fullName || '—'}</td>
                                  <td className="py-2 px-3 font-mono">{r.phone || '—'}</td>
                                  <td className="py-2 px-3 font-mono">{r.nationalId || '—'}</td>
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

              {/* TAB 3: EDIT GROUP PROJECTS & WEBSITES */}
              {activeTab === 'groups' && (
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl space-y-5">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Edit Group or Programme Project, Website & Support Focus
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Update the public project description, representative details, website URL, or
                      partnership focus for your assigned group(s).
                    </p>
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
                          {p.name} ({p.programmeType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <form onSubmit={handleSaveGroupProfile} className="space-y-4">
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
                      <span>Save Group Profile Changes</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: GLOBAL ADMIN — GROUP ACCESS ASSIGNMENTS */}
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

              {/* TAB 5: GLOBAL ADMIN — PRIVATE ENQUIRIES INBOX */}
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
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
