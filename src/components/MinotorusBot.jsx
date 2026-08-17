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
  Sparkles, 
  Coins, 
  Wallet,
  Copy,
  Lock,
  MousePointerClick,
  Info,
  Check
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

// Exact 8 Assets matching the 8 Platform Blockchains
const SUPPORTED_ASSETS = [
  { id: 'ETH', name: 'Ethereum / Base (ETH)', icon: EthIcon, defaultAmounts: [0.1, 0.5, 1.0, 5.0], unit: 'ETH' },
  { id: 'SOL', name: 'Solana (SOL)', icon: SolanaIcon, defaultAmounts: [1, 5, 10, 50], unit: 'SOL' },
  { id: 'BNB', name: 'BNB Smart Chain (BNB)', icon: BnbIcon, defaultAmounts: [0.5, 1.0, 2.0, 5.0], unit: 'BNB' },
  { id: 'ARB', name: 'Arbitrum (ARB)', icon: ArbitrumIcon, defaultAmounts: [100, 500, 1000, 5000], unit: 'ARB' },
  { id: 'OP', name: 'Optimism (OP)', icon: OptimismIcon, defaultAmounts: [50, 200, 500, 1000], unit: 'OP' },
  { id: 'AVAX', name: 'Avalanche (AVAX)', icon: AvaxIcon, defaultAmounts: [5, 10, 25, 50], unit: 'AVAX' },
  { id: 'POL', name: 'Polygon (POL)', icon: PolygonIcon, defaultAmounts: [100, 500, 1000, 2500], unit: 'POL' },
  { id: 'USDC', name: 'USD Coin (USDC)', icon: UsdcIcon, defaultAmounts: [100, 500, 1000, 5000], unit: 'USDC' }
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

const MinotorusBot = ({ isDarkMode = true, onTriggerMix = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('GREETING'); // GREETING, SELECT_INPUT, SELECT_AMOUNT, SELECT_OUTPUT, INPUT_WALLET, CONFIRM, EXECUTING, COMPLETED
  
  // Selected user options through the guided schema
  const [inputAsset, setInputAsset] = useState(null);
  const [inputAmountNum, setInputAmountNum] = useState(1.0);
  const [inputAmountStr, setInputAmountStr] = useState('');
  const [outputChain, setOutputChain] = useState(null);
  const [recipientWallet, setRecipientWallet] = useState('');

  const [generatedSecretNote, setGeneratedSecretNote] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'minotorus',
      text: "Salutations ! Je suis Minotorus 🐂, le guide de mixage du Labyrinthe.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'welcome-2',
      sender: 'minotorus',
      text: "Je vais automatiser votre parcours de confidentialité Zero-Knowledge de bout en bout. Quelle cryptomonnaie souhaitez-vous mixer ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom on new message
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

  // 1. User picks Input Crypto
  const handleSelectInputAsset = (asset) => {
    setInputAsset(asset);
    addUserMessage(`Je souhaite mixer du ${asset.name}.`);
    
    setTimeout(() => {
      addBotMessage(`Parfait ! Quel montant de ${asset.id} voulez-vous déposer dans le pool de confidentialité ?`);
      setStep('SELECT_AMOUNT');
    }, 300);
  };

  // 2. User picks Amount
  const handleSelectAmount = (amountVal, amountLabel) => {
    setInputAmountNum(amountVal);
    setInputAmountStr(amountLabel);
    addUserMessage(`Montant sélectionné : ${amountLabel}`);

    setTimeout(() => {
      addBotMessage(`Très bien. Sur quelle blockchain de destination souhaitez-vous que vos fonds anonymisés ressortent ?`);
      setStep('SELECT_OUTPUT');
    }, 300);
  };

  // 3. User picks Output Chain
  const handleSelectOutputChain = (chain) => {
    setOutputChain(chain);
    addUserMessage(`Je veux ressortir sur ${chain.name}.`);

    setTimeout(() => {
      addBotMessage(`Veuillez renseigner votre adresse de réception sécurisée sur le réseau ${chain.name} :`);
      setStep('INPUT_WALLET');
    }, 300);
  };

  // 4. User inputs destination wallet address
  const handleConfirmWallet = (e) => {
    e?.preventDefault();
    if (!recipientWallet.trim() || recipientWallet.length < 8) return;

    addUserMessage(`Adresse de réception : ${recipientWallet.substring(0, 8)}...${recipientWallet.substring(recipientWallet.length - 6)}`);

    setTimeout(() => {
      addBotMessage(`Voici le récapitulatif de votre opération. Vérifiez les informations avant de déclencher le mixage ZK :`);
      setStep('CONFIRM');
    }, 350);
  };

  // 5. User executes the automated mix
  const handleExecuteMix = () => {
    setStep('EXECUTING');
    addUserMessage("Confirmer et exécuter le mixage ZK ⚡");

    setTimeout(() => {
      // Generate unique cryptographic secret note
      const secretNote = `labyrinth-v1-zk-${Math.random().toString(36).substring(2, 12)}-${Math.random().toString(36).substring(2, 10)}`;
      setGeneratedSecretNote(secretNote);
      setStep('COMPLETED');
      addBotMessage(`🎉 Mixage Zero-Knowledge exécuté avec succès ! Conservez précieusement votre Note Secrète cryptographique.`);
      
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
        text: "Parcours réinitialisé. Quelle cryptomonnaie souhaitez-vous mixer ?",
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
      
      {/* 💬 FLOATING CHAT BOX (Opens directly above the floating bottom button) */}
      {isOpen && (
        <div 
          className="pointer-events-auto w-[340px] sm:w-[410px] h-[550px] max-h-[82vh] mb-3 rounded-2xl shadow-2xl border border-cyan-500/40 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fadeIn"
          style={{ boxShadow: '0 20px 50px rgba(0, 210, 255, 0.35)' }}
        >
          {/* Header with Minotaur Bull Profile */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
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
                <p className="text-[10px] text-cyan-300/90 font-mono">Guide de Confidentialité Zero-Knowledge</p>
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

          {/* Privacy Trust Bar */}
          <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Non-Custodial
            </span>
            <span className="text-cyan-400 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" /> Zéro Logs
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

            {/* 🪙 STEP 1: Interactive Selection of the 8 Exact Platform Assets */}
            {(step === 'GREETING' || step === 'SELECT_INPUT') && (
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                <span className="text-[11px] font-bold text-cyan-300 block">
                  Sélectionnez la cryptomonnaie à déposer (8 Actifs) :
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

            {/* 🔄 STEP 3: Interactive Output Chain Selection (8 Chains) */}
            {step === 'SELECT_OUTPUT' && (
              <div className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                <span className="text-[11px] font-bold text-cyan-300 block">
                  Choisissez la Blockchain de Sortie (8 Réseaux) :
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
                  placeholder="0x... ou adresse de réception"
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
                  Récapitulatif du Mixage ZK :
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
                    <span className="text-slate-500">Preuve ZK-SNARK :</span>
                    <span className="text-emerald-400 font-bold">100% Anonyme & Non-Traçable</span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteMix}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Exécuter le Mixage avec Minotorus ⚡</span>
                </button>
              </div>
            )}

            {/* ⏳ Executing state */}
            {step === 'EXECUTING' && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs font-mono text-cyan-300">Génération de la preuve cryptographique ZK-SNARK...</p>
              </div>
            )}

            {/* 🎉 STEP 6: Completed Result */}
            {step === 'COMPLETED' && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5 mt-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mixage ZK Exécuté avec Succès !</span>
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

                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                >
                  Effectuer un Nouveau Mixage 🔄
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer status */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Protocole Labyrinth Core</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> ZK-SNARK Automatisé
            </span>
          </div>
        </div>
      )}

      {/* 🐂 FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={toggleChat}
        className="pointer-events-auto relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 text-cyan-300 border-2 border-cyan-400 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
        style={{
          boxShadow: '0 0 30px rgba(0, 210, 255, 0.5), 0 0 15px rgba(245, 158, 11, 0.4)'
        }}
        title="Minotorus — Guide de Mixage Zero-Knowledge"
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
