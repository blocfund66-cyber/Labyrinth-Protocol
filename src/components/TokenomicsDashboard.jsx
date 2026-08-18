import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, LAB_TOKEN_ABI } from '../contracts/config';
import { 
  Flame, 
  PieChart, 
  Coins, 
  Lock, 
  Award, 
  TrendingUp, 
  UserCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const TokenomicsDashboard = ({ t }) => {
  const tTok = t.tokenomics;
  const [stakedAmount, setStakedAmount] = useState('10000');
  const [liveBurnedTokens, setLiveBurnedTokens] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [addedToWallet, setAddedToWallet] = useState(false);

  const labBaseAddress = CONTRACT_ADDRESSES.base?.LabToken || '0xA578a06f60a7D2e79817128A88a0E3eCc5bb4c8B';
  const uniswapBuyUrl = `https://app.uniswap.org/swap?chain=base&outputCurrency=${labBaseAddress}`;
  const baseScanUrl = `https://basescan.org/token/${labBaseAddress}`;

  useEffect(() => {
    let isMounted = true;
    async function fetchOnChainTokenData() {
      try {
        const labAddress = CONTRACT_ADDRESSES.sepolia.LabToken;
        if (!labAddress || labAddress === '0x0000000000000000000000000000000000000000') return;

        const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
        const labContract = new ethers.Contract(labAddress, LAB_TOKEN_ABI, provider);
        
        const totalSup = await labContract.totalSupply();
        const initialMax = ethers.parseEther("1000000000");
        const burnedRaw = initialMax > totalSup ? initialMax - totalSup : 0n;
        const burnedFormatted = Math.floor(Number(ethers.formatEther(burnedRaw)));

        if (isMounted) {
          setLiveBurnedTokens(burnedFormatted);
        }
      } catch (err) {
        console.warn("Could not query live burn stats from Sepolia:", err);
      }
    }

    fetchOnChainTokenData();
    return () => { isMounted = false; };
  }, []);

  const handleCopyContract = () => {
    navigator.clipboard.writeText(labBaseAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleAddTokenToWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: labBaseAddress,
              symbol: 'LAB',
              decimals: 18,
              image: 'https://labyrinth-protocol.onrender.com/assets/logo.png',
            },
          },
        });
        setAddedToWallet(true);
        setTimeout(() => setAddedToWallet(false), 3000);
      } catch (error) {
        console.error("Error adding $LAB to MetaMask:", error);
      }
    } else {
      alert("Veuillez connecter un portefeuille Web3 (MetaMask) pour ajouter le jeton.");
    }
  };

  const totalSupply = 1000000000; // 1,000,000,000 $LAB (1 Billion)
  const burnedTokens = liveBurnedTokens;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. HERO TOKEN HEADER & LIVE BURN COUNTER */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-blue-500/30">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5" />
            {tTok.badge}
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{tTok.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
            {tTok.subtitle}
          </p>
        </div>

        {/* EIP-1559 Live Burn Counter Widget */}
        <div className="bg-gradient-to-br from-slate-100 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/40 p-6 rounded-2xl border border-rose-300 dark:border-rose-500/40 text-center w-full md:w-auto shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            {tTok.burnTitle}
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white tracking-wider">
            {burnedTokens.toLocaleString()} <span className="text-rose-500 text-xl">$LAB</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
            {tTok.burnDesc}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. UNISWAP DEX LIQUIDITY & TOKEN ACCESS CARD */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 border-cyan-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 relative overflow-hidden shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Liquidité Décentralisée 100% On-Chain</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Acheter & Échanger $LAB sur Uniswap V3 (Base L2)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Le jeton $LAB est nativement déployé sur la blockchain <strong>Base L2</strong>. Vous pouvez acquérir des $LAB directement via la pool décentralisée Uniswap ou les staker pour percevoir 80% des frais de relayeurs en Real Yield.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={uniswapBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan py-3.5 px-6 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Acheter $LAB sur Uniswap</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleAddTokenToWallet}
              className="py-3.5 px-5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>{addedToWallet ? '✓ Ajouté à MetaMask' : '+ Ajouter à MetaMask'}</span>
            </button>
          </div>
        </div>

        {/* Contract Address Copy Bar */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 shrink-0">Contrat $LAB (Base Mainnet) :</span>
            <span className="text-cyan-400 font-bold truncate">{labBaseAddress}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyContract}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? 'Copié !' : 'Copier l\'adresse'}</span>
            </button>

            <a
              href={baseScanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-sans font-semibold flex items-center gap-1 transition-colors"
            >
              <span>BaseScan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ALLOCATION BREAKDOWN GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Founder Allocation (X) & Dev Team (Y) */}
        <div className="glass-panel p-6 border-blue-500/40 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="badge-cyan font-bold text-sm">22.0% Total</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tTok.founderCardTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {tTok.founderCardDesc}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">{tTok.founderLabel}</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">12.0% (120M $LAB)</strong>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{tTok.devLabel}</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">10.0% (100M $LAB)</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-500">{tTok.founderVesting}</div>
        </div>

        {/* Card 2: Community DAO & Liquidity Pools */}
        <div className="glass-panel p-6 border-blue-500/40 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="badge-cyan font-bold text-sm">48.0% Total</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tTok.communityCardTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {tTok.communityCardDesc}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">{tTok.daoLabel}</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">28.0% (280M $LAB)</strong>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{tTok.lpLabel}</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">20.0% (200M $LAB)</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-500">{tTok.daoVesting}</div>
        </div>

        {/* Card 3: Privacy Staking Rewards & Genesis Ambassadors */}
        <div className="glass-panel p-6 border-blue-500/40 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/40 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="badge-cyan font-bold text-sm">30.0% Total</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Récompenses & Ambassadeurs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Incitations pour les 500 pionniers Genesis et mineurs d'anonymat.
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-slate-400">Ambassadeurs Genesis (500)</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">2.0% (20M $LAB)</strong>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">{tTok.miningLabel}</span>
              <strong className="text-blue-600 dark:text-blue-400 font-mono">28.0% (280M $LAB)</strong>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-500">{tTok.miningVesting}</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STAKING & REVENUE SHARE SIMULATOR */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {tTok.stakingTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {tTok.stakingSubtitle}
            </p>
          </div>
          <span className="badge-emerald">{tTok.stakingEstApr}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {tTok.stakeAmountLabel}
            </label>
            <input
              type="number"
              value={stakedAmount}
              onChange={(e) => setStakedAmount(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 font-mono text-lg font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-blue-200 dark:border-blue-500/30 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">{tTok.monthlyEst}</span>
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ${((Number(stakedAmount) || 0) * 0.015).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">{tTok.yearlyEst}</span>
              <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                ${((Number(stakedAmount) || 0) * 0.184).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenomicsDashboard;
