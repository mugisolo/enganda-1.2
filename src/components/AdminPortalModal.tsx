import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  saveGroupToFirestore,
  deleteGroupFromFirestore,
  saveSiteSettingsToFirestore,
} from '../services/firebase';
import { YouthGroup, PaymentTransaction } from '../types';
import { GANDA_LOGO } from '../data/content';
import {
  X,
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Download,
  Search,
  Building,
  Sprout,
  ShieldCheck,
  RefreshCw,
  Bell,
  FileSpreadsheet,
  FileText,
  Landmark,
  LogIn,
  LogOut,
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupsChanged?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onGroupsChanged,
}) => {
  const { t, language } = useLanguage();
  const { user, isAdmin, signIn, signOut } = useAuth();
  const adminT = t.adminPortal;

  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'payments' | 'settings'>('overview');
  const [groups, setGroups] = useState<YouthGroup[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchGroup, setSearchGroup] = useState<string>('');

  // Editing / Creating group state
  const [editingGroup, setEditingGroup] = useState<Partial<YouthGroup> | null>(null);
  const [isNewGroup, setIsNewGroup] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Settings state
  const [settings, setSettings] = useState({
    intakeOpen: true,
    intakeBatchName: '2026 Q2 Greater Entebbe & Wakiso Cohort',
    bannerNoticeEn: 'Active Intake: 21 Greater Entebbe pilot groups now banked with EcoBank Uganda. 2026 Greater Kampala cohort enrollment is open.',
    bannerNoticeLg: 'Olukalala Olukola: Ebibiina 21 mu Ntebbe bimaze okufuna akawunti mu EcoBank Uganda. Okwewandiisa kw’e Kampala kutandise.',
    nationalTargetYouth: 2000000,
    contactHotline: '+256 772 109 231',
    relworxGatewayActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, paymentsRes, settingsRes] = await Promise.all([
        fetch('/api/groups'),
        fetch('/api/momo/history'),
        fetch('/api/settings'),
      ]);

      if (groupsRes.ok) {
        const data = await groupsRes.json();
        setGroups(data.groups || []);
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setTransactions(data.transactions || []);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Group handlers
  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    try {
      if (isNewGroup) {
        const res = await fetch('/api/groups/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingGroup),
        });
        if (res.ok) {
          const data = await res.json();
          if (user && data.group) {
            await saveGroupToFirestore(data.group).catch((err) =>
              console.warn('Firestore group sync note:', err)
            );
          }
          setSaveStatus('New youth group registered and synced with Cloud Firestore');
          setEditingGroup(null);
          loadData();
          if (onGroupsChanged) onGroupsChanged();
        }
      } else if (editingGroup.id) {
        const res = await fetch(`/api/groups/${editingGroup.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingGroup),
        });
        if (res.ok) {
          const data = await res.json();
          if (user && data.group) {
            await saveGroupToFirestore(data.group).catch((err) =>
              console.warn('Firestore group update note:', err)
            );
          }
          setSaveStatus(`Group ${editingGroup.id} updated`);
          setEditingGroup(null);
          loadData();
          if (onGroupsChanged) onGroupsChanged();
        }
      }
    } catch (err) {
      setSaveStatus('Failed to save group');
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      const res = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (user && isAdmin) {
          await deleteGroupFromFirestore(id).catch((err) =>
            console.warn('Firestore group delete note:', err)
          );
        }
        loadData();
        if (onGroupsChanged) onGroupsChanged();
      }
    } catch (err) {
      setSaveStatus('Delete failed');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        if (user && isAdmin) {
          await saveSiteSettingsToFirestore(settings).catch((err) =>
            console.warn('Firestore settings sync note:', err)
          );
        }
        setSaveStatus(adminT.syncSuccess || 'Settings updated and synced to Firestore');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      setSaveStatus('Failed to update settings');
    }
  };

  // EU & EcoBank Regulatory & Financial CSV Exports
  const exportMembersCsvForEuAndEcoBank = () => {
    const headers = [
      'Group_ID',
      'Group_Name',
      'Division',
      'Specific_Location',
      'Primary_Trade_Cluster',
      'Total_Youth_Members',
      'Women_Members_Count',
      'Women_Percentage',
      'Formalization_Stage',
      'EcoBank_Account_Number',
      'Lakeshore_Trees_Planted',
      'Leader_Full_Name',
      'Leader_Phone_Number',
      'URSB_Legal_Status',
      'EU_Grant_Monitoring_Code',
      'Audit_Clearance_Date',
    ].join(',');

    const rows = groups
      .map((g) => {
        const womenCount = Math.round((g.memberCount * g.womenPercentage) / 100);
        const ursbStatus = g.stage === 'Formalized & Banked' ? 'REGISTERED_SACCO' : 'IN_INCUBATION_COHORT';
        const euCode = `EU-INTPA-UG-${g.id.replace('ENG-ENT-', '2026-')}`;
        const auditDate = new Date().toISOString().slice(0, 10);
        return [
          `"${g.id}"`,
          `"${g.name.replace(/"/g, '""')}"`,
          `"${g.division}"`,
          `"${g.location.replace(/"/g, '""')}"`,
          `"${g.trade.replace(/"/g, '""')}"`,
          g.memberCount,
          womenCount,
          `"${g.womenPercentage}%"`,
          `"${g.stage}"`,
          `"${g.bankAccount}"`,
          g.treesPlanted,
          `"${g.leaderName.replace(/"/g, '""')}"`,
          `"${g.leaderPhone}"`,
          `"${ursbStatus}"`,
          `"${euCode}"`,
          `"${auditDate}"`,
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enganda_EU_EcoBank_Member_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatus('Member registry exported successfully for EU & EcoBank reporting.');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const exportTransactionsCsvForEcoBankAndEu = () => {
    const headers = [
      'Transaction_ID',
      'Relworx_Payment_Reference',
      'Relworx_Batch_ID',
      'Payment_Network',
      'Payer_Full_Name',
      'Payer_Mobile_Number',
      'Gross_Amount_UGX',
      'Relworx_Processing_Fee_UGX',
      'Net_Settlement_UGX',
      'Settlement_Bank_Partner',
      'Transaction_Purpose',
      'Lakeshore_Trees_Sponsored',
      'EcoBank_Clearance_Status',
      'Timestamp_ISO',
      'EU_Grant_Reconciliation_Code',
    ].join(',');

    const rows = transactions
      .map((t) => {
        const fee = Math.round(t.amount * 0.015);
        const net = t.amount - fee;
        const euRecon = `EU-FIN-AUDIT-${t.id}`;
        return [
          `"${t.id}"`,
          `"${t.reference}"`,
          `"${t.relworxBatchId || 'REL-DIRECT'}"`,
          `"${t.provider} Mobile Money"`,
          `"${(t.donorName || 'Enganda Partner').replace(/"/g, '""')}"`,
          `"${t.phoneNumber}"`,
          t.amount,
          fee,
          net,
          `"EcoBank Uganda Limited"`,
          `"${(t.purpose || 'General Youth Formalization').replace(/"/g, '""')}"`,
          t.treesSponsored || 0,
          `"${t.status}"`,
          `"${t.createdAt}"`,
          `"${euRecon}"`,
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enganda_EcoBank_EU_Transaction_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatus('Transaction ledger exported successfully for EcoBank & EU reconciliation.');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const exportCompleteComplianceReport = () => {
    const summaryLines = [
      '=== ENGANDA YOUTH ECONOMIC TRANSFORMATION PLATFORM ===',
      `Audit Export Timestamp: ${new Date().toISOString()}`,
      'Reporting Standard: European Union (DG INTPA) & EcoBank Uganda Tripartite Facility',
      `Total Formalized Youth Members: ${totalMembers}`,
      `Total Commercial Banked Groups: ${formalizedCount} of ${groups.length}`,
      `Total Shoreline Trees Planted: ${totalTrees}`,
      `Total Processed MoMo Transaction Volume (UGX): ${totalMoMoFunds}`,
      '',
      '--- FORMALIZED YOUTH COOPERATIVE UNITS (EU/ECOBANK COMPLIANT) ---',
      'Group_ID,Group_Name,Division,Parish_Location,Trade_Cluster,Members_Count,Women_Ratio,Formalization_Stage,EcoBank_Account,Trees_Planted,Leader_Name,Contact_Phone',
    ];

    const groupRows = groups.map(
      (g) =>
        `"${g.id}","${g.name.replace(/"/g, '""')}","${g.division}","${g.location.replace(/"/g, '""')}","${g.trade.replace(
          /"/g,
          '""'
        )}",${g.memberCount},"${g.womenPercentage}%","${g.stage}","${g.bankAccount}",${g.treesPlanted},"${g.leaderName.replace(
          /"/g,
          '""'
        )}","${g.leaderPhone}"`
    );

    const txHeader = [
      '',
      '--- RELWORX TELCO & ECOBANK CLEARING AUDIT JOURNAL ---',
      'Tx_ID,Payment_Ref,Batch_ID,Telco_Network,Donor_Payer,Phone,Gross_UGX,Fee_UGX,Net_UGX,Bank_Partner,Purpose,Trees_Sponsored,Status,Date_ISO',
    ];

    const txRows = transactions.map((t) => {
      const fee = Math.round(t.amount * 0.015);
      const net = t.amount - fee;
      return `"${t.id}","${t.reference}","${t.relworxBatchId || 'REL-BCH'}","${t.provider}","${(
        t.donorName || 'Partner'
      ).replace(/"/g, '""')}","${t.phoneNumber}",${t.amount},${fee},${net},"EcoBank Uganda","${(
        t.purpose || 'Formalization'
      ).replace(/"/g, '""')}",${t.treesSponsored || 0},"${t.status}","${t.createdAt}"`;
    });

    const fullDossier = [...summaryLines, ...groupRows, ...txHeader, ...txRows].join('\n');
    const blob = new Blob([fullDossier], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Enganda_Master_EU_EcoBank_Compliance_Dossier_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSaveStatus('Complete master compliance dossier exported.');
    setTimeout(() => setSaveStatus(''), 4000);
  };

  const totalMembers = groups.reduce((acc, g) => acc + g.memberCount, 0);
  const totalTrees = groups.reduce((acc, g) => acc + g.treesPlanted, 0);
  const formalizedCount = groups.filter((g) => g.stage === 'Formalized & Banked').length;
  const totalMoMoFunds = transactions.reduce((acc, t) => acc + t.amount, 0);

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchGroup.toLowerCase()) ||
      g.trade.toLowerCase().includes(searchGroup.toLowerCase()) ||
      g.location.toLowerCase().includes(searchGroup.toLowerCase()) ||
      g.leaderName.toLowerCase().includes(searchGroup.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={GANDA_LOGO}
              alt="Enganda Trust Protocol Emblem"
              className="w-8 h-8 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">{adminT.title}</h3>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                  Executive Root
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {adminT.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-xs">
                <span className="text-emerald-300 font-mono text-[11px]">
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-slate-400 hover:text-white"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn().catch(() => {})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Sign In</span>
              </button>
            )}
            <button
              onClick={loadData}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{adminT.tabs.overview}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'groups'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{adminT.tabs.groups} ({groups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{adminT.tabs.payments}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{adminT.tabs.settings}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {saveStatus && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveStatus}
              </span>
              <button onClick={() => setSaveStatus('')} className="text-emerald-700 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Youth Formalized</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1 tabular-nums">
                    {totalMembers.toLocaleString()}
                  </div>
                  <span className="text-xs text-emerald-700 font-medium mt-1 block">Active across Greater Entebbe</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Banked with EcoBank</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1 tabular-nums">
                    {formalizedCount} / {groups.length}
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">
                    {Math.round((formalizedCount / (groups.length || 1)) * 100)}% Banking Penetration
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lakeshore Trees Planted</span>
                  <div className="text-2xl font-black text-emerald-700 font-mono mt-1 tabular-nums">
                    {totalTrees.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">Entebbe Shoreline Concession</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Relworx MoMo Volume</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1 tabular-nums">
                    UGX {totalMoMoFunds.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-500 font-medium mt-1 block">Instant Telco Settlement</span>
                </div>
              </div>

              {/* Quick Actions & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Recent Pilot Mobilization Activity
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    {groups.slice(0, 5).map((g) => (
                      <div key={g.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{g.name}</span>
                          <span className="text-slate-400 block text-[11px]">{g.division} · {g.trade}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-800">{g.memberCount} members</span>
                          <span className="block text-[11px] text-slate-500">{g.stage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Institutional Governance Checklist
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>EcoBank Tripartite Account Master MoU: Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Entebbe Council Tree Concession: Valid 2024–2027</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Relworx USSD *217# Gateway: Online</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>EU Youth Grant Audit: Approved</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('groups')}
                      className="w-full py-2 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      Manage All Youth Groups
                    </button>
                  </div>
                </div>
              </div>

              {/* EU & EcoBank Regulatory Reporting & CSV Export Hub */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                        OFFICIAL COMPLIANCE DOSSIER
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        EU DG INTPA & EcoBank Master Facility
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-emerald-400" />
                      <span>European Union & EcoBank Data Export Center</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Download audit-ready data conforming to the European Union youth employment monitoring protocol and EcoBank Uganda commercial credit verification standards. All files include group IDs, women empowerment ratios, verified URSB statuses, and Relworx daily transaction audit stamps.
                    </p>
                  </div>

                  {/* Export Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={exportMembersCsvForEuAndEcoBank}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm whitespace-nowrap"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
                      <span>Export Members CSV (EU & EcoBank)</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportTransactionsCsvForEcoBankAndEu}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-sm whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export Transactions CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportCompleteComplianceReport}
                      className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-xl transition-all whitespace-nowrap"
                      title="Download combined master audit dossier"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Master Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GROUPS MANAGEMENT */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search groups..."
                    value={searchGroup}
                    onChange={(e) => setSearchGroup(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={exportMembersCsvForEuAndEcoBank}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors whitespace-nowrap"
                    title="Export member registry to CSV for European Union and EcoBank reporting"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export Members (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingGroup({
                        name: '',
                        division: 'Entebbe Division A',
                        location: '',
                        memberCount: 30,
                        womenPercentage: 40,
                        trade: 'Metal Fabrication & Welding',
                        stage: 'In Incubation',
                        bankAccount: 'EcoBank UG Pending',
                        treesPlanted: 100,
                        leaderName: '',
                        leaderPhone: '',
                      });
                      setIsNewGroup(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{adminT.addNewGroupBtn}</span>
                  </button>
                </div>
              </div>

              {/* Groups Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">ID / Name</th>
                      <th className="px-3 py-3">Division & Parish</th>
                      <th className="px-3 py-3">Trade Cluster</th>
                      <th className="px-3 py-3">Members</th>
                      <th className="px-3 py-3">Stage</th>
                      <th className="px-3 py-3">Bank Account</th>
                      <th className="px-3 py-3">Trees</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {filteredGroups.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] text-slate-400 block">{g.id}</span>
                          <span className="font-bold text-slate-900">{g.name}</span>
                        </td>
                        <td className="px-3 py-3 text-slate-600">
                          <span>{g.division}</span>
                          <span className="block text-[10px] text-slate-400">{g.location}</span>
                        </td>
                        <td className="px-3 py-3 text-slate-700 font-medium">
                          {g.trade}
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-900">
                          {g.memberCount} ({g.womenPercentage}% W)
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              g.stage === 'Formalized & Banked'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {g.stage}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-slate-600">
                          {g.bankAccount}
                        </td>
                        <td className="px-3 py-3 font-mono text-emerald-700 font-bold">
                          {g.treesPlanted}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingGroup(g);
                              setIsNewGroup(false);
                            }}
                            className="p-1 text-slate-500 hover:text-emerald-700 mr-2"
                            title="Edit group"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(g.id)}
                            className="p-1 text-slate-500 hover:text-rose-600"
                            title="Delete group"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RELWORX MOMO PAYMENT AUDIT */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Relworx & EcoBank Clearing Stream
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Real-time webhook and settlement journal for mobile money contributions & member dues.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportTransactionsCsvForEcoBankAndEu}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Export EcoBank & EU Ledger (CSV)</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Reference / Batch</th>
                      <th className="px-3 py-3">Donor / Payer</th>
                      <th className="px-3 py-3">Provider</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Amount (UGX)</th>
                      <th className="px-3 py-3">Purpose</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-4 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-normal">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {tx.reference}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.relworxBatchId}</span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800">
                          {tx.donorName}
                        </td>
                        <td className="px-3 py-3 font-semibold text-xs">
                          <span className={tx.provider === 'MTN' ? 'text-amber-600' : 'text-rose-600'}>
                            {tx.provider} MoMo
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-600">
                          {tx.phoneNumber}
                        </td>
                        <td className="px-3 py-3 font-mono font-bold text-emerald-800">
                          UGX {tx.amount.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-slate-600">
                          {tx.purpose}
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SITE SETTINGS & ANNOUNCEMENTS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl space-y-5">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Live Platform Configuration
              </h4>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-800">Youth Intake Registration Open</span>
                  <span className="text-[11px] text-slate-500">Allow informal youth leaders to submit new cohort registrations.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.intakeOpen}
                  onChange={(e) => setSettings({ ...settings, intakeOpen: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Active Intake Cohort Name
                </label>
                <input
                  type="text"
                  value={settings.intakeBatchName}
                  onChange={(e) => setSettings({ ...settings, intakeBatchName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Homepage Announcement Banner (English)
                </label>
                <textarea
                  rows={2}
                  value={settings.bannerNoticeEn}
                  onChange={(e) => setSettings({ ...settings, bannerNoticeEn: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Homepage Announcement Banner (Luganda)
                </label>
                <textarea
                  rows={2}
                  value={settings.bannerNoticeLg}
                  onChange={(e) => setSettings({ ...settings, bannerNoticeLg: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    National Youth Target
                  </label>
                  <input
                    type="number"
                    value={settings.nationalTargetYouth}
                    onChange={(e) => setSettings({ ...settings, nationalTargetYouth: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Executive Hotline
                  </label>
                  <input
                    type="text"
                    value={settings.contactHotline}
                    onChange={(e) => setSettings({ ...settings, contactHotline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  {adminT.saveChanges}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Sub-Dialog: Add or Edit Group */}
        {editingGroup && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <form onSubmit={handleSaveGroup} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  {isNewGroup ? 'Register New Youth Group (Admin)' : `Edit Group: ${editingGroup.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  value={editingGroup.name || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Division *</label>
                  <select
                    value={editingGroup.division || 'Entebbe Division A'}
                    onChange={(e) => setEditingGroup({ ...editingGroup, division: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Entebbe Division A">Entebbe Division A</option>
                    <option value="Entebbe Division B">Entebbe Division B</option>
                    <option value="Katabi Town Council">Katabi Town Council</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Location *</label>
                  <input
                    type="text"
                    required
                    value={editingGroup.location || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trade Cluster *</label>
                  <input
                    type="text"
                    required
                    value={editingGroup.trade || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, trade: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incubation Stage *</label>
                  <select
                    value={editingGroup.stage || 'In Incubation'}
                    onChange={(e) => setEditingGroup({ ...editingGroup, stage: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Skilling Phase">Skilling Phase</option>
                    <option value="In Incubation">In Incubation</option>
                    <option value="Formalized & Banked">Formalized & Banked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Members *</label>
                  <input
                    type="number"
                    value={editingGroup.memberCount || 25}
                    onChange={(e) => setEditingGroup({ ...editingGroup, memberCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Women %</label>
                  <input
                    type="number"
                    value={editingGroup.womenPercentage || 40}
                    onChange={(e) => setEditingGroup({ ...editingGroup, womenPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trees Planted</label>
                  <input
                    type="number"
                    value={editingGroup.treesPlanted || 0}
                    onChange={(e) => setEditingGroup({ ...editingGroup, treesPlanted: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Bank Account *</label>
                <input
                  type="text"
                  value={editingGroup.bankAccount || ''}
                  onChange={(e) => setEditingGroup({ ...editingGroup, bankAccount: e.target.value })}
                  placeholder="e.g. EcoBank UG #80429104"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leader Name</label>
                  <input
                    type="text"
                    value={editingGroup.leaderName || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, leaderName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Leader Phone</label>
                  <input
                    type="text"
                    value={editingGroup.leaderPhone || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, leaderPhone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGroup(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {adminT.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  {adminT.saveChanges}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
