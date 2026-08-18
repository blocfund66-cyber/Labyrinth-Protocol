import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Shield, 
  ShieldCheck,
  Layers, 
  ArrowRight, 
  Coins, 
  Wallet,
  Copy,
  Lock,
  MousePointerClick,
  Info,
  Check,
  TrendingUp,
  Flame,
  Droplets
} from 'lucide-react';
import { 
  EthIcon, 
  BnbIcon, 
  PolygonIcon, 
  AvaxIcon, 
  ArbitrumIcon, 
  OptimismIcon, 
  BaseIcon, 
  SolanaIcon, 
  BullHeadIcon 
} from './Icons';

// Exact 7 Sovereign Non-Censorable Native Assets
const SUPPORTED_ASSETS = [
  { id: 'ETH', name: 'Ethereum / Base (ETH)', icon: EthIcon, defaultAmounts: [0.1, 0.5, 1.0, 5.0], unit: 'ETH' },
  { id: 'SOL', name: 'Solana (SOL)', icon: SolanaIcon, defaultAmounts: [1, 5, 10, 50], unit: 'SOL' },
  { id: 'BNB', name: 'BNB Smart Chain (BNB)', icon: BnbIcon, defaultAmounts: [0.5, 1.0, 2.0, 5.0], unit: 'BNB' },
  { id: 'ARB', name: 'Arbitrum (ARB)', icon: ArbitrumIcon, defaultAmounts: [100, 500, 1000, 5000], unit: 'ARB' },
  { id: 'OP', name: 'Optimism (OP)', icon: OptimismIcon, defaultAmounts: [50, 200, 500, 1000], unit: 'OP' },
  { id: 'AVAX', name: 'Avalanche (AVAX)', icon: AvaxIcon, defaultAmounts: [5, 10, 25, 50], unit: 'AVAX' },
  { id: 'POL', name: 'Polygon (POL)', icon: PolygonIcon, defaultAmounts: [100, 500, 1000, 2500], unit: 'POL' }
];

// Exact 8 Supported Blockchains matching the platform mixer
const SUPPORTED_CHAINS = [
  { id: 'base', name: 'Base L2 (Mainnet Live)', icon: BaseIcon },
  { id: 'ethereum', name: 'Ethereum L1', icon: EthIcon },
  { id: 'solana', name: 'Solana Network', icon: SolanaIcon },
  { id: 'arbitrum', name: 'Arbitrum One', icon: ArbitrumIcon },
  { id: 'optimism', name: 'Optimism Mainnet', icon: OptimismIcon },
  { id: 'polygon', name: 'Polygon PoS', icon: PolygonIcon },
  { id: 'bnb', name: 'BNB Smart Chain', icon: BnbIcon },
  { id: 'avalanche', name: 'Avalanche C-Chain', icon: AvaxIcon }
];

const STAKING_TIERS = [
  { amount: 1000, label: '1 000 $LAB', apy: '18.4% APY', estReward: '~184 $LAB/an + Dividendes Relayeurs' },
  { amount: 5000, label: '5 000 $LAB', apy: '24.2% APY', estReward: '~1 210 $LAB/an + Dividendes Relayeurs' },
  { amount: 10000, label: '10 000 $LAB', apy: '31.5% APY', estReward: '~3 150 $LAB/an + Dividendes Relayeurs' },
  { amount: 40000, label: '40 000 $LAB (Genesis)', apy: '48.0% APY', estReward: '~19 200 $LAB/an + 80% Frais Relayeurs' }
];

const YIELD_POOLS = [
  { chain: 'Base L2', asset: 'ETH', apy: '14.2% APY', tvl: '$4.2M' },
  { chain: 'Solana', asset: 'SOL', apy: '12.8% APY', tvl: '$2.8M' },
  { chain: 'BNB Chain', asset: 'BNB', apy: '11.5% APY', tvl: '$1.9M' }
];

