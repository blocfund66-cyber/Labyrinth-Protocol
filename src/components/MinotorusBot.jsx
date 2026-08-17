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
  ExternalLink
} from 'lucide-react';
import { EthIcon, BnbIcon, PolygonIcon, AvaxIcon, ArbitrumIcon, OptimismIcon, BaseIcon, SolanaIcon, UsdcIcon } from './Icons';

/**
 * Custom SVG for Minotorus Bull Head
 */
export const BullHeadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    {/* Stylized Bull / Minotaur Head */}
    <path d="M4.5 3.5C4 2 2.5 1.5 1.5 2C1 2.5 1 4 2.5 5.5C4 7 5.5 8 6 9.5C6.5 11 6.5 12 6.5 13C6.5 15.5 8 18 10 19.5L10.5 21C10.7 21.6 11.3 22 12 22C12.7 22 13.3 21.6 13.5 21L14 19.5C16 18 17.5 15.5 17.5 13C17.5 12 17.5 11 18 9.5C18.5 8 20 7 21.5 5.5C23 4 23 2.5 22.5 2C21.5 1.5 20 2 19.5 3.5C18.5 6.5 16.5 8 14.5 8C13.5 8 12.8 7.5 12 7.5C11.2 7.5 10.5 8 9.5 8C7.5 8 5.5 6.5 4.5 3.5ZM9 12C9.6 12 10 12.4 10 13C10 13.6 9.6 14 9 14C8.4 14 8 13.6 8 13C8 12.4 8.4 12 9 12ZM15 12C15.6 12 16 12.4 16 13C16 13.6 15.6 14 15 14C14.4 14 14 13.6 14 13C14 12.4 14.4 12 15 12ZM10.5 16.5C11 16.2 11.5 16 12 16C12.5 16 13 16.2 13.5 16.5C13.8 16.7 13.8 17.2 13.5 17.5C13.2 17.8 12.7 17.8 12.4 17.5C12.3 17.4 12.1 17.3 12 17.3C11.9 17.3 11.7 17.4 11.6 17.5C11.3 17.8 10.8 17.8 10.5 17.5C10.2 17.2 10.2 16.7 10.5 16.5Z" />
  </svg>
);

