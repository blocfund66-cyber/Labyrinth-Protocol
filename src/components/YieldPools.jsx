import React from 'react';
import { TrendingUp, Shield, Layers, Coins, ExternalLink, Activity, ArrowUpRight } from 'lucide-react';

const YieldPools = ({ t }) => {
  const tYield = t.yield;

  const pools = [
    {
      id: 'eth-1',
      asset: 'ETH',
      amountTier: '1.0 ETH',
      tvl: '$18,420,000',
      anonymitySet: 4820,
      yieldApy: '4.8%',
      strategy: 'Lido stETH Auto-Compound',
      status: 'Active'
    },
    {
      id: 'eth-10',
      asset: 'ETH',
      amountTier: '10.0 ETH',
      tvl: '$42,100,000',
      anonymitySet: 1240,
      yieldApy: '5.1%',
      strategy: 'EigenLayer Restaking Yield',
      status: 'Active'
    },
    {
      id: 'usdc-10k',
      asset: 'USDC',
      amountTier: '10,000 USDC',
      tvl: '$24,800,000',
      anonymitySet: 2480,
      yieldApy: '5.4%',
      strategy: 'Aave v3 Lending Pool',
      status: 'Active'
    },
    {
      id: 'arbitrum-eth',
      asset: 'ETH (Arbitrum)',
      amountTier: '0.1 ETH',
      tvl: '$9,350,000',
      anonymitySet: 9350,
      yieldApy: '4.6%',
      strategy: 'GMX Liquidity Vault',
      status: 'Active'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {tYield.badge}
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{tYield.title}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {tYield.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-blue-200 dark:border-blue-500/30 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{tYield.totalTvl}</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">$94,670,000</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{tYield.yieldDistributed}</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">$1,420,500</div>
          </div>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <div key={pool.id} className="glass-panel p-6 hover:border-blue-500/40 transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                  {pool.asset.substring(0, 3)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{pool.amountTier}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{pool.strategy}</span>
                </div>
              </div>

              <span className="badge-emerald font-mono font-bold text-sm px-3 py-1">
                {pool.yieldApy} {tYield.apy}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-100 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">{tYield.tvlLabel}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">{pool.tvl}</span>
              </div>

              <div className="bg-slate-100 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">{tYield.anonymitySetLabel}</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{pool.anonymitySet} {t.mixer.depositors}</span>
              </div>
            </div>

            {/* Anonymity Score Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-500" /> {tYield.anonymityScoreLabel}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{tYield.scoreOptimal}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full w-[88%]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YieldPools;
