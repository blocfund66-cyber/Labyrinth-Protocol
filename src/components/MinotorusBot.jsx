import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  Shield, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  Wallet,
  Copy,
  Plus,
  Trash2,
  Users,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Lock,
  ArrowDownRight,
  TrendingUp,
  History,
  Clock,
  Key,
  MousePointerClick
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
  UsdcIcon,
  BullHeadIcon 
} from './Icons';

const SUPPORTED_ASSETS = [
  { id: 'ETH', name: 'Ethereum (ETH)', icon: EthIcon, defaultAmounts: [0.1, 1.0, 5.0, 10.0], unit: 'ETH' },
  { id: 'USDC', name: 'USD Coin (USDC)', icon: UsdcIcon, defaultAmounts: [100, 500, 1000, 5000], unit: 'USDC' },
  { id: 'SOL', name: 'Solana (SOL)', icon: SolanaIcon, defaultAmounts: [1, 5, 10, 50], unit: 'SOL' },
  { id: 'BNB', name: 'BNB Chain (BNB)', icon: BnbIcon, defaultAmounts: [0.5, 2.0, 5.0, 10.0], unit: 'BNB' },
  { id: 'AVAX', name: 'Avalanche (AVAX)', icon: AvaxIcon, defaultAmounts: [10, 50, 100], unit: 'AVAX' },
  { id: 'MATIC', name: 'Polygon (POL)', icon: PolygonIcon, defaultAmounts: [100, 500, 1000], unit: 'POL' }
];

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

const FOUNDER_WALLET_ADDRESS = "0xb5F2af7560138b6296dDeBE883988d4059Fee96E";

const INITIAL_LEDGER_TRANSACTIONS = [
  { id: 'TX-9481', time: 'Il y a 12 min', asset: 'ETH', amount: '1.0 ETH', feeTotal: '0.005 ETH', founderShare: '0.001 ETH', stakingShare: '0.004 ETH', chain: 'Base L2', status: 'Exécuté' },
  { id: 'TX-9480', time: 'Il y a 34 min', asset: 'USDC', amount: '2,500 USDC', feeTotal: '12.5 USDC', founderShare: '2.5 USDC', stakingShare: '10.0 USDC', chain: 'Arbitrum', status: 'Exécuté' },
  { id: 'TX-9479', time: 'Il y a 1h 05m', asset: 'ETH', amount: '5.0 ETH', feeTotal: '0.025 ETH', founderShare: '0.005 ETH', stakingShare: '0.020 ETH', chain: 'Ethereum', status: 'Exécuté' },
  { id: 'TX-9478', time: 'Il y a 2h 18m', asset: 'SOL', amount: '20 SOL', feeTotal: '0.10 SOL', founderShare: '0.02 SOL', stakingShare: '0.08 SOL', chain: 'Solana', status: 'Exécuté' }
];

