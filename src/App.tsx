import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemStatement } from './components/ProblemStatement';
import { PillarsSection } from './components/PillarsSection';
import { PilotScaleSection } from './components/PilotScaleSection';
import { ImpactStoriesCarousel } from './components/ImpactStoriesCarousel';
import { InvestSection } from './components/InvestSection';
import { PartnersPageSection } from './components/PartnersPageSection';
import { FoundersSection } from './components/FoundersSection';
import { PartnersSection } from './components/PartnersSection';
import { Footer } from './components/Footer';
import { GroupRegistrationModal } from './components/GroupRegistrationModal';
import { PaymentModal } from './components/PaymentModal';
import { UssdSimulatorModal } from './components/UssdSimulatorModal';
import { AdvisorChatModal } from './components/AdvisorChatModal';
import { PartnerInquiryModal } from './components/PartnerInquiryModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { RoleUserPortalModal } from './components/RoleUserPortalModal';
import { Bell, ArrowRight } from 'lucide-react';

function EngandaApp() {
  const { language, t } = useLanguage();

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isUssdOpen, setIsUssdOpen] = useState<boolean>(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [isPartnerOpen, setIsPartnerOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isUserPortalOpen, setIsUserPortalOpen] = useState<boolean>(false);

  // Investment target group preset
  const [targetGroupPreset, setTargetGroupPreset] = useState<{ id: string; name: string } | null>(null);

  // Live Announcement Banner from API /settings
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (err) {
        console.error('Settings load err:', err);
      }
    }
    loadSettings();
  }, []);

  const handleInvestInGroup = (groupId: string, groupName: string) => {
    setTargetGroupPreset({ id: groupId, name: groupName });
    const investEl = document.getElementById('invest');
    if (investEl) {
      investEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Dynamic Announcement Banner managed via Admin Panel */}
      {siteSettings && (
        <div className="bg-emerald-900 text-white text-xs px-4 py-2 border-b border-emerald-950 flex items-center justify-center gap-2">
          <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-center">
            {language === 'lg' ? siteSettings.bannerNoticeLg : siteSettings.bannerNoticeEn}
          </span>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="underline hover:text-amber-300 font-bold ml-1.5 whitespace-nowrap hidden sm:inline"
          >
            {t.nav.registerGroup} &rarr;
          </button>
        </div>
      )}

      {/* Top Navigation Bar with active EN/LG state toggle */}
      <Navbar
        onOpenPartnerModal={() => setIsPartnerOpen(true)}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        onOpenUssdModal={() => setIsUssdOpen(true)}
        onOpenAdvisorModal={() => setIsAdvisorOpen(true)}
        onOpenAdminPortal={() => setIsAdminOpen(true)}
        onOpenUserPortal={() => setIsUserPortalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. High-Impact Hero Section */}
        <Hero
          onOpenPartnerModal={() => setIsPartnerOpen(true)}
          onOpenRegisterModal={() => setIsRegisterOpen(true)}
          onOpenPaymentModal={() => setIsPaymentOpen(true)}
        />

        {/* 2. Context & Problem Statement Card */}
        <ProblemStatement />

        {/* 3. The 3 Core Pillars Section (Interactive Tabs) */}
        <PillarsSection
          onOpenRegisterModal={() => setIsRegisterOpen(true)}
          onOpenPaymentModal={() => setIsPaymentOpen(true)}
        />

        {/* 4. Pilot & Scale Section with Interactive Uganda & Entebbe Map */}
        <PilotScaleSection
          onOpenRegisterModal={() => setIsRegisterOpen(true)}
          onOpenPaymentModal={() => setIsPaymentOpen(true)}
        />

        {/* 5. Interactive Impact Stories Carousel (Filtered by trade, before/after metrics) */}
        <ImpactStoriesCarousel
          onInvestInGroup={handleInvestInGroup}
        />

        {/* 6. Comprehensive Invest & Fund Page Section (Direct Fund, Grants, Impact Investors) */}
        <InvestSection
          targetGroupPreset={targetGroupPreset}
          onCommitInvestment={() => {
            // Optional callback or trigger toast
          }}
        />

        {/* 7. Institutional Partners & Ecosystem Page Section */}
        <PartnersPageSection
          onOpenPartnerModal={() => setIsPartnerOpen(true)}
        />

        {/* 8. Leadership & Founders Section */}
        <FoundersSection />
      </main>

      {/* 7. Institutional Footer */}
      <Footer
        onOpenPartnerModal={() => setIsPartnerOpen(true)}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        onOpenUssdModal={() => setIsUssdOpen(true)}
        onOpenAdvisorModal={() => setIsAdvisorOpen(true)}
        onOpenAdminPortal={() => setIsAdminOpen(true)}
        onOpenUserPortal={() => setIsUserPortalOpen(true)}
      />

      {/* Interactive Modals */}
      <GroupRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessRegistered={() => {}}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <UssdSimulatorModal
        isOpen={isUssdOpen}
        onClose={() => setIsUssdOpen(false)}
      />

      <AdvisorChatModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        language={language}
      />

      <PartnerInquiryModal
        isOpen={isPartnerOpen}
        onClose={() => setIsPartnerOpen(false)}
      />

      {/* Admin Operations Portal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onGroupsChanged={() => {}}
      />

      {/* Role-Based User Portal (Donor, Partner, Group Member) */}
      <RoleUserPortalModal
        isOpen={isUserPortalOpen}
        onClose={() => setIsUserPortalOpen(false)}
        onOpenPaymentModal={() => {
          setIsUserPortalOpen(false);
          setIsPaymentOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <EngandaApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
