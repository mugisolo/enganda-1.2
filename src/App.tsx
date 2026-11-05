import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutNetworkSection } from './components/AboutNetworkSection';
import { FlagshipProgrammesSection } from './components/FlagshipProgrammesSection';
import { GroupDirectorySection } from './components/GroupDirectorySection';
import { FoundersSection } from './components/FoundersSection';
import { Footer } from './components/Footer';
import { SupportEnquiryModal } from './components/SupportEnquiryModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PublicGroupProfile, DirectoryMeta, SupportEnquiryPreset } from './types';

function EngandaMainApp() {
  const [profiles, setProfiles] = useState<PublicGroupProfile[]>([]);
  const [meta, setMeta] = useState<DirectoryMeta | null>(null);

  // Modals state
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportPreset, setSupportPreset] = useState<SupportEnquiryPreset | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const loadDirectory = useCallback(async () => {
    try {
      const res = await fetch('/api/directory');
      if (res.ok) {
        const data = await res.json();
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
        setMeta(data.meta || null);
      }
    } catch (err) {
      console.error('[ENGANDA] Failed to load public directory:', err);
    }
  }, []);

  useEffect(() => {
    loadDirectory();
  }, [loadDirectory]);

  const handleOpenSupportModal = (preset?: SupportEnquiryPreset) => {
    setSupportPreset(
      preset || {
        groupId: 'grp-siz-academy',
        groupName: 'SIZ Football Academy',
        supportType: 'Sponsor',
      }
    );
    setSupportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-950 overflow-x-clip">
      {/* Top Header & Navigation */}
      <Navbar
        onOpenSupportModal={handleOpenSupportModal}
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Editorial Hero Section */}
        <Hero
          totalProfiles={meta?.totalPublicProfiles ?? 15}
          memberGroupsCount={meta?.memberGroupsCount ?? 13}
          totalMemberRecords={meta?.totalSuppliedMemberRecords ?? 690}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenAdminModal={() => setAdminModalOpen(true)}
        />

        {/* 2. Restructured About Section with Infographics (Umbrella Diagram, Organise->Formalise->Grow, 3 Capacity Areas) */}
        <AboutNetworkSection />

        {/* 3. Flagship Programmes & Hierarchy (SIZ Football Academy, EGYA Association, LeoLeo) */}
        <FlagshipProgrammesSection
          profiles={profiles}
          onOpenSupportModal={handleOpenSupportModal}
        />

        {/* 4. Complete 15-Profile Public Group Directory (13 Member Groups = 690 Records + SIZ & LeoLeo) */}
        <GroupDirectorySection
          profiles={profiles}
          meta={meta}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenAdminModal={() => setAdminModalOpen(true)}
        />

        {/* 5. Executive Leadership */}
        <FoundersSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenSupportModal={handleOpenSupportModal}
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

      {/* Support, Sponsorship, Investment & Partnership Enquiry Modal */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        profiles={profiles}
        preset={supportPreset}
      />

      {/* Working Member Administration & Governance Console */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        profiles={profiles}
        onDataMutated={loadDirectory}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EngandaMainApp />
    </AuthProvider>
  );
}
