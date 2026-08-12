import React, { useState, useEffect } from 'react';
import MazeVisualizer from './components/MazeVisualizer';
import LandingPage from './components/LandingPage';
import PrivacyMixer from './components/PrivacyMixer';
import YieldPools from './components/YieldPools';
import TokenomicsDashboard from './components/TokenomicsDashboard';
import DAOGovernance from './components/DAOGovernance';
import ProofOfInnocence from './components/ProofOfInnocence';
import OnboardingModal from './components/OnboardingModal';
import { AbstractLabyrinthLogo } from './components/Icons';
import { translations, detectBrowserLanguage } from './i18n/translations';
import { 
  Lock, 
  TrendingUp, 
  Coins, 
  Award, 
  Wallet, 
  Github, 
  Sun, 
  Moon,
  Sliders,
  Globe,
  ChevronDown,
  BookOpen,
  Layers,
  ShieldCheck,
  Rocket,
  Vote
} from 'lucide-react';

function App() {
  // Landing Page View Persistence: Appears ONLY ONCE on first visit (stored in localStorage)
  const [currentView, setCurrentView] = useState(() => {
    const landingSeen = localStorage.getItem('labyrinth_landing_completed');
    return landingSeen ? 'app' : 'landing';
  });

  const [activeTab, setActiveTab] = useState('mixer'); // 'mixer', 'yield', 'tokenomics', 'dao', 'poi'
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [fullWalletAddress, setFullWalletAddress] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // i18n Language State ('en', 'fr', 'zh', 'ja', 'ru', 'ar')
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('labyrinth_lang');
    return savedLang || detectBrowserLanguage();
  });
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Active translation dictionary
  const t = translations[currentLang] || translations.en;

  // Onboarding Level State ('beginner', 'intermediate', 'advanced')
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState(() => {
    return localStorage.getItem('labyrinth_level') || 'intermediate';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle entering the dApp from the Landing Page
  const handleEnterApp = () => {
    setCurrentView('app');
    localStorage.setItem('labyrinth_landing_completed', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Language Change
  const handleSelectLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('labyrinth_lang', langCode);
    setShowLangMenu(false);
  };

  // Handle Level Selection
  const handleSelectLevel = (levelId) => {
    setExperienceLevel(levelId);
    localStorage.setItem('labyrinth_level', levelId);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('labyrinth_onboarding_completed', 'true');
  };

  // Auto-detect & restore existing MetaMask wallet connection on page load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            const acc = accounts[0];
            setIsConnected(true);
            setFullWalletAddress(acc);
            setWalletAddress(`${acc.substring(0, 6)}...${acc.substring(acc.length - 4)}`);
          }
        })
        .catch(() => {});

      const handleAccountsChanged = (accounts) => {
        if (accounts && accounts.length > 0) {
          const acc = accounts[0];
          setIsConnected(true);
          setFullWalletAddress(acc);
          setWalletAddress(`${acc.substring(0, 6)}...${acc.substring(acc.length - 4)}`);
        } else {
          setIsConnected(false);
          setFullWalletAddress('');
          setWalletAddress('');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const handleConnectSuccess = (acc) => {
    setIsConnected(true);
    setFullWalletAddress(acc);
    setWalletAddress(`${acc.substring(0, 6)}...${acc.substring(acc.length - 4)}`);
  };

  // Handle header wallet button click
  const handleWalletClick = () => {
    // Open WalletModal (runs auto-detection & connect if disconnected, or displays details & disconnect if connected)
    setShowWalletModal(true);
  };

  // Connect Wallet via real Web3 provider extension (MetaMask / Rabby / Brave)
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          const acc = accounts[0];
          setIsConnected(true);
          setFullWalletAddress(acc);
          setWalletAddress(`${acc.substring(0, 6)}...${acc.substring(acc.length - 4)}`);
        }
      } catch (err) {
        if (err.code === 4001) {
          console.warn("User cancelled MetaMask connection request.");
        } else {
          console.error("MetaMask connection error:", err);
        }
      }
    } else {
      alert("Aucun portefeuille Web3 (MetaMask) détecté dans votre navigateur.\n\nVeuillez installer l'extension MetaMask ou utiliser un navigateur Web3 (Brave, MetaMask Mobile).");
    }
  };

  // Disconnect Wallet Session
  const handleDisconnectWallet = () => {
    setIsConnected(false);
    setFullWalletAddress('');
    setWalletAddress('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const GITHUB_REPO_URL = "https://github.com/blocfund66-cyber/Labyrinth-Protocol";

  return (
    <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'bg-[#050814] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} transition-colors duration-300 selection:bg-blue-600 selection:text-white`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Onboarding Welcome Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
        currentLevel={experienceLevel}
        onSelectLevel={handleSelectLevel}
        t={t}
      />

      {/* Interactive Glowing Canvas Background (Visible in Dark mode) */}
      {isDarkMode && <MazeVisualizer />}

      {/* Dynamic Header Navbar - Pushed to Far Left & Far Right to Maximize Space */}
      <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-[#050814]/90 border-blue-500/20' : 'bg-white/95 border-slate-200'} backdrop-blur-xl border-b transition-colors shadow-sm`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LOGO & TITLE (Pushed to Far Left with Generous Spacing) */}
          <div className="flex items-center gap-3.5 cursor-pointer shrink-0 mr-4 lg:mr-12" onClick={() => { if (currentView === 'app') setCurrentView('landing'); }}>
            <AbstractLabyrinthLogo className="w-10 h-10" />
            <div>
              <span className={`font-black text-2xl tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'} font-outfit block leading-none`}>
                LABYRINTH
              </span>
              <span className={`text-[11px] font-medium tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1 block`}>
                Cross-Chain Privacy & Yield Protocol
              </span>
            </div>
          </div>

          {/* DYNAMIC HEADER NAVIGATION BAR (Spacious & Fully Readable Text Labels) */}
          {currentView === 'landing' ? (
            /* ================= LANDING PAGE HEADER NAV ================= */
            <nav className={`hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-500 dark:text-slate-400 hover:text-blue-500"
              >
                <BookOpen className="w-4 h-4" />
                {t.nav.landingHome}
              </button>

              <button
                onClick={() => scrollToSection('innovations')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-500 dark:text-slate-400 hover:text-blue-500"
              >
                <Layers className="w-4 h-4" />
                {t.nav.landingInnovations}
              </button>

              <button
                onClick={() => scrollToSection('security')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-500 dark:text-slate-400 hover:text-blue-500"
              >
                <ShieldCheck className="w-4 h-4" />
                {t.nav.landingSecurity}
              </button>

              <button
                onClick={() => scrollToSection('tokenomics')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-500 dark:text-slate-400 hover:text-blue-500"
              >
                <Coins className="w-4 h-4" />
                {t.nav.landingTokenomics}
              </button>
            </nav>
          ) : (
            /* ================= PROTOCOL dAPP HEADER NAV (ALL 5 TABS WITH CLEAR WRITTEN LABELS) ================= */
            <nav className={`hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setActiveTab('mixer')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'mixer'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{t.nav.mixer}</span>
              </button>

              <button
                onClick={() => setActiveTab('yield')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'yield'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{t.nav.yield}</span>
              </button>

              <button
                onClick={() => setActiveTab('tokenomics')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'tokenomics'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>{t.nav.tokenomics}</span>
              </button>

              {/* GOUVERNANCE & DAO TAB */}
              <button
                onClick={() => setActiveTab('dao')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dao'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Vote className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap font-bold">{t?.nav?.dao || 'Gouvernance & DAO'}</span>
              </button>

              <button
                onClick={() => setActiveTab('poi')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'poi'
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>{t.nav.poi}</span>
              </button>
            </nav>
          )}

          {/* RIGHT ACTION BUTTON (Pushed to Far Right with Symmetric Generous Spacing) */}
          <div className="flex items-center gap-3 shrink-0 ml-4 lg:ml-12">
            {currentView === 'landing' ? (
              <button
                onClick={handleEnterApp}
                className="btn-cyan text-xs py-2.5 px-6 font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Rocket className="w-4 h-4" />
                <span>{t.nav.launchApp}</span>
              </button>
            ) : (
              <button
                onClick={handleWalletClick}
                className={`btn-cyan text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-2 ${
                  isConnected ? 'bg-slate-900 border border-blue-500/40 text-blue-300 hover:bg-slate-800' : ''
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span>{isConnected ? walletAddress : t.nav.connect}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className={`flex xl:hidden overflow-x-auto px-4 py-2.5 border-t gap-2 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
          {currentView === 'landing' ? (
            <>
              <button onClick={() => scrollToSection('hero')} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 shrink-0">
                {t.nav.landingHome}
              </button>
              <button onClick={() => scrollToSection('innovations')} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 shrink-0">
                {t.nav.landingInnovations}
              </button>
              <button onClick={() => scrollToSection('security')} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 shrink-0">
                {t.nav.landingSecurity}
              </button>
              <button onClick={() => scrollToSection('tokenomics')} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 shrink-0">
                {t.nav.landingTokenomics}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('mixer')}
                className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'mixer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                {t.nav.mixer}
              </button>
              <button
                onClick={() => setActiveTab('yield')}
                className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'yield' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                {t.nav.yield}
              </button>
              <button
                onClick={() => setActiveTab('tokenomics')}
                className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'tokenomics' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                {t.nav.tokenomics}
              </button>
              <button
                onClick={() => setActiveTab('dao')}
                className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'dao' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                {t.nav.dao}
              </button>
              <button
                onClick={() => setActiveTab('poi')}
                className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'poi' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
              >
                {t.nav.poi}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main View */}
      <main className="flex-1 z-10 relative">
        {currentView === 'landing' ? (
          <LandingPage onEnterApp={handleEnterApp} t={t} />
        ) : (
          <>
            {activeTab === 'mixer' && <PrivacyMixer experienceLevel={experienceLevel} t={t} />}
            {activeTab === 'yield' && <YieldPools t={t} />}
            {activeTab === 'tokenomics' && <TokenomicsDashboard t={t} />}
            {activeTab === 'dao' && <DAOGovernance isConnected={isConnected} walletAddress={walletAddress} connectWallet={connectWallet} t={t} />}
            {activeTab === 'poi' && <ProofOfInnocence t={t} />}
          </>
        )}
      </main>

      {/* Footer - Clean, Non-Redundant (Single GitHub Code Source Button) */}
      <footer className={`z-10 border-t py-8 mt-12 backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-950/90 border-slate-800/80 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* BOTTOM LEFT: Language Switcher Framed Button */}
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold transition-all shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-900 border-blue-500/30 text-slate-200 hover:bg-slate-800 hover:border-blue-400' 
                    : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{t.flag}</span>
                <span>{t.name} ({t.code})</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Language Selector Popup Menu */}
              {showLangMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-44 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-700 dark:border-slate-800 light:border-slate-300 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  {Object.keys(translations).map((langKey) => {
                    const item = translations[langKey];
                    return (
                      <button
                        key={langKey}
                        onClick={() => handleSelectLanguage(langKey)}
                        className={`w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                          currentLang === langKey
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'text-slate-300 light:text-slate-800 hover:bg-slate-800 light:hover:bg-slate-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <span>{item.name}</span>
                        </span>
                        <span className="text-[10px] opacity-60 uppercase font-mono">{item.code}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="hidden sm:inline font-bold text-slate-900 dark:text-slate-200">Labyrinth Protocol V1</span>
          </div>

          {/* BOTTOM RIGHT: UNIFORM FRAMED BUTTONS (Single Non-Redundant GitHub Button) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {/* 1. Presentation Framed Button */}
            <button
              onClick={() => { setCurrentView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-900 border-blue-500/40 text-blue-400 hover:bg-blue-600/20 hover:border-blue-400' 
                  : 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
              }`}
              title="Voir la Présentation Labyrinth"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.nav.landingHome}</span>
            </button>

            {/* 2. Experience Level Framed Button */}
            <button
              onClick={() => setShowOnboarding(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-900 border-blue-500/40 text-blue-400 hover:bg-blue-600/20 hover:border-blue-400' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
              title="Changer de Niveau d'Expérience"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {t.footer.levelPrefix} {experienceLevel === 'beginner' ? 'Badge Bronze 🥉' : experienceLevel === 'intermediate' ? 'Badge Argent 🥈' : 'Badge Or 🥇'}
              </span>
            </button>

            {/* 3. GitHub Icon-Only Framed Button */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl border font-bold transition-all shadow-sm flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
              title="Code Source & Smart Contracts sur GitHub"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4 text-slate-400 dark:text-slate-300" />
            </a>

            {/* 4. Compact Theme Toggle Icon Button at Page Bottom (Footer) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border font-bold transition-all shadow-sm flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800' 
                  : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Passer en Mode Clair ☀️' : 'Passer en Mode Sombre 🌙'}
              aria-label="Mode Clair / Sombre"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Web3 Connected Wallet Details & Disconnect Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        isConnected={isConnected}
        fullAddress={fullWalletAddress}
        onConnectSuccess={handleConnectSuccess}
        onDisconnect={handleDisconnectWallet}
      />
    </div>
  );
}

export default App;
