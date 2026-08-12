import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { X, Copy, ExternalLink, LogOut, Check, Wallet } from 'lucide-react';
import { CONTRACT_ADDRESSES, LAB_TOKEN_ABI } from '../contracts/config';

const WalletModal = ({ 
  isOpen, 
  onClose, 
  fullAddress, 
  onDisconnect 
}) => {
  const [copied, setCopied] = useState(false);
  const [ethBalance, setEthBalance] = useState('0.00');
  const [labBalance, setLabBalance] = useState('0');
  const [networkName, setNetworkName] = useState('Sepolia Testnet');
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (isOpen && fullAddress && typeof window !== 'undefined' && window.ethereum) {
      fetchWalletStats();
    }
  }, [isOpen, fullAddress]);

  const fetchWalletStats = async () => {
    setIsLoadingStats(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId === 11155111n) {
        setNetworkName('Ethereum Sepolia Testnet');
      } else if (network.chainId === 1n) {
        setNetworkName('Ethereum Mainnet');
      } else if (network.chainId === 42161n) {
        setNetworkName('Arbitrum One');
      } else if (network.chainId === 10n) {
        setNetworkName('Optimism L2');
      } else if (network.chainId === 8453n) {
        setNetworkName('Base L2');
      } else {
        setNetworkName(`Chain ID: ${network.chainId}`);
      }

      // Fetch ETH Balance
      const rawEth = await provider.getBalance(fullAddress);
      setEthBalance(parseFloat(ethers.formatEther(rawEth)).toFixed(4));

      // Fetch $LAB Balance
      const labAddress = CONTRACT_ADDRESSES.sepolia.LabToken;
      if (labAddress && labAddress !== '0x0000000000000000000000000000000000000000') {
        const labContract = new ethers.Contract(labAddress, LAB_TOKEN_ABI, provider);
        const rawLab = await labContract.balanceOf(fullAddress);
        setLabBalance(parseFloat(ethers.formatEther(rawLab)).toLocaleString());
      }
    } catch (err) {
      console.warn("Could not fetch wallet live balances:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleCopyAddress = () => {
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl p-6 space-y-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Portefeuille Connecté</h3>
              <p className="text-xs text-slate-400">Session Web3 Active</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network & Address Box */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Réseau Connecté</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {networkName}
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-mono text-sm font-semibold text-blue-300 truncate max-w-[240px]">
              {fullAddress}
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleCopyAddress}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative"
                title="Copier l'adresse"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <a 
                href={`https://sepolia.etherscan.io/address/${fullAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Voir sur Etherscan"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Balances Box */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Solde ETH</span>
            <div className="text-lg font-black text-white font-mono">
              {isLoadingStats ? '...' : `${ethBalance} ETH`}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Solde $LAB</span>
            <div className="text-lg font-black text-cyan-400 font-mono">
              {isLoadingStats ? '...' : `${labBalance} $LAB`}
            </div>
          </div>
        </div>

        {/* Disconnect Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              onDisconnect();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 hover:text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnecter le Portefeuille</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default WalletModal;
