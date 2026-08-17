import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  TrendingUp, 
  Zap, 
  Award, 
  Github, 
  ArrowRight, 
  Layers, 
  Coins, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Users,
  Flame,
  FileCode2,
  ChevronRight,
  MousePointerClick
} from 'lucide-react';
import { AbstractLabyrinthLogo, BullHeadIcon } from './Icons';

const LandingPage = ({ onEnterApp, t }) => {
  const tLand = t.landing;

  const GITHUB_REPO_URL = "https://github.com/universal-tech/Labyrinth-Protocol";

  // IntersectionObserver Scroll-Reveal Effect
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll('.scroll-reveal');

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section id="hero" className="relative pt-12 pb-8 px-4 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Glow Backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider animate-fadeIn">
          <span>{tLand.heroTag}</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white font-outfit tracking-tight leading-tight">
            {tLand.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {tLand.heroSubtitle}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto btn-cyan py-4 px-8 text-base font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
          >
            <span>{tLand.enterAppBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto btn-secondary py-4 px-8 text-base font-bold flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            <span>{tLand.viewGithubBtn}</span>
            <ExternalLink className="w-4 h-4 opacity-60" />
          </a>
        </div>

        {/* Live Protocol Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-10">
          <div className="glass-panel p-3.5 sm:p-4 text-center border-blue-500/20 overflow-hidden scroll-reveal scroll-reveal-delay-1">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block truncate">{tLand.statsTvl}</span>
            <span className="text-base sm:text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono block truncate">$94.6M+</span>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 text-center border-indigo-500/20 overflow-hidden scroll-reveal scroll-reveal-delay-2">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block truncate">{tLand.statsVolume}</span>
            <span className="text-base sm:text-2xl lg:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono block truncate">$482.1M+</span>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 text-center border-emerald-500/20 overflow-hidden scroll-reveal scroll-reveal-delay-3">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block truncate">{tLand.statsChains}</span>
            <span className="text-base sm:text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono block truncate">8 Chains</span>
          </div>

          <div className="glass-panel p-3.5 sm:p-4 text-center border-violet-500/20 overflow-hidden scroll-reveal scroll-reveal-delay-4">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block truncate">{tLand.statsProof}</span>
            <span className="text-base sm:text-2xl lg:text-3xl font-black text-violet-600 dark:text-violet-400 mt-1 font-mono block truncate">~2.4 sec</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INNOVATIONS & ARCHITECTURE MECHANICS */}
      {/* ========================================================================= */}
      <section id="innovations" className="max-w-6xl mx-auto px-4 space-y-10 scroll-mt-24 scroll-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Architecture & Innovations
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {tLand.innovationsTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {tLand.innovationsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Innovation 1 */}
          <div className="glass-panel p-6 sm:p-8 space-y-4 hover:border-blue-500/40 transition-all scroll-reveal scroll-reveal-delay-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tLand.feat1Title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tLand.feat1Desc}
            </p>
          </div>

          {/* Innovation 2 */}
          <div className="glass-panel p-6 sm:p-8 space-y-4 hover:border-emerald-500/40 transition-all scroll-reveal scroll-reveal-delay-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tLand.feat2Title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tLand.feat2Desc}
            </p>
          </div>

          {/* Innovation 3 */}
          <div className="glass-panel p-6 sm:p-8 space-y-4 hover:border-cyan-500/40 transition-all scroll-reveal scroll-reveal-delay-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tLand.feat3Title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tLand.feat3Desc}
            </p>
          </div>

          {/* Innovation 4 */}
          <div className="glass-panel p-6 sm:p-8 space-y-4 hover:border-violet-500/40 transition-all scroll-reveal scroll-reveal-delay-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tLand.feat4Title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {tLand.feat4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.5. MINOTORUS ASSISTANT & MULTI-WALLETS SPLIT SHOWCASE */}
      {/* ========================================================================= */}
      <section id="minotorus-showcase" className="max-w-6xl mx-auto px-4 scroll-mt-24 scroll-reveal">
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900/90 to-cyan-950/40 shadow-2xl space-y-8">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <BullHeadIcon className="w-4 h-4 text-cyan-400" />
                <span>Assistant Flottant Exclusif</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Minotorus : Le Guide Automatisé du Labyrinthe
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Minotorus est le gardien mythologique du protocole. Connaissant chaque dédale du Labyrinthe, il guide les utilisateurs étape par étape à travers un schéma déterministe pré-paramétré pour automatiser 100% du parcours de mixage sans friction technique.
              </p>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 via-slate-900 to-blue-600 p-1 shadow-2xl flex items-center justify-center text-cyan-300 border-2 border-cyan-400/60 shrink-0">
              <BullHeadIcon className="w-14 h-14 text-cyan-300 drop-shadow-lg" />
            </div>
          </div>

          {/* Key Minotorus Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
              <div className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" /> Parcours Déterministe 1-Clic
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Questionnaire interactif pas-à-pas : choix de la crypto, palier de dépôt et sélection de la blockchain cible.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
              <div className="text-indigo-400 font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4" /> Confidentialité Omnichain
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mixage direct et transparent sur les 8 blockchains supportées par le protocole en toute discrétion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-2">
              <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" /> Bouton Flottant Permanent
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accessible instantanément en bas à droite dès l'entrée dans l'application avec une interface compacte.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. OPEN SOURCE TRANSPARENCY & GITHUB SECTION */}
      {/* ========================================================================= */}
      <section id="security" className="max-w-6xl mx-auto px-4 scroll-mt-24 scroll-reveal">
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden border-blue-500/30 space-y-8">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Github className="w-3.5 h-3.5" />
                Transparence Open-Source
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {tLand.securityTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tLand.securitySub}
              </p>
            </div>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan py-4 px-8 text-sm font-bold flex items-center gap-3 shrink-0"
            >
              <Github className="w-5 h-5" />
              <span>Voir le Code Source sur GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Code Inspection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <a href={`${GITHUB_REPO_URL}/blob/main/contracts/LabToken.sol`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all font-mono text-xs text-slate-300 space-y-2 block scroll-reveal scroll-reveal-delay-1">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> LabToken.sol
                </span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">ERC-20 (1B Supply, EIP-2612 Permit & Burn Engine)</p>
            </a>

            <a href={`${GITHUB_REPO_URL}/blob/main/contracts/LabyrinthCore.sol`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all font-mono text-xs text-slate-300 space-y-2 block scroll-reveal scroll-reveal-delay-2">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> LabyrinthCore.sol
                </span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">ZK Privacy Pool, Poseidon Hashes & Merkle Trees</p>
            </a>

            <a href={`${GITHUB_REPO_URL}/blob/main/contracts/LabyrinthGovernance.sol`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all font-mono text-xs text-slate-300 space-y-2 block scroll-reveal scroll-reveal-delay-3">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> Governance.sol
                </span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">Real Yield Staking & Revenue Distribution</p>
            </a>

            <a href={`${GITHUB_REPO_URL}/blob/main/contracts/LabyrinthRelayer.sol`} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all font-mono text-xs text-slate-300 space-y-2 block scroll-reveal scroll-reveal-delay-4">
              <div className="flex items-center justify-between text-violet-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> Relayer.sol
                </span>
                <ExternalLink className="w-3 h-3" />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">Decentralized Automated Relayer Registry</p>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TOKENOMICS & COMMUNITY DISTRIBUTION */}
      {/* ========================================================================= */}
      <section id="tokenomics" className="max-w-6xl mx-auto px-4 space-y-10 scroll-mt-24 scroll-reveal">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5" />
            Tokenomics & Allocation
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {tLand.tokTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {tLand.tokSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 space-y-2 border-blue-500/40 scroll-reveal scroll-reveal-delay-1">
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">12.0%</div>
            <h4 className="font-bold text-slate-900 dark:text-white">{tLand.founderAlloc}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">120,000,000 $LAB</p>
          </div>

          <div className="glass-panel p-6 space-y-2 border-indigo-500/40 scroll-reveal scroll-reveal-delay-2">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">10.0%</div>
            <h4 className="font-bold text-slate-900 dark:text-white">{tLand.devAlloc}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">100,000,000 $LAB</p>
          </div>

          <div className="glass-panel p-6 space-y-2 border-violet-500/40 scroll-reveal scroll-reveal-delay-3">
            <div className="text-2xl font-black text-violet-600 dark:text-violet-400 font-mono">53.0%</div>
            <h4 className="font-bold text-slate-900 dark:text-white">{tLand.daoAlloc}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">530,000,000 $LAB</p>
          </div>

          <div className="glass-panel p-6 space-y-2 border-emerald-500/40 scroll-reveal scroll-reveal-delay-4">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">25.0%</div>
            <h4 className="font-bold text-slate-900 dark:text-white">{tLand.miningAlloc}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">250,000,000 $LAB</p>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-blue-500/30 text-xs text-slate-700 dark:text-slate-300 text-center leading-relaxed scroll-reveal">
          {tLand.combinedNotice}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FINAL CTA FOOTER */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 text-center scroll-reveal">
        <div className="glass-panel p-8 sm:p-12 relative overflow-hidden space-y-6 border-blue-500/40 shadow-2xl">
          <AbstractLabyrinthLogo className="w-14 h-14 mx-auto" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {tLand.ctaTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {tLand.ctaSub}
          </p>

          <div className="pt-2">
            <button
              onClick={onEnterApp}
              className="btn-cyan py-4 px-10 text-base font-bold inline-flex items-center gap-3 shadow-xl"
            >
              <span>{tLand.ctaBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
