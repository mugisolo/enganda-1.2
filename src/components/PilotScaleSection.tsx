import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { YouthGroup } from '../types';
import { InteractiveUgandaMap } from './InteractiveUgandaMap';
import {
  MapPin,
  Users,
  Sprout,
  Building,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Map as MapIcon,
} from 'lucide-react';

interface PilotScaleSectionProps {
  onOpenRegisterModal: () => void;
  onOpenPaymentModal: () => void;
}

export const PilotScaleSection: React.FC<PilotScaleSectionProps> = ({
  onOpenRegisterModal,
  onOpenPaymentModal,
}) => {
  const { t, language } = useLanguage();
  const pilotT = t.pilot;
  const roadmap = t.roadmap;

  const [activeView, setActiveView] = useState<'map' | 'directory' | 'roadmap'>('map');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groups, setGroups] = useState<YouthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch groups from API
  useEffect(() => {
    async function fetchGroups() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (divisionFilter !== 'all') params.append('division', divisionFilter);
        if (tradeFilter !== 'all') params.append('trade', tradeFilter);
        if (searchQuery.trim()) params.append('query', searchQuery.trim());

        const res = await fetch(`/api/groups?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setGroups(data.groups || []);
        }
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [divisionFilter, tradeFilter, searchQuery]);

  return (
    <section id="pilot" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              {pilotT.kicker}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {pilotT.title}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {pilotT.description}
            </p>
          </div>

          {/* View Mode Toggle: 3 views (Interactive Map, Directory, Roadmap) */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl border border-slate-300/70 shrink-0 self-start lg:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeView === 'map'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>{pilotT.viewMap || 'Interactive Map'}</span>
            </button>
            <button
              onClick={() => setActiveView('directory')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeView === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pilotT.viewDirectory} ({groups.length || 21})
            </button>
            <button
              onClick={() => setActiveView('roadmap')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeView === 'roadmap'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pilotT.viewRoadmap} (2M Target)
            </button>
          </div>
        </div>

        {/* View 1: Interactive Map Component */}
        {activeView === 'map' && (
          <div className="space-y-6">
            <InteractiveUgandaMap groups={groups} />
          </div>
        )}

        {/* View 2: Group Directory */}
        {activeView === 'directory' && (
          <div>
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'lg' ? 'Noonya ekibiina oba omukulembeze...' : 'Search group, trade, or leader...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Division:</span>
                </div>

                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">{pilotT.filterAll}</option>
                  <option value="Entebbe Division A">Entebbe Division A</option>
                  <option value="Entebbe Division B">Entebbe Division B</option>
                  <option value="Katabi Town Council">Katabi Town Council</option>
                </select>

                <select
                  value={tradeFilter}
                  onChange={(e) => setTradeFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">{pilotT.filterTrade}</option>
                  <option value="Metal Fabrication">Metal & Welding</option>
                  <option value="Boat">Fisherfolk & Boat Building</option>
                  <option value="Logistics">Transport & Boda</option>
                  <option value="Briquette">Eco-Briquettes & Waste</option>
                  <option value="Tailoring">Apparel & Tailoring</option>
                  <option value="Nursery">Seedlings & Agriculture</option>
                  <option value="Digital">Digital & Electronics</option>
                </select>
              </div>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="py-16 text-center text-slate-500 text-sm font-medium">
                {language === 'lg' ? 'Tukyalonda ebibiina by’e Ntebbe...' : 'Loading Entebbe Pilot groups data...'}
              </div>
            ) : groups.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8">
                <p className="text-slate-600 text-sm mb-4">
                  {language === 'lg' ? 'Tewali bibiina bikwatagana n’ebyo by’onoonyezza.' : 'No groups match your current filter parameters.'}
                </p>
                <button
                  onClick={() => {
                    setDivisionFilter('all');
                    setTradeFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => {
                  const isBanked = group.stage === 'Formalized & Banked';
                  const isIncubation = group.stage === 'In Incubation';

                  return (
                    <div
                      key={group.id}
                      className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Clean Unboxed Metadata Header */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-mono text-[11px] text-slate-400">{group.id}</span>
                          <span
                            className={`font-semibold text-xs ${
                              isBanked
                                ? 'text-emerald-700'
                                : isIncubation
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }`}
                          >
                            {group.stage}
                          </span>
                        </div>

                        {/* Group Name */}
                        <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">
                          {group.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{group.location}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{group.division}</span>
                        </div>

                        {/* Trade & Primary Operation */}
                        <div className="text-xs font-medium text-slate-700 bg-slate-50 rounded px-2.5 py-1.5 mb-4 border border-slate-100">
                          {group.trade}
                        </div>

                        {/* Metrics Table / Rows */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-center mb-4">
                          <div>
                            <span className="block font-mono text-base font-bold text-slate-900 tabular-nums">
                              {group.memberCount}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                              Youth
                            </span>
                          </div>
                          <div>
                            <span className="block font-mono text-base font-bold text-slate-900 tabular-nums">
                              {group.womenPercentage}%
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                              Women
                            </span>
                          </div>
                          <div>
                            <span className="block font-mono text-base font-bold text-emerald-700 tabular-nums">
                              {group.treesPlanted}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-slate-400">
                              Trees
                            </span>
                          </div>
                        </div>

                        {/* Banking Status */}
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] text-slate-700 truncate">
                            {group.bankAccount}
                          </span>
                        </div>
                      </div>

                      {/* Footer: Group Leader info */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Lead: {group.leaderName}</span>
                        <span className="font-mono text-[11px]">{group.leaderPhone}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View 3: Roadmap */}
        {activeView === 'roadmap' && (
          <div className="space-y-6">
            <div className="max-w-3xl mb-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
                {roadmap.kicker}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {roadmap.title}
              </h3>
              <p className="text-sm text-slate-600">
                A phased, replicable economic engineering blueprint transitioning youth from the informal sector into the national tax base and commercial banking sector.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {roadmap.phases.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-bold text-emerald-800">{phase.phase}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-amber-800">{phase.status}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      {phase.region}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="flex md:flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Scope</span>
                    <span className="text-base sm:text-lg font-bold text-emerald-800 font-mono">
                      {phase.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Call to Action for Groups */}
        <div className="mt-12 p-8 bg-emerald-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <h4 className="text-xl font-bold mb-2">
              {language === 'lg' ? 'Muli kibiina ky’abavubuka abakola mu Uganda?' : 'Are you an informal youth group in Uganda?'}
            </h4>
            <p className="text-sm text-emerald-100 leading-relaxed">
              {language === 'lg'
                ? 'Mwewandiise mu lukalala lwa Enganda olupya. Tubayamba okufuna ebiwandiiko bya URSB, akawunti mu EcoBank, enkola ya Relworx ku ssimu, n’okusimba emiti n’olukiiko lw’ekibuga.'
                : 'Join the next Enganda incubation cohort. We assist with legal registration, opening an EcoBank commercial group account, Relworx MoMo payment setup, and municipal concession contracts.'}
            </p>
          </div>
          <button
            onClick={onOpenRegisterModal}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {pilotT.viewDirectory ? t.nav.registerGroup : 'Register Your Group'}
          </button>
        </div>

      </div>
    </section>
  );
};