const MinotorusBot = ({ isDarkMode = true, onTriggerMix = null, onNavigateTab = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('ACTION_SELECT'); // ACTION_SELECT, SELECT_INPUT, SELECT_AMOUNT, SELECT_OUTPUT, INPUT_WALLET, CONFIRM, EXECUTING, COMPLETED, STAKING_SELECT, STAKING_CONFIRM, POOLS_VIEW
  
  // Selected user options for mixing
  const [inputAsset, setInputAsset] = useState(null);
  const [inputAmountNum, setInputAmountNum] = useState(1.0);
  const [inputAmountStr, setInputAmountStr] = useState('');
  const [outputChain, setOutputChain] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState('');
  const [generatedSecretNote, setGeneratedSecretNote] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);

  // Selected option for staking
  const [selectedStakingTier, setSelectedStakingTier] = useState(null);

  const [unreadCount, setUnreadCount] = useState(1);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'minotorus',
      text: "Salutations ! Je suis Minotorus 🐂, le guide financier et de confidentialité du Labyrinthe.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'welcome-2',
      sender: 'minotorus',
      text: "Que souhaitez-vous effectuer aujourd'hui sur le protocole ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, step]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: 'minotorus',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Main Action Choice
  const handleSelectMainAction = (action) => {
    if (action === 'MIXING') {
      addUserMessage("Je souhaite effectuer un Mixage Anonyme ZK.");
      setTimeout(() => {
        addBotMessage("Excellent choix. Quelle cryptomonnaie native souhaitez-vous déposer dans le pool de confidentialité ?");
        setStep('SELECT_INPUT');
      }, 300);
    } else if (action === 'STAKING') {
      addUserMessage("Je souhaite staker des $LAB pour toucher du Real Yield.");
      setTimeout(() => {
        addBotMessage("Parfait ! Le staking de $LAB vous reverse directement 80% des frais de relayeurs perçus sur les 8 blockchains. Quel montant souhaitez-vous staker ?");
        setStep('STAKING_SELECT');
      }, 300);
    } else if (action === 'POOLS') {
      addUserMessage("Je souhaite consulter les Yield Pools de Liquidité.");
      setTimeout(() => {
        addBotMessage("Voici les Yield Pools de confidentialité actuellement actives et leurs rendements annuels (APY) :");
        setStep('POOLS_VIEW');
      }, 300);
    }
  };

  // 1. User picks Input Crypto
  const handleSelectInputAsset = (asset) => {
    setInputAsset(asset);
    addUserMessage(`Je souhaite mixer du ${asset.name}.`);
    setTimeout(() => {
      addBotMessage(`Parfait ! Quel montant de ${asset.id} voulez-vous déposer ?`);
      setStep('SELECT_AMOUNT');
    }, 300);
  };

  // 2. User picks Amount
  const handleSelectAmount = (amountVal, amountLabel) => {
    setInputAmountNum(amountVal);
    setInputAmountStr(amountLabel);
    addUserMessage(`Montant sélectionné : ${amountLabel}`);
    setTimeout(() => {
      addBotMessage(`Très bien. Sur quelle blockchain de destination souhaitez-vous que vos fonds ressortent ?`);
      setStep('SELECT_OUTPUT');
    }, 300);
  };

  // 3. User picks Output Chain
  const handleSelectOutputChain = (chain) => {
    setOutputChain(chain);
    addUserMessage(`Je veux ressortir sur ${chain.name}.`);
    setTimeout(() => {
      addBotMessage(`Veuillez renseigner votre adresse de réception sur le réseau ${chain.name} :`);
      setStep('INPUT_WALLET');
    }, 300);
  };

  // 4. User inputs destination wallet address
  const handleConfirmWallet = (e) => {
    e?.preventDefault();
    if (!recipientWallet.trim() || recipientWallet.length < 8) return;
    addUserMessage(`Adresse : ${recipientWallet.substring(0, 8)}...${recipientWallet.substring(recipientWallet.length - 6)}`);
    setTimeout(() => {
      addBotMessage(`Voici le récapitulatif de votre opération. Vérifiez les informations avant d'exécuter :`);
      setStep('CONFIRM');
    }, 350);
  };

  // 5. User executes the automated mix
  const handleExecuteMix = () => {
    setStep('EXECUTING');
    addUserMessage("Confirmer et exécuter le mixage ZK.");
    setTimeout(() => {
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      const hexSecret = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
      const secretNote = `labyrinth-v1-zk-${hexSecret.substring(0, 16)}-${hexSecret.substring(16, 32)}`;
      setGeneratedSecretNote(secretNote);
      setStep('COMPLETED');
      addBotMessage(`Mixage Zero-Knowledge exécuté avec succès ! Conservez précieusement votre Note Secrète cryptographique.`);
      if (onTriggerMix) {
        onTriggerMix({
          asset: inputAsset?.id,
          amount: inputAmountStr,
          destinationChain: outputChain?.name,
          recipient: recipientWallet,
          note: secretNote
        });
      }
    }, 1400);
  };

  // Staking Flow
  const handleSelectStakingTier = (tier) => {
    setSelectedStakingTier(tier);
    addUserMessage(`Je souhaite staker ${tier.label}.`);
    setTimeout(() => {
      addBotMessage(`Confirmation du Staking : ${tier.label} avec un rendement estimé de ${tier.apy}.`);
      setStep('STAKING_CONFIRM');
    }, 300);
  };

  const handleExecuteStaking = () => {
    setStep('EXECUTING');
    addUserMessage(`Valider le verrouillage de ${selectedStakingTier?.label}.`);
    setTimeout(() => {
      setStep('COMPLETED');
      addBotMessage(`Staking activé avec succès ! Vos récompenses en Real Yield (frais de relayeurs) s'accumulent désormais en direct.`);
    }, 1400);
  };

  // Reset conversation
  const handleReset = () => {
    setStep('ACTION_SELECT');
    setInputAsset(null);
    setInputAmountNum(1.0);
    setInputAmountStr('');
    setOutputChain(null);
    setRecipientWallet('');
    setGeneratedSecretNote('');
    setCopiedNote(false);
    setSelectedStakingTier(null);
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'minotorus',
        text: "Menu principal réinitialisé. Que souhaitez-vous effectuer sur le protocole ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopyNote = () => {
    if (!generatedSecretNote) return;
    navigator.clipboard.writeText(generatedSecretNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* 💬 FLOATING CHAT BOX */}
      {isOpen && (
        <div 
          className={`pointer-events-auto w-[340px] sm:w-[410px] h-[560px] max-h-[84vh] mb-3 rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-fadeIn transition-colors ${
            isDarkMode 
              ? 'bg-slate-950/95 border-cyan-500/40 text-slate-100 shadow-[0_20px_50px_rgba(0,210,255,0.25)]' 
              : 'bg-white/95 border-blue-400/40 text-slate-900 shadow-[0_20px_50px_rgba(37,99,235,0.2)]'
          }`}
        >
          {/* Header */}
          <div className={`p-3.5 border-b flex items-center justify-between transition-colors ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-cyan-500/30' 
              : 'bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-xl p-1 shadow-md flex items-center justify-center border transition-colors ${
                isDarkMode 
                  ? 'bg-gradient-to-tr from-cyan-600 via-blue-900 to-cyan-500 text-cyan-300 border-cyan-400/60' 
                  : 'bg-gradient-to-tr from-blue-500 to-cyan-500 text-white border-blue-400'
              }`}>
                <BullHeadIcon className="w-7 h-7 drop-shadow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className={`font-bold text-sm tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Minotorus
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className={`text-[10px] font-mono ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                  Guide Financier & Confidentialité ZK
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Menu Principal"
                className={`p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 ${
                  isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleChat}
                title="Fermer"
                className={`p-1.5 rounded-lg transition-all ${
                  isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Privacy & Financial Trust Bar */}
          <div className={`px-3 py-1.5 border-b flex items-center justify-between text-[10px] font-mono transition-colors ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <span className="flex items-center gap-1 text-emerald-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Non-Custodial
            </span>
            <span className={`flex items-center gap-1 font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              <Coins className="w-3 h-3" /> 80% Real Yield
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'minotorus' && (
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    isDarkMode ? 'bg-cyan-600/30 border-cyan-500/40 text-cyan-300' : 'bg-blue-100 border-blue-300 text-blue-600'
                  }`}>
                    <BullHeadIcon className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[84%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : isDarkMode 
                        ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[9px] mt-1 text-right opacity-60 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* 🎯 STEP 0: MAIN FINANCIAL ACTION SELECTOR */}
            {step === 'ACTION_SELECT' && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Sélectionnez votre opération financière :
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => handleSelectMainAction('MIXING')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                      isDarkMode 
                        ? 'bg-slate-800/80 hover:bg-cyan-600/20 border-slate-700 hover:border-cyan-500 text-slate-200' 
                        : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="block">Mixage Anonyme ZK</span>
                        <span className="text-[10px] opacity-60 font-normal">7 cryptos natives souveraines</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleSelectMainAction('STAKING')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                      isDarkMode 
                        ? 'bg-slate-800/80 hover:bg-blue-600/20 border-slate-700 hover:border-blue-500 text-slate-200' 
                        : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="block">Staking $LAB (Real Yield)</span>
                        <span className="text-[10px] opacity-60 font-normal">80% des frais de relayeurs redistribués</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </button>

                  <button
                    onClick={() => handleSelectMainAction('POOLS')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                      isDarkMode 
                        ? 'bg-slate-800/80 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500 text-slate-200' 
                        : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="block">Yield Pools Privées</span>
                        <span className="text-[10px] opacity-60 font-normal">Rendement passif et minage d'anonymat</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </div>
            )}

            {/* 🪙 STEP 1: Select 1 of 7 Sovereign Native Assets for Mixing */}
            {step === 'SELECT_INPUT' && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Sélectionnez la cryptomonnaie à déposer :
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {SUPPORTED_ASSETS.map((asset) => {
                    const Icon = asset.icon;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => handleSelectInputAsset(asset)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all text-xs font-semibold ${
                          isDarkMode 
                            ? 'bg-slate-800/80 hover:bg-cyan-600/20 border-slate-700 hover:border-cyan-500 text-slate-200' 
                            : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{asset.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 📊 STEP 2: Interactive Amount Selection Chips */}
            {step === 'SELECT_AMOUNT' && inputAsset && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Choisissez le montant de {inputAsset.id} :
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {inputAsset.defaultAmounts.map((amt) => {
                    const label = `${amt} ${inputAsset.unit}`;
                    return (
                      <button
                        key={amt}
                        onClick={() => handleSelectAmount(amt, label)}
                        className={`p-2 rounded-lg border text-center transition-all text-xs font-bold font-mono ${
                          isDarkMode 
                            ? 'bg-slate-800/80 hover:bg-cyan-600/20 border-slate-700 hover:border-cyan-500 text-cyan-400' 
                            : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-blue-600 shadow-sm'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🔄 STEP 3: Interactive Output Chain Selection */}
            {step === 'SELECT_OUTPUT' && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Choisissez la Blockchain de Sortie :
                </span>
                <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {SUPPORTED_CHAINS.map((chain) => {
                    const Icon = chain.icon;
                    return (
                      <button
                        key={chain.id}
                        onClick={() => handleSelectOutputChain(chain)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all text-xs ${
                          isDarkMode 
                            ? 'bg-slate-800/80 hover:bg-cyan-600/20 border-slate-700 hover:border-cyan-500 text-slate-200' 
                            : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{chain.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 📥 STEP 4: Input Recipient Wallet */}
            {step === 'INPUT_WALLET' && outputChain && (
              <form onSubmit={handleConfirmWallet} className={`p-3 rounded-xl border space-y-2.5 mt-2 ${
                isDarkMode ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-slate-50 border-blue-200'
              }`}>
                <label className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Adresse de Réception ({outputChain.name}) :
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x... ou adresse de réception"
                  value={recipientWallet}
                  onChange={(e) => setRecipientWallet(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-xs font-mono outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-cyan-400' 
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!recipientWallet.trim() || recipientWallet.length < 8}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                >
                  Valider l'Adresse →
                </button>
              </form>
            )}

            {/* ⚡ STEP 5: Final Summary & Execute Mixing */}
            {step === 'CONFIRM' && (
              <div className={`p-3 rounded-xl border space-y-2.5 mt-2 ${
                isDarkMode ? 'bg-cyan-950/30 border-cyan-500/40' : 'bg-blue-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block flex items-center gap-1.5 ${isDarkMode ? 'text-cyan-300' : 'text-blue-800'}`}>
                  <Shield className="w-3.5 h-3.5" />
                  Récapitulatif du Mixage ZK :
                </span>

                <div className={`space-y-1.5 text-[11px] font-mono p-2.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <div className="flex justify-between">
                    <span className="opacity-60">Montant Déposé :</span>
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{inputAmountStr}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Blockchain Cible :</span>
                    <strong className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>{outputChain?.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Destinataire :</span>
                    <strong className="truncate max-w-[140px]">{recipientWallet}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-700/50">
                    <span className="opacity-60">Preuve ZK-SNARK :</span>
                    <span className="text-emerald-500 font-bold">100% Anonyme</span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteMix}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Exécuter le Mixage avec Minotorus</span>
                </button>
              </div>
            )}

            {/* 🥩 STAKING STEP 1: Select Tier */}
            {step === 'STAKING_SELECT' && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Choisissez votre palier de Staking $LAB :
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {STAKING_TIERS.map((tier) => (
                    <button
                      key={tier.amount}
                      onClick={() => handleSelectStakingTier(tier)}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                        isDarkMode 
                          ? 'bg-slate-800/80 hover:bg-blue-600/20 border-slate-700 hover:border-blue-500 text-slate-200' 
                          : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="font-bold">{tier.label}</strong>
                        <span className="text-emerald-500 font-extrabold">{tier.apy}</span>
                      </div>
                      <span className="text-[10px] opacity-60 block mt-0.5">{tier.estReward}</span>
                    </button>
                  ))}
                </div>

                {/* Direct Uniswap Buy Link Helper */}
                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                  <span className="opacity-60">Pas encore de $LAB ?</span>
                  <a
                    href="https://app.uniswap.org/swap?chain=base&outputCurrency=0xA578a06f60a7D2e79817128A88a0E3eCc5bb4c8B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>Acheter sur Uniswap Base</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* 🥩 STAKING STEP 2: Confirm Staking */}
            {step === 'STAKING_CONFIRM' && selectedStakingTier && (
              <div className={`p-3 rounded-xl border space-y-2.5 mt-2 ${
                isDarkMode ? 'bg-blue-950/30 border-blue-500/40' : 'bg-blue-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block flex items-center gap-1.5 ${isDarkMode ? 'text-cyan-300' : 'text-blue-800'}`}>
                  <Coins className="w-3.5 h-3.5" />
                  Récapitulatif de votre Staking :
                </span>

                <div className={`space-y-1.5 text-[11px] font-mono p-2.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <div className="flex justify-between">
                    <span className="opacity-60">Montant Verrouillé :</span>
                    <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedStakingTier.label}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Taux de Rendement :</span>
                    <strong className="text-emerald-500 font-bold">{selectedStakingTier.apy}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-700/50">
                    <span className="opacity-60">Dividendes Relayeurs :</span>
                    <span className="text-cyan-400 font-bold">80% des Frais Omnichain</span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteStaking}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Coins className="w-4 h-4 text-white" />
                  <span>Confirmer le Verrouillage $LAB</span>
                </button>
              </div>
            )}

            {/* 💧 POOLS VIEW */}
            {step === 'POOLS_VIEW' && (
              <div className={`p-2.5 rounded-xl border space-y-2 mt-2 ${
                isDarkMode ? 'bg-slate-900/70 border-cyan-500/20' : 'bg-slate-50 border-blue-200'
              }`}>
                <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Yield Pools de Confidentialité Actives :
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {YIELD_POOLS.map((pool) => (
                    <div
                      key={pool.chain}
                      className={`p-2.5 rounded-xl border text-xs flex justify-between items-center ${
                        isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div>
                        <strong className="block text-slate-200 dark:text-white">{pool.chain} ({pool.asset})</strong>
                        <span className="text-[10px] opacity-60">TVL: {pool.tvl}</span>
                      </div>
                      <span className="text-emerald-500 font-extrabold">{pool.apy}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-2 mt-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                >
                  ← Retour au Menu Principal
                </button>
              </div>
            )}

            {/* ⏳ Executing state */}
            {step === 'EXECUTING' && (
              <div className={`p-4 rounded-xl border text-center space-y-2 ${
                isDarkMode ? 'bg-slate-900 border-cyan-500/30' : 'bg-slate-100 border-blue-200'
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto ${
                  isDarkMode ? 'border-cyan-500' : 'border-blue-600'
                }`}></div>
                <p className={`text-xs font-mono ${isDarkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Traitement cryptographique en cours...
                </p>
              </div>
            )}

            {/* 🎉 Completed Result */}
            {step === 'COMPLETED' && (
              <div className={`p-3 rounded-xl border space-y-2.5 mt-2 ${
                isDarkMode ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Opération Validée avec Succès !</span>
                </div>

                {generatedSecretNote && (
                  <div className={`space-y-1 p-2.5 rounded-lg border ${
                    isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-mono">Votre Note Secrète ZK :</span>
                    <div className={`flex items-center justify-between gap-1 text-[11px] font-mono truncate ${
                      isDarkMode ? 'text-cyan-400' : 'text-blue-600 font-bold'
                    }`}>
                      <span className="truncate">{generatedSecretNote}</span>
                      <button
                        onClick={handleCopyNote}
                        className={`p-1 rounded transition-colors shrink-0 ${
                          isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Copier la note secrète"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {copiedNote && (
                  <span className="text-[10px] text-emerald-500 font-mono block text-center">
                    ✓ Note secrète copiée dans le presse-papier !
                  </span>
                )}

                <button
                  onClick={handleReset}
                  className={`w-full py-2 font-bold text-xs rounded-lg transition-all ${
                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  Effectuer une Autre Opération 🔄
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer status */}
          <div className={`px-3 py-2 border-t flex items-center justify-between text-[10px] font-mono transition-colors ${
            isDarkMode ? 'bg-slate-950 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span>Protocole Labyrinth Core</span>
            <span className={`flex items-center gap-1 ${isDarkMode ? 'text-cyan-400' : 'text-blue-600 font-semibold'}`}>
              <Shield className="w-3 h-3" /> ZK-SNARK Automatisé
            </span>
          </div>
        </div>
      )}

      {/* 🐂 FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={toggleChat}
        className={`pointer-events-auto relative group p-3.5 sm:p-4 rounded-2xl border-2 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${
          isDarkMode
            ? 'bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-cyan-300 border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.4)]'
            : 'bg-gradient-to-tr from-blue-600 via-blue-700 to-cyan-600 text-white border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.35)]'
        }`}
        title="Minotorus — Guide Financier et de Mixage Zero-Knowledge"
        aria-label="Minotorus Bot"
      >
        <div className={`absolute -inset-1 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse ${
          isDarkMode ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400'
        }`}></div>

        <div className="relative flex items-center justify-center">
          <BullHeadIcon className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>

        {!isOpen && unreadCount > 0 && (
          <span className={`minotorus-badge-centered text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-black shadow-[0_0_14px_rgba(0,210,255,0.8)] animate-bounce whitespace-nowrap pointer-events-none ${
            isDarkMode 
              ? 'bg-[#00f0ff] text-black' 
              : 'bg-cyan-400 text-black'
          }`}>
            Minotorus
          </span>
        )}
      </button>

    </div>
  );
};

export default MinotorusBot;
