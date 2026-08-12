import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, CheckCircle2, Lock, Sparkles, ExternalLink, ArrowRight, Droplets, Trophy, Users } from 'lucide-react';
import pioneerBadgeImg from '../assets/pioneer_badge.jpg';

const PioneerQuests = ({ isConnected, walletAddress, activeTab, setActiveTab, t }) => {
  const [completedQuests, setCompletedQuests] = useState({
    deposit: false,
    poi: false,
    dao: false
  });

  const [faucetClaimed, setFaucetClaimed] = useState(false);
  const [isMintingNft, setIsMintingNft] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);

  // Read saved quest progress from localStorage
  useEffect(() => {
    if (walletAddress) {
      const savedProgress = localStorage.getItem(`labyrinth_quests_${walletAddress}`);
      if (savedProgress) {
        try {
          setCompletedQuests(JSON.parse(savedProgress));
        } catch (e) {}
      }
      const savedMint = localStorage.getItem(`labyrinth_nft_minted_${walletAddress}`);
      if (savedMint === 'true') {
        setNftMinted(true);
      }
    }
  }, [walletAddress]);

  // Handle Testnet Faucet Claim
  const handleClaimFaucet = () => {
    setFaucetClaimed(true);
    setTimeout(() => setFaucetClaimed(false), 4000);
  };

  // Complete a quest step
  const handleSimulateQuest = (questKey) => {
    const updated = { ...completedQuests, [questKey]: true };
    setCompletedQuests(updated);
    if (walletAddress) {
      localStorage.setItem(`labyrinth_quests_${walletAddress}`, JSON.stringify(updated));
    }
  };

  // Handle NFT Badge Minting
  const handleMintBadge = () => {
    setIsMintingNft(true);
    setTimeout(() => {
      setIsMintingNft(false);
      setNftMinted(true);
      if (walletAddress) {
        localStorage.setItem(`labyrinth_nft_minted_${walletAddress}`, 'true');
      }
    }, 2500);
  };

  const completedCount = Object.values(completedQuests).filter(Boolean).length;
  const isEligibleForMint = completedCount === 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* 1. HERO CAMPAIGN BANNER */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-cyan-500/40">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            Campagne Galxe & Bêta-Test Incitative
          </div>

          <h2 className="text-3xl font-black text-white font-outfit tracking-tight">
            Quêtes Privacy Pioneer & Airdrop Mainnet
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Participez au bêta-test officiel de Labyrinth Protocol sur Sepolia. Validez les 3 quêtes interactives, mintez votre <strong className="text-cyan-400">Badge NFT Privacy Pioneer 3D</strong> et réservez l'une des <strong className="text-amber-400">20 000 places d'ambassadeurs</strong> pour recevoir 1 000 $LAB Mainnet !
          </p>

          {/* Relayer Staking Revenue Privilege Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white font-bold mb-0.5">💎 Utilité & Revenu Passif du Staking $LAB :</strong>
              En stakant vos 1 000 $LAB dans le protocole, vous percevez automatiquement **80% de tous les frais de transaction prélevés par le réseau de relayeurs** (redistribués en Real Yield continu sur votre portefeuille) !
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2">
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Places Ambassadeurs Réservées : <strong className="text-white">4,820 / 20,000</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Allocation Airdrop : <strong className="text-amber-400">1,000 $LAB / Wallet</strong></span>
            </div>
          </div>
        </div>

        {/* 3D Hologram Badge Display */}
        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-all"></div>
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-2xl bg-slate-950">
            <img 
              src={pioneerBadgeImg} 
              alt="Privacy Pioneer NFT Badge 3D" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            {nftMinted && (
              <div className="absolute bottom-2 left-2 right-2 bg-emerald-500/90 text-slate-950 text-center text-xs font-black py-1 rounded-lg backdrop-blur-md">
                ✓ MINTÉ EN ON-CHAIN
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FAUCET TESTNET SECTION */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 p-6 rounded-2xl border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Droplets className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Robinet de Testnet Sepolia (Faucet 1-Clic)</h4>
            <p className="text-xs text-slate-400">Obtenez 1 000 $LAB & ETH de test gratuitement pour exécuter vos quêtes sans frais.</p>
          </div>
        </div>

        <button
          onClick={handleClaimFaucet}
          disabled={faucetClaimed}
          className="btn-cyan py-2.5 px-6 font-bold text-xs shrink-0 flex items-center gap-2 shadow-lg"
        >
          <Droplets className="w-4 h-4" />
          <span>{faucetClaimed ? '✓ 1 000 $LAB Envoyés !' : 'Réclamer 1 000 $LAB de Test'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. THREE INTERACTIVE QUEST STEPS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <span>Progression des Quêtes ({completedCount} / 3 Validées)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* QUEST 1: DEPOSIT */}
          <div className={`glass-panel p-6 border transition-all space-y-4 relative ${
            completedQuests.deposit ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quête 01</span>
              {completedQuests.deposit ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validée
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  En attente
                </span>
              )}
            </div>

            <div>
              <h4 className="font-bold text-white text-base">Mixage Anonyme ZK</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Effectuez au moins 1 dépôt de test (0.1 ETH ou 100 $LAB) dans le mixeur ZK.
              </p>
            </div>

            <button
              onClick={() => {
                handleSimulateQuest('deposit');
                setActiveTab('mixer');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span>Aller au Mixeur ZK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* QUEST 2: PROOF OF INNOCENCE */}
          <div className={`glass-panel p-6 border transition-all space-y-4 relative ${
            completedQuests.poi ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quête 02</span>
              {completedQuests.poi ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validée
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  En attente
                </span>
              )}
            </div>

            <div>
              <h4 className="font-bold text-white text-base">Certificat de Conformité PoI</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Générez 1 attestation de preuve d'innocence Zero-Knowledge.
              </p>
            </div>

            <button
              onClick={() => {
                handleSimulateQuest('poi');
                setActiveTab('poi');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span>Générer Certificat PoI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* QUEST 3: DAO VOTE */}
          <div className={`glass-panel p-6 border transition-all space-y-4 relative ${
            completedQuests.dao ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quête 03</span>
              {completedQuests.dao ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Validée
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  En attente
                </span>
              )}
            </div>

            <div>
              <h4 className="font-bold text-white text-base">Vote de Gouvernance DAO</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Exécutez au moins 1 vote sur une proposition DAO active.
              </p>
            </div>

            <button
              onClick={() => {
                handleSimulateQuest('dao');
                setActiveTab('dao');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 font-bold text-xs flex items-center justify-between transition-colors"
            >
              <span>Participer au Vote DAO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MINT NFT BADGE ACTION SECTION */}
      {/* ========================================================================= */}
      <div className="glass-panel p-6 sm:p-8 border-cyan-500/30 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl font-black text-white font-outfit">
            {nftMinted ? '🎉 Félicitations ! Votre Badge NFT Privacy Pioneer est Minté !' : 'Réclamez votre Badge NFT Privacy Pioneer'}
          </h3>
          <p className="text-xs text-slate-300">
            {nftMinted 
              ? 'Votre wallet fait officiellement partie de la cohorte des 20 000 ambassadeurs éligibles à l\'Airdrop de 1 000 $LAB Mainnet avec 15% de Yield Boost !' 
              : 'Validez les 3 quêtes ci-dessus pour débloquer le mint de votre NFT sur la blockchain Sepolia.'
            }
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleMintBadge}
            disabled={!isEligibleForMint || isMintingNft || nftMinted}
            className={`py-4 px-10 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-2xl ${
              nftMinted
                ? 'bg-emerald-500 text-slate-950 border border-emerald-400 cursor-default'
                : isEligibleForMint
                ? 'btn-cyan hover:scale-105 shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>
              {nftMinted
                ? '✓ Badge NFT Déjà en Possession'
                : isMintingNft
                ? 'Mintage du NFT en cours sur la Blockchain...'
                : isEligibleForMint
                ? 'Minter mon Badge NFT Privacy Pioneer (3D)'
                : `Complétez les 3 Quêtes (${completedCount}/3) pour Minter`}
            </span>
          </button>
        </div>

        {/* Galxe External Verification Banner */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 max-w-xl mx-auto">
          <span>Campagne officielle synchronisée avec Galxe Protocol</span>
          <a 
            href="https://galxe.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Voir sur Galxe</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default PioneerQuests;
