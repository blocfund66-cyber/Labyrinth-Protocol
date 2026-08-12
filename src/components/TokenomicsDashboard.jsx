import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, LAB_TOKEN_ABI } from '../contracts/config';
import { Flame, PieChart, Coins, Lock, Award, TrendingUp, Sparkles, UserCheck } from 'lucide-react';

const TokenomicsDashboard = ({ t }) => {
  const tTok = t.tokenomics;
  const [stakedAmount, setStakedAmount] = useState('10000');
  const [liveBurnedTokens, setLiveBurnedTokens] = useState(0);

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

  const totalSupply = 1000000000; // 1,000,000,000 $LAB (1 Billion)
  const burnedTokens = liveBurnedTokens;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Token Header */}
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
        <div className="bg-gradient-to-br from-slate-100 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/40 p-6 rounded-2xl border border-rose-300 dark:border-rose-500/40 text-center w-full md:w-auto shadow-2xl relative overflow-hidden">
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

      {/* Allocation Breakdown Grid */}
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
              <span className="text-slate-500 dark:text-slate-400">{tTok.founderX}</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">120,000,000 $LAB (12%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">{tTok.devY}</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">100,000,000 $LAB (10%)</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              {tTok.combinedTotal} <strong className="text-slate-900 dark:text-white font-mono">220,000,000 $LAB (22%)</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Community & DAO Treasury */}
        <div className="glass-panel p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-indigo-500/15 border border-indigo-500/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="badge-violet font-bold text-sm">53.0% Total</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tTok.daoCardTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {tTok.daoCardDesc}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{tTok.daoTotal}</div>
            <div className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              530,000,000 $LAB
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">{tTok.daoVesting}</div>
          </div>
        </div>

        {/* Card 3: Anonymity Mining Rewards */}
        <div className="glass-panel p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="badge-emerald font-bold text-sm">25.0% Total</span>
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tTok.miningCardTitle}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {tTok.miningCardDesc}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{tTok.daoTotal}</div>
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              250,000,000 $LAB
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-500 mt-1">{tTok.miningVesting}</div>
          </div>
        </div>
      </div>

      {/* Staking & Revenue Share Simulator */}
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