const MinotorusBot = ({ isDarkMode = true, onTriggerMix = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('assistant'); // 'assistant' (Chat Mixage) or 'ledger' (Grand Registre & Trésorerie)
  const [step, setStep] = useState('GREETING'); // GREETING, SELECT_INPUT, SELECT_AMOUNT, SELECT_OUTPUT, INPUT_WALLET, CONFIRM, EXECUTING, COMPLETED
  
  // Selected user options through the guided schema
  const [inputAsset, setInputAsset] = useState(null);
  const [inputAmountNum, setInputAmountNum] = useState(1.0);
  const [inputAmountStr, setInputAmountStr] = useState('');
  const [outputChain, setOutputChain] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState('');
  
  // Grand Registre & Trésorerie State
  const [ledgerTransactions, setLedgerTransactions] = useState(INITIAL_LEDGER_TRANSACTIONS);
  const [founderAccumulatedEth, setFounderAccumulatedEth] = useState(2.84);
  const [founderAccumulatedUsdc, setFounderAccumulatedUsdc] = useState(4850);
  const [stakingAccumulatedEth, setStakingAccumulatedEth] = useState(11.36);
  const [stakingAccumulatedUsdc, setStakingAccumulatedUsdc] = useState(19400);

  // Precautionary withdrawal planner state
  const [withdrawPercent, setWithdrawPercent] = useState(25);
  const [withdrawalDelay, setWithdrawalDelay] = useState('staggered_24h');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');

  const [generatedSecretNote, setGeneratedSecretNote] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'minotorus',
      text: "Salutations ! Je suis Minotorus 🐂, le gardien du Labyrinthe. Je connais chaque détour et dédale du protocole.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'welcome-2',
      sender: 'minotorus',
      text: "Je vais automatiser votre parcours de mixage et enregistrer les opérations dans le grand registre. Quelle cryptomonnaie souhaitez-vous mixer aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    if (isOpen && activeView === 'assistant') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, step, activeView]);

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

  // 1. User picks Input Crypto
  const handleSelectInputAsset = (asset) => {
    setInputAsset(asset);
    addUserMessage(`Je souhaite mixer du ${asset.name}.`);
    
    setTimeout(() => {
      addBotMessage(`Parfait ! Quel montant de ${asset.id} voulez-vous déposer dans le pool de confidentialité ?`);
      setStep('SELECT_AMOUNT');
    }, 350);
  };

  // 2. User picks Amount
  const handleSelectAmount = (amountVal, amountLabel) => {
    setInputAmountNum(amountVal);
    setInputAmountStr(amountLabel);
    addUserMessage(`Montant sélectionné : ${amountLabel}`);

    setTimeout(() => {
      addBotMessage(`Très bien. Sur quelle blockchain de destination souhaitez-vous que vos fonds anonymisés ressortent ?`);
      setStep('SELECT_OUTPUT');
    }, 350);
  };

  // 3. User picks Output Chain
  const handleSelectOutputChain = (chain) => {
    setOutputChain(chain);
    addUserMessage(`Je veux ressortir sur ${chain.name}.`);

    setTimeout(() => {
      addBotMessage(`Entrez l'adresse de réception sécurisée sur le réseau ${chain.name} :`);
      setStep('INPUT_WALLET');
    }, 350);
  };

  // 4. User inputs destination wallet address
  const handleConfirmWallet = (e) => {
    e?.preventDefault();
    if (!recipientWallet.trim() || recipientWallet.length < 8) return;

    addUserMessage(`Adresse de destination : ${recipientWallet.substring(0, 8)}...${recipientWallet.substring(recipientWallet.length - 6)}`);

    setTimeout(() => {
      addBotMessage(`Voici le récapitulatif complet de votre opération. Minotorus va orchestrer le mixage et l'inscrire dans le grand registre On-Chain :`);
      setStep('CONFIRM');
    }, 400);
  };

  // 5. User executes the automated mix
  const handleExecuteMix = () => {
    setStep('EXECUTING');
    addUserMessage("Confirmer et exécuter le mixage ZK maintenant ⚡");

    setTimeout(() => {
      // Generate unique cryptographic secret note
      const secretNote = `labyrinth-v1-zk-${Math.random().toString(36).substring(2, 12)}-${Math.random().toString(36).substring(2, 10)}`;
      setGeneratedSecretNote(secretNote);
      setStep('COMPLETED');
      addBotMessage(`🎉 Opération de mixage ZK réussie ! Votre note secrète a été générée et inscrite au registre.`);

      // Append to the Grand Registre Ledger
      const newTxId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
      const feeCalculated = (inputAmountNum * 0.005).toFixed(4);
      const founderShareVal = (inputAmountNum * 0.005 * 0.20).toFixed(4);
      const stakingShareVal = (inputAmountNum * 0.005 * 0.80).toFixed(4);

      setLedgerTransactions(prev => [
        {
          id: newTxId,
          time: "À l'instant",
          asset: inputAsset?.id || 'ETH',
          amount: inputAmountStr,
          feeTotal: `${feeCalculated} ${inputAsset?.unit}`,
          founderShare: `${founderShareVal} ${inputAsset?.unit}`,
          stakingShare: `${stakingShareVal} ${inputAsset?.unit}`,
          chain: outputChain?.name || 'Base L2',
          status: 'Inscrit au Registre'
        },
        ...prev
      ]);

      if (inputAsset?.id === 'ETH') {
        setFounderAccumulatedEth(prev => +(prev + parseFloat(founderShareVal)).toFixed(4));
        setStakingAccumulatedEth(prev => +(prev + parseFloat(stakingShareVal)).toFixed(4));
      } else if (inputAsset?.id === 'USDC') {
        setFounderAccumulatedUsdc(prev => +(prev + parseFloat(founderShareVal)).toFixed(2));
        setStakingAccumulatedUsdc(prev => +(prev + parseFloat(stakingShareVal)).toFixed(2));
      }
      
      if (onTriggerMix) {
        onTriggerMix({
          asset: inputAsset?.id,
          amount: inputAmountStr,
          destinationChain: outputChain?.name,
          recipient: recipientWallet,
          note: secretNote
        });
      }
    }, 1500);
  };

  // Precautionary Withdrawal Execution
  const handleExecutePrecautionaryWithdrawal = (e) => {
    e.preventDefault();
    if (!withdrawDestination.trim() || withdrawDestination.length < 10) return;

    const amountEthToWithdraw = ((founderAccumulatedEth * withdrawPercent) / 100).toFixed(3);
    const amountUsdcToWithdraw = ((founderAccumulatedUsdc * withdrawPercent) / 100).toFixed(0);

    setWithdrawSuccessMsg(`✓ Retrait précautionneux de ${amountEthToWithdraw} ETH (${withdrawPercent}%) programmé avec succès vers ${withdrawDestination.substring(0, 8)}... (${withdrawalDelay === 'staggered_24h' ? 'Échelonné sur 24h' : 'Immédiat'}).`);
    
    setTimeout(() => {
      setWithdrawSuccessMsg('');
      setWithdrawDestination('');
    }, 6000);
  };

  // Reset conversation to initial state
  const handleReset = () => {
    setStep('GREETING');
    setInputAsset(null);
    setInputAmountNum(1.0);
    setInputAmountStr('');
    setOutputChain(null);
    setRecipientWallet('');
    setGeneratedSecretNote('');
    setCopiedNote(false);
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'minotorus',
        text: "Parcours réinitialisé ! Que souhaitez-vous mixer aujourd'hui ?",
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* 💬 FLOATING CHAT & REGISTRE BOX (Opens directly above the floating bottom button) */}
      {isOpen && (
        <div 
          className="w-[340px] sm:w-[420px] h-[570px] max-h-[85vh] mb-3 rounded-2xl shadow-2xl border border-cyan-500/40 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fadeIn"
          style={{ boxShadow: '0 20px 50px rgba(0, 210, 255, 0.35)' }}
        >
          {/* Header with Minotaur Bull Profile */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-slate-900 to-amber-500 p-1 shadow-md flex items-center justify-center text-cyan-300 border border-cyan-400/60">
                <BullHeadIcon className="w-7 h-7 text-cyan-300 drop-shadow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-wide">
                    Minotorus
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-cyan-300/90 font-mono">Gardien & Registre du Labyrinthe</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Recommencer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleChat}
                title="Fermer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation View Switcher (Assistant vs Grand Registre) */}
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveView('assistant')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'assistant'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Mixage Guidé</span>
            </button>

            <button
              onClick={() => setActiveView('ledger')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeView === 'ledger'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Grand Registre (Trésorerie)</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: ASSISTANT DE MIXAGE CONVERSATIONNEL */}
          {/* ========================================================================= */}
          {activeView === 'assistant' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'minotorus' && (
                    <div className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300 mt-0.5">
                      <BullHeadIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] p-3 rounded-2xl leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[9px] mt-1 text-right opacity-60 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* 🪙 STEP 1: Interactive Asset Selection Chips */}
              {(step === 'GREETING' || step === 'SELECT_INPUT') && (
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-cyan-300 block">
                    Sélectionnez la cryptomonnaie à déposer :
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SUPPORTED_ASSETS.map((asset) => {
                      const Icon = asset.icon;
                      return (
                        <button
                          key={asset.id}
                          onClick={() => handleSelectInputAsset(asset)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500 text-left transition-all text-xs text-slate-200 font-semibold"
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
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-cyan-300 block">
                    Choisissez le montant de {inputAsset.id} :
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {inputAsset.defaultAmounts.map((amt) => {
                      const label = `${amt} ${inputAsset.unit}`;
                      return (
                        <button
                          key={amt}
                          onClick={() => handleSelectAmount(amt, label)}
                          className="p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500 text-center transition-all text-xs text-cyan-400 font-bold font-mono"
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
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                  <span className="text-[11px] font-bold text-cyan-300 block">
                    Choisissez la Blockchain de Sortie :
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {SUPPORTED_CHAINS.map((chain) => {
                      const Icon = chain.icon;
                      return (
                        <button
                          key={chain.id}
                          onClick={() => handleSelectOutputChain(chain)}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500 text-left transition-all text-xs text-slate-200"
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
                <form onSubmit={handleConfirmWallet} className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2.5 mt-2">
                  <label className="text-[11px] font-bold text-cyan-300 block">
                    Adresse de Réception ({outputChain.name}) :
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x... ou adresse réseau"
                    value={recipientWallet}
                    onChange={(e) => setRecipientWallet(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!recipientWallet.trim() || recipientWallet.length < 8}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg transition-all disabled:opacity-50"
                  >
                    Valider l'Adresse →
                  </button>
                </form>
              )}

              {/* ⚡ STEP 5: Final Summary & Execute */}
              {step === 'CONFIRM' && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2.5 mt-2">
                  <span className="text-[11px] font-bold text-cyan-300 block flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Récapitulatif de Mixage ZK :
                  </span>

                  <div className="space-y-1.5 text-[11px] font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Montant Déposé :</span>
                      <strong className="text-white font-bold">{inputAmountStr}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Blockchain Cible :</span>
                      <strong className="text-cyan-400">{outputChain?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Destinataire :</span>
                      <strong className="text-amber-400 truncate max-w-[140px]">{recipientWallet}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-500">Inscription Registre :</span>
                      <span className="text-emerald-400 font-bold">Trésorerie & 20% Répartition</span>
                    </div>
                  </div>

                  <button
                    onClick={handleExecuteMix}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Déclencher le Mixage avec Minotorus ⚡</span>
                  </button>
                </div>
              )}

              {/* ⏳ Executing state */}
              {step === 'EXECUTING' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
                  <p className="text-xs font-mono text-cyan-300">Génération de la preuve ZK-SNARK & inscription au registre...</p>
                </div>
              )}

              {/* 🎉 STEP 6: Completed Result */}
              {step === 'COMPLETED' && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5 mt-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mixage Exécuté & Enregistré dans le Registre !</span>
                  </div>

                  <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Votre Note Secrète ZK :</span>
                    <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-amber-400 truncate">
                      <span className="truncate">{generatedSecretNote}</span>
                      <button
                        onClick={handleCopyNote}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                        title="Copier la note secrète"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {copiedNote && (
                    <span className="text-[10px] text-emerald-400 font-mono block text-center">
                      ✓ Note secrète copiée dans le presse-papier !
                    </span>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleReset}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Nouveau Mixage 🔄
                    </button>
                    <button
                      onClick={() => setActiveView('ledger')}
                      className="w-full py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Voir le Registre</span>
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: GRAND REGISTRE & GESTIONNAIRE DE TRÉSORERIE ON-CHAIN */}
          {/* ========================================================================= */}
          {activeView === 'ledger' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
              
              {/* Central Treasury Card */}
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Portefeuille Unique de Trésorerie :</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">Actif On-Chain</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 flex items-center justify-between">
                  <span className="truncate">{FOUNDER_WALLET_ADDRESS}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(FOUNDER_WALLET_ADDRESS)}
                    className="p-1 text-slate-400 hover:text-amber-400"
                    title="Copier le wallet"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Real-time Revenue Partitioning (20% Founder vs 80% Staking) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 block">👑 Part Fondateur (20%)</span>
                  <div className="text-sm font-black text-white font-mono">{founderAccumulatedEth.toFixed(3)} ETH</div>
                  <span className="text-[10px] text-slate-400 font-mono">+ {founderAccumulatedUsdc.toLocaleString()} USDC</span>
                </div>

                <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 block">🌾 Real Yield Staking (80%)</span>
                  <div className="text-sm font-black text-white font-mono">{stakingAccumulatedEth.toFixed(2)} ETH</div>
                  <span className="text-[10px] text-slate-400 font-mono">+ {stakingAccumulatedUsdc.toLocaleString()} USDC</span>
                </div>
              </div>

              {/* Precautionary Staggered Withdrawal Module */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Retrait Précautionneux de vos Fonds :</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Tranches sécurisées</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Permet de retirer votre part accumulée sans perturber la liquidité ni attirer l'attention des traceurs On-Chain.
                </p>

                <form onSubmit={handleExecutePrecautionaryWithdrawal} className="space-y-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    {[25, 50, 100].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setWithdrawPercent(pct)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold font-mono transition-all ${
                          withdrawPercent === pct
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWithdrawalDelay('staggered_24h')}
                      className={`p-1.5 rounded text-[10px] font-bold border transition-all text-center ${
                        withdrawalDelay === 'staggered_24h'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Échelonné (24h) 🛡️
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithdrawalDelay('instant')}
                      className={`p-1.5 rounded text-[10px] font-bold border transition-all text-center ${
                        withdrawalDelay === 'instant'
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Immédiat ⚡
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Adresse Cold Wallet de destination"
                    value={withdrawDestination}
                    onChange={(e) => setWithdrawDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono outline-none focus:border-amber-400"
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow transition-all"
                  >
                    Programmer le Retrait Précautionneux ({((founderAccumulatedEth * withdrawPercent) / 100).toFixed(3)} ETH) →
                  </button>
                </form>

                {withdrawSuccessMsg && (
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                    {withdrawSuccessMsg}
                  </div>
                )}
              </div>

              {/* Transaction Ledger Table */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Grand Livre des Transactions Minotorus :</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">({ledgerTransactions.length} logs)</span>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {ledgerTransactions.map((tx) => (
                    <div key={tx.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1 font-mono text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400">{tx.id} • {tx.amount}</span>
                        <span className="text-slate-500">{tx.time}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Frais: {tx.feeTotal} ({tx.chain})</span>
                        <span className="text-amber-400 font-bold">20% = {tx.founderShare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Footer status */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Protocole Labyrinth Core</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Registre Automatisé
            </span>
          </div>
        </div>
      )}

      {/* 🐂 FLOATING ACTION BUTTON (FAB) WITH AUTHENTIC BADASS BULL HEAD ICON */}
      <button
        onClick={toggleChat}
        className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-cyan-300 border-2 border-cyan-400 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
        style={{
          boxShadow: '0 0 30px rgba(0, 210, 255, 0.5), 0 0 15px rgba(245, 158, 11, 0.4)'
        }}
        title="Minotorus — Guide & Grand Registre de Trésorerie"
        aria-label="Minotorus Bot"
      >
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-amber-500 to-cyan-400 blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>

        <div className="relative flex items-center justify-center">
          <BullHeadIcon className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300 group-hover:text-amber-400 transition-colors" />
        </div>

        {/* Unread Message Pill Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-slate-950 shadow-md animate-bounce">
            Minotorus
          </span>
        )}
      </button>

    </div>
  );
};

export default MinotorusBot;