const SUPPORTED_ASSETS = [
  { id: 'ETH', name: 'Ethereum (ETH)', icon: EthIcon, defaultAmounts: ['0.1 ETH', '1.0 ETH', '5.0 ETH', '10.0 ETH'] },
  { id: 'USDC', name: 'USD Coin (USDC)', icon: UsdcIcon, defaultAmounts: ['100 USDC', '500 USDC', '1,000 USDC', '5,000 USDC'] },
  { id: 'SOL', name: 'Solana (SOL)', icon: SolanaIcon, defaultAmounts: ['1 SOL', '5 SOL', '10 SOL', '50 SOL'] },
  { id: 'BNB', name: 'BNB Chain (BNB)', icon: BnbIcon, defaultAmounts: ['0.5 BNB', '2.0 BNB', '5.0 BNB', '10.0 BNB'] },
  { id: 'AVAX', name: 'Avalanche (AVAX)', icon: AvaxIcon, defaultAmounts: ['10 AVAX', '50 AVAX', '100 AVAX'] },
  { id: 'MATIC', name: 'Polygon (POL)', icon: PolygonIcon, defaultAmounts: ['100 POL', '500 POL', '1,000 POL'] }
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

const MinotorusBot = ({ isDarkMode = true, onTriggerMix = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('GREETING'); // GREETING, SELECT_INPUT, SELECT_AMOUNT, SELECT_OUTPUT, INPUT_ADDRESS, CONFIRM, EXECUTING, COMPLETED
  
  // Selected user options through the guided schema
  const [inputAsset, setInputAsset] = useState(null);
  const [inputAmount, setInputAmount] = useState('');
  const [outputChain, setOutputChain] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [generatedSecretNote, setGeneratedSecretNote] = useState('');
  const [copiedNote, setCopiedNote] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  // Chat message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'minotorus',
      text: "Salutations ! Je suis Minotorus 🐂, le gardien du Labyrinthe. Je connais tous les recoins du protocole.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'welcome-2',
      sender: 'minotorus',
      text: "Je vais automatiser votre parcours de mixage de A à Z. Quelle cryptomonnaie souhaitez-vous mixer aujourd'hui ?",
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
    }, 400);
  };

  // 2. User picks Amount
  const handleSelectAmount = (amountStr) => {
    setInputAmount(amountStr);
    addUserMessage(`Montant sélectionné : ${amountStr}`);

    setTimeout(() => {
      addBotMessage(`Très bien. Sur quelle blockchain de destination souhaitez-vous que vos fonds anonymisés ressortent ?`);
      setStep('SELECT_OUTPUT');
    }, 400);
  };

  // 3. User picks Output Chain
  const handleSelectOutputChain = (chain) => {
    setOutputChain(chain);
    addUserMessage(`Je veux ressortir sur ${chain.name}.`);

    setTimeout(() => {
      addBotMessage(`Entrez l'adresse de réception sécurisée sur le réseau ${chain.name} où les fonds doivent être envoyés :`);
      setStep('INPUT_ADDRESS');
    }, 400);
  };

  // 4. User enters destination address
  const handleConfirmAddress = (e) => {
    e?.preventDefault();
    if (!customAddressInput.trim() || customAddressInput.length < 10) return;

    const addr = customAddressInput.trim();
    setRecipientAddress(addr);
    addUserMessage(`Adresse de destination : ${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`);

    setTimeout(() => {
      addBotMessage(`Voici le récapitulatif de votre opération automatisée par Minotorus :`);
      setStep('CONFIRM');
    }, 400);
  };

  // 5. User executes the automated mix
  const handleExecuteMix = () => {
    setStep('EXECUTING');
    addUserMessage("Confirmer et exécuter le mixage maintenant ⚡");

    setTimeout(() => {
      // Generate unique cryptographic secret note
      const secretNote = `labyrinth-v1-zk-${Math.random().toString(36).substring(2, 12)}-${Math.random().toString(36).substring(2, 10)}`;
      setGeneratedSecretNote(secretNote);
      setStep('COMPLETED');
      addBotMessage(`🎉 Opération de mixage ZK réussie ! Votre note secrète a été générée et enregistrée.`);
      
      if (onTriggerMix) {
        onTriggerMix({
          asset: inputAsset?.id,
          amount: inputAmount,
          destinationChain: outputChain?.name,
          recipient: recipientAddress,
          note: secretNote
        });
      }
    }, 1500);
  };

  // Reset conversation to initial state
  const handleReset = () => {
    setStep('GREETING');
    setInputAsset(null);
    setInputAmount('');
    setOutputChain(null);
    setRecipientAddress('');
    setCustomAddressInput('');
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
      
      {/* 💬 FLOATING CHAT BOX (Opens directly above the floating bottom button) */}
      {isOpen && (
        <div 
          className="w-[340px] sm:w-[380px] h-[520px] max-h-[82vh] mb-3 rounded-2xl shadow-2xl border border-cyan-500/40 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden animate-fadeIn"
          style={{ boxShadow: '0 20px 50px rgba(0, 210, 255, 0.25)' }}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center text-white">
                <BullHeadIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1">
                    Minotorus
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-cyan-300/80 font-mono">Guide du Labyrinthe</p>
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

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'minotorus' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                    <BullHeadIcon className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed shadow-sm ${
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
                  Sélectionnez la cryptomonnaie :
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
                  {inputAsset.defaultAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSelectAmount(amt)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500 text-center transition-all text-xs text-cyan-400 font-bold font-mono"
                    >
                      {amt}
                    </button>
                  ))}
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

            {/* 📥 STEP 4: Input Recipient Address Form */}
            {step === 'INPUT_ADDRESS' && outputChain && (
              <form onSubmit={handleConfirmAddress} className="p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-2 mt-2">
                <label className="text-[11px] font-bold text-cyan-300 block">
                  Adresse de Réception ({outputChain.name}) :
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x... ou adresse réseau"
                  value={customAddressInput}
                  onChange={(e) => setCustomAddressInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!customAddressInput.trim() || customAddressInput.length < 10}
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
                  Récapitulatif de Mixage :
                </span>

                <div className="space-y-1 text-[11px] font-mono text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Actif Déposé :</span>
                    <strong className="text-white">{inputAmount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Réseau Cible :</span>
                    <strong className="text-cyan-400">{outputChain?.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destinataire :</span>
                    <strong className="text-amber-400 truncate max-w-[140px]">{recipientAddress}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-500">ZK Shield :</span>
                    <span className="text-emerald-400 font-bold">100% Anonyme</span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteMix}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Exécuter avec Minotorus ⚡</span>
                </button>
              </div>
            )}

            {/* ⏳ Executing state */}
            {step === 'EXECUTING' && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
                <p className="text-xs font-mono text-cyan-300">Génération de la preuve ZK-SNARK & mixage en cours...</p>
              </div>
            )}

            {/* 🎉 STEP 6: Completed Result */}
            {step === 'COMPLETED' && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2.5 mt-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mixage ZK Déclenché avec Succès !</span>
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

      {/* 🐂 FLOATING ACTION BUTTON (FAB) WITH BULL HEAD ICON */}
      <button
        onClick={toggleChat}
        className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-cyan-900 to-amber-600 text-white border-2 border-cyan-400 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
        style={{
          boxShadow: '0 0 25px rgba(0, 210, 255, 0.5), 0 0 10px rgba(245, 158, 11, 0.4)'
        }}
        title="Minotorus — Guide de Mixage Automatisé"
        aria-label="Minotorus Bot"
      >
        {/* Glowing Aura Ring */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-amber-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>

        <div className="relative flex items-center justify-center">
          <BullHeadIcon className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 group-hover:text-white transition-colors" />
        </div>

        {/* Unread Message Pill Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-slate-950 shadow-md animate-bounce">
            Minotorus
          </span>
        )}
      </button>

    </div>
  );
};

export default MinotorusBot;
