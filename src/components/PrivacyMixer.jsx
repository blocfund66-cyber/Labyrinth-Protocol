import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRightLeft, 
  Key, 
  Lock, 
  Unlock, 
  TrendingUp, 
  CheckCircle2, 
  Copy, 
  Download, 
  Zap, 
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  HelpCircle,
  Cpu,
  Info
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
  UsdtIcon, 
  DaiIcon, 
  WbtcIcon 
} from './Icons';

const PrivacyMixer = ({ experienceLevel = 'intermediate', t }) => {
  const tMixer = t.mixer;
  const [activeMode, setActiveMode] = useState('deposit'); // 'deposit' or 'withdraw'

  // Supported Major Blockchains (EVM & Solana)
  const chains = [
    { id: 'ethereum', name: 'Ethereum L1', icon: <EthIcon className="w-5 h-5" /> },
    { id: 'bsc', name: 'BNB Chain', icon: <BnbIcon className="w-5 h-5" /> },
    { id: 'polygon', name: 'Polygon', icon: <PolygonIcon className="w-5 h-5" /> },
    { id: 'arbitrum', name: 'Arbitrum One', icon: <ArbitrumIcon className="w-5 h-5" /> },
    { id: 'optimism', name: 'Optimism', icon: <OptimismIcon className="w-5 h-5" /> },
    { id: 'base', name: 'Base L2', icon: <BaseIcon className="w-5 h-5" /> },
    { id: 'avalanche', name: 'Avalanche', icon: <AvaxIcon className="w-5 h-5" /> },
    { id: 'solana', name: 'Solana', icon: <SolanaIcon className="w-5 h-5" /> }
  ];

  // Dynamic Token Mapping per Blockchain
  const chainTokens = {
    ethereum: [
      { id: 'ETH', name: 'ETH', icon: <EthIcon className="w-4 h-4" />, tiers: ['0.1', '1', '10', '100'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDT', name: 'USDT', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'DAI', name: 'DAI', icon: <DaiIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'WBTC', name: 'WBTC', icon: <WbtcIcon className="w-4 h-4" />, tiers: ['0.01', '0.1', '1', '10'] }
    ],
    bsc: [
      { id: 'BNB', name: 'BNB', icon: <BnbIcon className="w-4 h-4" />, tiers: ['0.5', '5', '50', '500'] },
      { id: 'USDT', name: 'USDT (BEP20)', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDC', name: 'USDC (BEP20)', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'ETH', name: 'ETH (BEP20)', icon: <EthIcon className="w-4 h-4" />, tiers: ['0.1', '1', '10', '100'] }
    ],
    polygon: [
      { id: 'MATIC', name: 'POL/MATIC', icon: <PolygonIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDC', name: 'USDC.e', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDT', name: 'USDT', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'DAI', name: 'DAI', icon: <DaiIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ],
    arbitrum: [
      { id: 'ETH', name: 'ETH', icon: <EthIcon className="w-4 h-4" />, tiers: ['0.05', '0.5', '5', '50'] },
      { id: 'ARB', name: 'ARB', icon: <ArbitrumIcon className="w-4 h-4" />, tiers: ['500', '2,500', '10,000', '50,000'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDT', name: 'USDT', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ],
    optimism: [
      { id: 'ETH', name: 'ETH', icon: <EthIcon className="w-4 h-4" />, tiers: ['0.05', '0.5', '5', '50'] },
      { id: 'OP', name: 'OP', icon: <OptimismIcon className="w-4 h-4" />, tiers: ['250', '1,000', '5,000', '25,000'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ],
    base: [
      { id: 'ETH', name: 'ETH', icon: <EthIcon className="w-4 h-4" />, tiers: ['0.05', '0.5', '5', '50'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ],
    avalanche: [
      { id: 'AVAX', name: 'AVAX', icon: <AvaxIcon className="w-4 h-4" />, tiers: ['5', '25', '100', '500'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDT', name: 'USDT', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ],
    solana: [
      { id: 'SOL', name: 'SOL', icon: <SolanaIcon className="w-4 h-4" />, tiers: ['1', '10', '50', '250'] },
      { id: 'USDC', name: 'USDC', icon: <UsdcIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] },
      { id: 'USDT', name: 'USDT', icon: <UsdtIcon className="w-4 h-4" />, tiers: ['100', '1,000', '10,000', '100,000'] }
    ]
  };

  // Deposit Form State
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [token, setToken] = useState('ETH');
  const [amountTier, setAmountTier] = useState('1');
  const [enableYield, setEnableYield] = useState(true);
  const [generatedNote, setGeneratedNote] = useState('');
  const [isDepositConfirmed, setIsDepositConfirmed] = useState(false);

  // Advanced Pro Config State
  const [customRelayerFee, setCustomRelayerFee] = useState('50');
  const [customGasLimit, setCustomGasLimit] = useState('350000');

  // Withdraw Form State
  const [withdrawNote, setWithdrawNote] = useState('');
  const [destChain, setDestChain] = useState('arbitrum');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedRelayer, setSelectedRelayer] = useState('auto');
  const [includeProofOfInnocence, setIncludeProofOfInnocence] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  // Dynamic Token List for Current Selected Chain
  const availableTokens = chainTokens[sourceChain] || chainTokens.ethereum;
  const currentTokenObj = availableTokens.find(t => t.id === token) || availableTokens[0];
  const availableTiers = currentTokenObj ? currentTokenObj.tiers : ['1'];

  // Handle Chain Selection Change
  const handleChainChange = (newChainId) => {
    setSourceChain(newChainId);
    const newTokens = chainTokens[newChainId] || chainTokens.ethereum;
    const defaultToken = newTokens[0];
    setToken(defaultToken.id);
    setAmountTier(defaultToken.tiers[1] || defaultToken.tiers[0]);
  };

  // Handle Token Selection Change
  const handleTokenChange = (newTokenId) => {
    setToken(newTokenId);
    const foundToken = availableTokens.find(t => t.id === newTokenId);
    if (foundToken) {
      setAmountTier(foundToken.tiers[1] || foundToken.tiers[0]);
    }
  };

  // Generate Labyrinth Cryptographic Note
  const handleGenerateDepositNote = () => {
    const randomHex1 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const randomHex2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const note = `labyrinth-v1-${sourceChain}-${token}-${amountTier}-${randomHex1}${randomHex2}`;
    setGeneratedNote(note);
    setIsDepositConfirmed(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  const downloadNote = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedNote], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Labyrinth-Secret-Note-${amountTier}${token}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawNote || !recipientAddress) return;

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawSuccess(true);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800 backdrop-blur-md flex gap-2">
          <button
            onClick={() => { setActiveMode('deposit'); setWithdrawSuccess(false); }}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all text-sm ${
              activeMode === 'deposit'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            {tMixer.depositTab}
          </button>
          <button
            onClick={() => { setActiveMode('withdraw'); setWithdrawSuccess(false); }}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all text-sm ${
              activeMode === 'withdraw'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Unlock className="w-4 h-4" />
            {tMixer.withdrawTab}
          </button>
        </div>
      </div>

      {/* 🐣 BEGINNER MODE STEP-BY-STEP PROGRESS BAR */}
      {experienceLevel === 'beginner' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              {tMixer.beginnerGuideTitle}
            </span>
            <span>{tMixer.beginnerStep1}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-emerald-500/20">
            <div className="bg-emerald-500 h-full w-[33%] transition-all"></div>
          </div>
        </div>
      )}

      {/* ⚡ ADVANCED PRO CRYPTOGRAPHIC INSPECTOR CARD */}
      {experienceLevel === 'advanced' && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-violet-500/40 space-y-3 font-mono text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-2">
            <span className="text-violet-400 font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-violet-400" />
              {tMixer.advancedZKTitle}
            </span>
            <span className="badge-violet">Merkle Tree H20</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">{tMixer.advancedPoseidonRoot}</span>
              <span className="text-cyan-300">0x3a9f...8b21</span>
            </div>
            <div>
              <span className="text-slate-500 block">{tMixer.advancedNullifier}</span>
              <span className="text-emerald-300">Poseidon(nullifier, path)</span>
            </div>
            <div>
              <span className="text-slate-500 block">{tMixer.advancedVKey}</span>
              <span className="text-violet-300">0x9f1a...c4e0</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Glass Panel */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {activeMode === 'deposit' ? (
          /* ================= DEPOSIT WIZARD ================= */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  {tMixer.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {tMixer.subtitle}
                </p>
              </div>
              <span className="badge-cyan">
                V1 Omnichain ZK
              </span>
            </div>

            {!isDepositConfirmed ? (
              <>
                {/* 1. Select Source Blockchain */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                    {tMixer.selectChain}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {chains.map((chain) => (
                      <button
                        key={chain.id}
                        type="button"
                        onClick={() => handleChainChange(chain.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          sourceChain === chain.id
                            ? 'glass-card-selected'
                            : 'card-item-btn'
                        }`}
                      >
                        <span className="shrink-0">{chain.icon}</span>
                        <span className="text-xs font-bold">{chain.name}</span>
                      </button>
                    ))}
                  </div>

                  {experienceLevel === 'beginner' && (
                    <div className="mt-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{tMixer.beginnerTipChain}</span>
                    </div>
                  )}
                </div>

                {/* 2. Select Asset & Amount Tier */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                      {tMixer.selectToken} ({sourceChain.toUpperCase()})
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                      {availableTokens.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTokenChange(item.id)}
                          className={`py-2.5 px-3 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 transition-all ${
                            token === item.id
                              ? 'glass-card-selected'
                              : 'card-item-btn'
                          }`}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                      {tMixer.selectTier} ({token})
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableTiers.map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setAmountTier(tier)}
                          className={`py-2.5 rounded-xl font-mono font-bold text-xs border transition-all ${
                            amountTier === tier
                              ? 'glass-card-selected'
                              : 'card-item-btn'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {experienceLevel === 'beginner' && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{tMixer.beginnerTipFixed}</span>
                  </div>
                )}

                {/* 3. Earn While Mixing */}
                <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {tMixer.yieldTitle}
                        <span className="badge-emerald">+4.8% APY</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {experienceLevel === 'beginner' ? tMixer.beginnerYieldTip : tMixer.yieldDesc}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableYield}
                      onChange={(e) => setEnableYield(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {experienceLevel === 'advanced' && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-violet-500/30 grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <label className="text-violet-400 font-bold block mb-1">{tMixer.advancedMaxFee}</label>
                      <input
                        type="number"
                        value={customRelayerFee}
                        onChange={(e) => setCustomRelayerFee(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-violet-400 font-bold block mb-1">{tMixer.advancedGasOverride}</label>
                      <input
                        type="number"
                        value={customGasLimit}
                        onChange={(e) => setCustomGasLimit(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Anonymity Metric */}
                <div className="bg-slate-100 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    {tMixer.anonymityPool}
                  </span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-300 dark:border-blue-800/40">
                    2,849 {tMixer.depositors} ({amountTier} {token})
                  </span>
                </div>

                {/* ACTION BUTTON */}
                <button
                  type="button"
                  onClick={handleGenerateDepositNote}
                  className="w-full btn-cyan py-4 text-base tracking-wide flex items-center justify-center gap-3 font-bold leading-none"
                >
                  <Lock className="w-5 h-5 shrink-0" />
                  <span>
                    {experienceLevel === 'beginner' && tMixer.beginnerDepositBtn}
                    {experienceLevel === 'intermediate' && tMixer.depositBtn}
                    {experienceLevel === 'advanced' && tMixer.advancedDepositBtn}
                  </span>
                </button>
              </>
            ) : (
              /* Secret Note Screen */
              <div className="space-y-6 py-2">
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-800 dark:text-amber-300 block text-sm font-bold mb-1">{tMixer.noteWarningTitle}</strong>
                    {tMixer.noteWarningDesc}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    {tMixer.secretNoteLabel}
                  </label>
                  <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-blue-500/40 font-mono text-xs text-blue-800 dark:text-blue-300 break-all leading-relaxed select-all">
                    {generatedNote}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => copyToClipboard(generatedNote)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    {copiedNote ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copiedNote ? tMixer.copied : tMixer.copyNote}
                  </button>

                  <button
                    onClick={downloadNote}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {tMixer.downloadNote}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setIsDepositConfirmed(false)}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:underline"
                  >
                    {tMixer.modifyParams}
                  </button>

                  <button
                    onClick={() => {
                      alert(`Deposit simulated for ${amountTier} ${token} on ${sourceChain}!`);
                      setIsDepositConfirmed(false);
                      setGeneratedNote('');
                    }}
                    className="btn-cyan py-3 px-6 text-sm flex items-center justify-center gap-2"
                  >
                    {tMixer.confirmDepositBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= WITHDRAW WIZARD ================= */
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Unlock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  {tMixer.withdrawTitle}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {tMixer.withdrawSubtitle}
                </p>
              </div>
              <span className="badge-violet">
                <Zap className="w-3.5 h-3.5" />
                Relayer H24
              </span>
            </div>

            {withdrawSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-4 my-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tMixer.txSuccessTitle}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                    {tMixer.txSuccessDesc} <strong>{chains.find(c=>c.id===destChain)?.name}</strong>.
                  </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20 font-mono text-xs text-slate-600 dark:text-slate-400 inline-block">
                  Tx Hash: 0x9f8b...3e1a
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => { setWithdrawSuccess(false); setWithdrawNote(''); setRecipientAddress(''); }}
                    className="btn-cyan py-2.5 px-6 text-sm flex items-center justify-center gap-2"
                  >
                    {tMixer.anotherWithdraw}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Enter Secret Note */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    {tMixer.enterNote}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="labyrinth-v1-ethereum-ETH-1-..."
                      value={withdrawNote}
                      onChange={(e) => setWithdrawNote(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 font-mono text-xs text-blue-800 dark:text-blue-300 focus:outline-none focus:border-blue-500 transition-all pr-10"
                    />
                    <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-4" />
                  </div>
                </div>

                {/* 2. Destination Chain & Recipient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      {tMixer.destChain}
                    </label>
                    <select
                      value={destChain}
                      onChange={(e) => setDestChain(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      {chains.map((chain) => (
                        <option key={chain.id} value={chain.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {chain.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      {tMixer.recipientAddr}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 3. Relayer Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center justify-between">
                    <span>{tMixer.relayerSelect}</span>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-normal">0.5% Fee</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRelayer('auto')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedRelayer === 'auto'
                          ? 'glass-card-selected'
                          : 'card-item-btn'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {tMixer.officialRelayer}
                          <span className="badge-cyan text-[10px] py-0">Default</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {experienceLevel === 'beginner' ? tMixer.beginnerRelayerTip : tMixer.relayerAvgTime}
                        </div>
                      </div>
                      <Zap className="w-4 h-4 text-blue-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRelayer('custom')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedRelayer === 'custom'
                          ? 'glass-card-selected'
                          : 'card-item-btn'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{tMixer.customRelayer}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{tMixer.relayerP2P}</div>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Proof of Innocence */}
                <div className="bg-cyan-50 dark:bg-cyan-950/40 p-4 rounded-xl border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {tMixer.poiCertTitle}
                        <span className="badge-cyan">CEX Compatible</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {tMixer.poiCertDesc}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeProofOfInnocence}
                      onChange={(e) => setIncludeProofOfInnocence(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full btn-cyan py-4 text-base tracking-wide flex items-center justify-center gap-3 font-bold leading-none"
                >
                  {isWithdrawing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>ZK-SNARK Proving & Routing...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5 shrink-0" />
                      <span>{tMixer.withdrawBtn}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PrivacyMixer;
