import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Globe,
  Sprout,
  PiggyBank,
  Users,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { FAQ_DATA, FAQItem, detectLanguageFromText } from '../data/faqData';

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({
  isOpen,
  onClose,
  language: initialLanguage,
}) => {
  // Modal active view: 'chat' or 'faq'
  const [activeTab, setActiveTab] = useState<'chat' | 'faq'>('chat');

  // Language state with automatic language detection
  const [activeLanguage, setActiveLanguage] = useState<Language>(initialLanguage);
  const [detectedLanguage, setDetectedLanguage] = useState<Language>(initialLanguage);
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // FAQ state
  const [faqCategory, setFaqCategory] = useState<'all' | 'registration' | 'savings' | 'tree-planting'>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('reg-1');

  // Initialize or reset welcome message when language changes
  useEffect(() => {
    setActiveLanguage(initialLanguage);
    setDetectedLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text:
            activeLanguage === 'lg'
              ? 'Oli otya! Nze Enganda Omubeezi—omubeezi wo mu by’enkulaakulana y’abavubuka, okwewandiisa mu URSB, amaterekero mu EcoBank, n’okusimba emiti ku Nnalubaale mu Ntebbe. Nkusobola ntya okukuyamba leero?'
              : 'Welcome! I am Enganda Omubeezi—your direct advisor for youth enterprise formalization, URSB registration, EcoBank zero-minimum group savings, and Entebbe municipal tree-planting initiatives. How can I assist you today?',
          timestamp: 'Just now',
        },
      ]);
    }
  }, [activeLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, loading, activeTab]);

  if (!isOpen) return null;

  // Real-time language detection when user types
  const handleInputChange = (val: string) => {
    setInput(val);
    if (val.trim().length > 4) {
      const detected = detectLanguageFromText(val);
      if (detected !== detectedLanguage) {
        setDetectedLanguage(detected);
        setActiveLanguage(detected);
        setAutoDetectNotice(detected === 'lg' ? 'Lulimi luvumbuddwa: Oluganda' : 'Language detected: English');
        setTimeout(() => setAutoDetectNotice(null), 3500);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    // Detect language of the query before sending
    const detected = detectLanguageFromText(query);
    const targetLang = detected || activeLanguage;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Pass full conversation history for multi-turn context
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        text: m.text,
      }));

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: targetLang,
          conversationHistory: history,
        }),
      });

      if (!res.ok) throw new Error('Advisor request failed');

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text:
          targetLang === 'lg'
            ? 'Tusaba okusonyiyibwa, Enganda Omubeezi aliko obuzibu bw’amasannyalaze oba yintaneeti. Tukusaba okukubira wofiisi yaffe ey’e Ntebbe ku +256 772 109 231.'
            : 'Enganda Omubeezi is temporarily experiencing network latency. You can contact our Entebbe Municipal field team at +256 772 109 231 or visit the Entebbe Division A offices.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Direct transfer from FAQ question into chat
  const handleAskFaqInChat = (faq: FAQItem) => {
    const question = activeLanguage === 'lg' ? faq.questionLg : faq.questionEn;
    const instantAnswer = activeLanguage === 'lg' ? faq.answerLg : faq.answerEn;

    // Add user question and instant authoritative answer into thread
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: `${activeLanguage === 'lg' ? '👉 Eby’amazima ebikwata ku nsonga eno:' : '👉 Verified Institutional Guidance:'}\n\n${instantAnswer}\n\n${
        activeLanguage === 'lg'
          ? 'Wandyagadde okumanya ebisingawo ku nsonga eno oba ku bibiina by’e Ntebbe?'
          : 'Would you like more details or guidance on implementing this for your group in Greater Entebbe?'
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setActiveTab('chat');
  };

  // Filter FAQ items by category and search keyword
  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = faqCategory === 'all' || item.category === faqCategory;
    const qText = activeLanguage === 'lg' ? item.questionLg : item.questionEn;
    const aText = activeLanguage === 'lg' ? item.answerLg : item.answerEn;
    const matchesSearch =
      !faqSearch.trim() ||
      qText.toLowerCase().includes(faqSearch.toLowerCase()) ||
      aText.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(faqSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const samplePromptsEn = [
    'How do we open an EcoBank Group Account for our youth workshop?',
    'What are the requirements to register a SACCO with URSB in Uganda?',
    'How does Relworx *217# collect daily member dues via MTN MoMo?',
    'What tree species are approved for Entebbe shoreline planting?',
  ];

  const samplePromptsLg = [
    'Tuggulawo tutya akawunti mu EcoBank ey’ekibiina ky’abavubuka?',
    'Biki ebyetaagisa okuwandiisa ekibiina mu mateeka ga URSB?',
    'Relworx *217# ekola etya okukung’aanya amaterekero ku Mobile Money?',
    'Miti ki egy’ekinnansi egikkirizibwa okusimba ku Nnalubaale?',
  ];

  const currentSamplePrompts = activeLanguage === 'lg' ? samplePromptsLg : samplePromptsEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full h-[680px] max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-emerald-950 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 border border-emerald-700 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Enganda Omubeezi</h3>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                  Gemini 3.8 Flash
                </span>
                {autoDetectNotice && (
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-medium animate-pulse">
                    {autoDetectNotice}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200">
                {activeLanguage === 'lg'
                  ? 'Omubeezi w’Ebibiina by’Abavubuka, URSB, EcoBank, n’Emiti'
                  : 'AI Advisor for Informal Youth Formalization, EcoBank & Tree Planting'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language auto-detect and manual switcher */}
            <div className="flex items-center p-0.5 bg-emerald-950 rounded-lg border border-emerald-800/80 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setActiveLanguage('en');
                  setDetectedLanguage('en');
                }}
                className={`px-2 py-1 rounded font-semibold transition-all ${
                  activeLanguage === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveLanguage('lg');
                  setDetectedLanguage('lg');
                }}
                className={`px-2 py-1 rounded font-semibold transition-all ${
                  activeLanguage === 'lg'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Kyusa okudda mu Luganda"
              >
                LG
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors"
              aria-label="Close advisor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>{activeLanguage === 'lg' ? 'Omubeezi AI (Live Chat)' : 'Omubeezi AI (Live Chat)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'border-emerald-800 text-emerald-900 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{activeLanguage === 'lg' ? 'Ebibuuzo Ebitera Okubuuzibwa (Instant FAQ)' : 'Instant Knowledge Base (FAQ)'}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.2 rounded-full font-bold">
                {FAQ_DATA.length}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Globe className="w-3 h-3 text-emerald-600" />
            <span>
              {activeLanguage === 'lg' ? 'Lulimi: Luganda (Auto-Detect Active)' : 'Language: English (Auto-Detect Active)'}
            </span>
          </div>
        </div>

        {/* VIEW 1: LIVE CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Fast FAQ preview ribbon inside chat for quick access */}
            <div className="px-4 py-2 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-900 font-medium truncate">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">
                  {activeLanguage === 'lg'
                    ? 'Ebibuuzo ku kwewandiisa, amaterekero, n’okusimba emiti:'
                    : 'Common questions on registration, savings & tree planting:'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className="text-emerald-800 font-bold hover:underline shrink-0 text-[11px] flex items-center gap-1"
              >
                <span>{activeLanguage === 'lg' ? 'Laba Ebibuuzo Byonna' : 'View All Instant FAQs'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                    <span
                      className={`block text-[10px] mt-1.5 ${
                        msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-600">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>
                      {activeLanguage === 'lg'
                        ? 'Enganda Omubeezi aliko anoonya amagezi amatuufu...'
                        : 'Enganda Omubeezi is formulating verified advice...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Sample Prompts (when only welcome or short thread) */}
            {messages.length <= 2 && (
              <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex gap-2 shrink-0">
                {currentSamplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(p)}
                    className="text-[11px] bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 hover:border-emerald-300 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar with real-time language detection */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={
                  activeLanguage === 'lg'
                    ? 'Baza ekibuuzo kyo mu Luganda oba Olungereza (e.g. URSB, EcoBank, emiti)...'
                    : 'Ask about group registration, EcoBank savings, or tree planting...'
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>{activeLanguage === 'lg' ? 'Sindiika' : 'Send'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: INSTANT FAQ KNOWLEDGE BASE */}
        {activeTab === 'faq' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            {/* Search and Category Filter Toolbar */}
            <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder={
                    activeLanguage === 'lg'
                      ? 'Noonya ebibuuzo ku kwewandiisa, amaterekero, ssemateeka, emiti...'
                      : 'Search common questions on registration, EcoBank, savings, trees...'
                  }
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-800"
                />
                {faqSearch && (
                  <button
                    onClick={() => setFaqSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFaqCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    faqCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {activeLanguage === 'lg' ? 'Ebibuuzo Byonna' : 'All Categories'}
                </button>

                <button
                  type="button"
                  onClick={() => setFaqCategory('registration')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    faqCategory === 'registration'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{activeLanguage === 'lg' ? '1. Okwewandiisa (Registration)' : '1. Group Registration'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFaqCategory('savings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    faqCategory === 'savings'
                      ? 'bg-amber-800 text-white'
                      : 'bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
                  }`}
                >
                  <PiggyBank className="w-3.5 h-3.5" />
                  <span>{activeLanguage === 'lg' ? '2. Amaterekero (Savings & EcoBank)' : '2. Savings & EcoBank'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFaqCategory('tree-planting')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    faqCategory === 'tree-planting'
                      ? 'bg-teal-800 text-white'
                      : 'bg-teal-50 text-teal-900 border border-teal-200/60 hover:bg-teal-100'
                  }`}
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>{activeLanguage === 'lg' ? '3. Okusimba Emiti (Tree Planting)' : '3. Tree Planting'}</span>
                </button>
              </div>
            </div>

            {/* Accordion Questions List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium">
                    {activeLanguage === 'lg'
                      ? 'Tewali bibuuzo bikkiriziganya na by’onoonyezza.'
                      : 'No questions matched your search query.'}
                  </p>
                  <button
                    onClick={() => {
                      setFaqSearch('');
                      setFaqCategory('all');
                    }}
                    className="text-emerald-700 underline text-xs mt-2"
                  >
                    {activeLanguage === 'lg' ? 'Laba ebibuuzo byonna' : 'Reset filters'}
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  const question = activeLanguage === 'lg' ? faq.questionLg : faq.questionEn;
                  const answer = activeLanguage === 'lg' ? faq.answerLg : faq.answerEn;

                  return (
                    <div
                      key={faq.id}
                      className={`bg-white rounded-xl border transition-all ${
                        isExpanded
                          ? 'border-emerald-700 shadow-sm ring-1 ring-emerald-700/20'
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-4 text-left flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 shrink-0">
                            {faq.category === 'registration' && (
                              <Users className="w-4 h-4 text-emerald-700" />
                            )}
                            {faq.category === 'savings' && (
                              <PiggyBank className="w-4 h-4 text-amber-600" />
                            )}
                            {faq.category === 'tree-planting' && (
                              <Sprout className="w-4 h-4 text-teal-600" />
                            )}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block leading-snug">
                              {question}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">
                              {faq.category.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <span className="text-slate-400 p-0.5 rounded hover:bg-slate-100 shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs text-slate-700 space-y-3.5">
                          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 leading-relaxed whitespace-pre-line text-slate-800">
                            {answer}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex gap-1.5 flex-wrap">
                              {faq.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAskFaqInChat(faq)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0"
                            >
                              <span>{activeLanguage === 'lg' ? 'Baza Omubeezi mu Chat' : 'Discuss in Live Chat'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Callout */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {activeLanguage === 'lg'
                    ? 'Eby’amazima bikakasiddwa URSB, EcoBank ne Municipal Council'
                    : 'Verified by URSB, EcoBank Uganda & Entebbe Municipal Council'}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {activeLanguage === 'lg' ? 'Kola Chat ne Gemini' : 'Chat with Gemini Advisor'} &rarr;
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
