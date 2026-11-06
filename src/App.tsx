import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SafarisEventsSection } from './components/SafarisEventsSection';
import { AboutNetworkSection } from './components/AboutNetworkSection';
import { ImpactMetricsSection } from './components/ImpactMetricsSection';
import { FlagshipProgrammesSection } from './components/FlagshipProgrammesSection';
import { GroupDirectorySection } from './components/GroupDirectorySection';
import { FoundersSection } from './components/FoundersSection';
import { Footer } from './components/Footer';
import { SupportEnquiryModal } from './components/SupportEnquiryModal';
import { AdminPortalModal, AdminTabType } from './components/AdminPortalModal';
import { TransitionHistoryModal } from './components/TransitionHistoryModal';
import {
  PublicGroupProfile,
  DirectoryMeta,
  SupportEnquiryPreset,
  SiteMediaSettings,
  SafariEventItem,
} from './types';
import { DEFAULT_SITE_MEDIA, DEFAULT_SAFARI_EVENTS } from './data/content';

function EngandaMainApp() {
  const [profiles, setProfiles] = useState<PublicGroupProfile[]>([]);
  const [meta, setMeta] = useState<DirectoryMeta | null>(null);
  const [siteMedia, setSiteMedia] = useState<SiteMediaSettings>(DEFAULT_SITE_MEDIA);
  const [safariEvents, setSafariEvents] = useState<SafariEventItem[]>(DEFAULT_SAFARI_EVENTS);

  // Modals state
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportPreset, setSupportPreset] = useState<SupportEnquiryPreset | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTabType>('members');
  const [adminInitialGroupId, setAdminInitialGroupId] = useState<string | undefined>(undefined);
  const [transitionModalOpen, setTransitionModalOpen] = useState(false);

  const loadDirectory = useCallback(async () => {
    try {
      const res = await fetch('/api/directory');
      if (res.ok) {
        const data = await res.json();
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
        setMeta(data.meta || null);
        if (data.siteMedia) {
          setSiteMedia({ ...DEFAULT_SITE_MEDIA, ...data.siteMedia });
        }
        if (Array.isArray(data.safariEvents) && data.safariEvents.length > 0) {
          setSafariEvents(data.safariEvents);
        }
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

  const handleOpenAdminModal = (tab: AdminTabType = 'members', groupId?: string) => {
    setAdminInitialTab(tab);
    setAdminInitialGroupId(groupId);
    setAdminModalOpen(true);
  };

  const handleOpenPhotoReplacer = () => {
    handleOpenAdminModal('site-media');
  };

  const handleOpenSafariAdmin = () => {
    handleOpenAdminModal('safaris-events');
  };

  const handleOpenGroupGalleryEditor = (groupId: string) => {
    handleOpenAdminModal('groups', groupId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 antialiased selection:bg-emerald-200 selection:text-emerald-950 overflow-x-clip">
      {/* Top Header & Navigation */}
      <Navbar
        onOpenSupportModal={handleOpenSupportModal}
        onOpenAdminModal={() => handleOpenAdminModal('members')}
        onOpenTransitionModal={() => setTransitionModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Editorial Hero Section with Bounded Carousel */}
        <Hero
          totalProfiles={meta?.totalPublicProfiles ?? 15}
          memberGroupsCount={meta?.memberGroupsCount ?? 13}
          totalMemberRecords={meta?.totalSuppliedMemberRecords ?? 690}
          siteMedia={siteMedia}
          safariEvents={safariEvents}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenAdminModal={() => handleOpenAdminModal('members')}
          onOpenPhotoReplacer={handleOpenPhotoReplacer}
          onOpenSafariAdmin={handleOpenSafariAdmin}
          onOpenTransitionModal={() => setTransitionModalOpen(true)}
        />

        {/* 2. ENGANDA Safaris, Featured Carousel & Upcoming Programs Section */}
        <SafarisEventsSection
          safariEvents={safariEvents}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenSafariAdmin={handleOpenSafariAdmin}
        />

        {/* 3. Restructured About Section with Infographics & Replaceable AI Photos */}
        <AboutNetworkSection
          siteMedia={siteMedia}
          onOpenPhotoReplacer={handleOpenPhotoReplacer}
        />

        {/* 4. Impact Metrics (Recharts 2,000,000 Target & 690 Cohort) + Interactive Entebbe Map */}
        <ImpactMetricsSection
          profiles={profiles}
          totalMemberRecords={meta?.totalSuppliedMemberRecords ?? 690}
          onOpenTransitionModal={() => setTransitionModalOpen(true)}
          onOpenSupportModal={handleOpenSupportModal}
        />

        {/* 5. Flagship Programmes & Hierarchy (SIZ Football Academy, EGYA Association, LeoLeo) */}
        <FlagshipProgrammesSection
          profiles={profiles}
          siteMedia={siteMedia}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenPhotoReplacer={handleOpenPhotoReplacer}
          onOpenGroupGalleryEditor={handleOpenGroupGalleryEditor}
        />

        {/* 6. Complete 15-Profile Public Group Directory (13 Member Groups = 690 Records + SIZ & LeoLeo) */}
        <GroupDirectorySection
          profiles={profiles}
          meta={meta}
          onOpenSupportModal={handleOpenSupportModal}
          onOpenAdminModal={() => handleOpenAdminModal('members')}
          onOpenGroupGalleryEditor={handleOpenGroupGalleryEditor}
        />

        {/* 7. Executive Leadership */}
        <FoundersSection
          siteMedia={siteMedia}
          onOpenPhotoReplacer={handleOpenPhotoReplacer}
        />
      </main>

      {/* Footer with Powered by Enganda, RONSOL, RELWORX, FINCA & ECO Bank, SPYDA MC */}
      <Footer
        onOpenSupportModal={handleOpenSupportModal}
        onOpenAdminModal={() => handleOpenAdminModal('members')}
        onOpenTransitionModal={() => setTransitionModalOpen(true)}
      />

      {/* Support, Sponsorship, Investment & Partnership Enquiry Modal */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        profiles={profiles}
        preset={supportPreset}
      />

      {/* Working Member Administration, Safaris/Events & Media Governance Console */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        profiles={profiles}
        siteMedia={siteMedia}
        safariEvents={safariEvents}
        initialTab={adminInitialTab}
        initialGroupId={adminInitialGroupId}
        onDataMutated={loadDirectory}
      />

      {/* Historical Youth Group Transition Milestones Log Modal */}
      <TransitionHistoryModal
        isOpen={transitionModalOpen}
        onClose={() => setTransitionModalOpen(false)}
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
