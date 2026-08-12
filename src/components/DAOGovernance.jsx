import React, { useState } from 'react';
import { 
  Vote, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Users, 
  AlertTriangle,
  Wallet,
  Lock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const DAOGovernance = ({ isConnected, walletAddress, connectWallet, t }) => {
  const tDao = t.dao || {
    badge: 'On-Chain DAO Governance',
    title: 'Gouvernance & Votes de la Communauté',
    subtitle: 'Votez et déposez des propositions décentralisées pour façonner l\'avenir du protocole Labyrinth.',
    votingPower: 'Votre Pouvoir de Vote (vLAB) :',
    stakedAmount: 'Jetons $LAB Stakés :',
    submitProposalBtn: '+ Créer une Proposition',
    voteFor: 'Voter POUR (Yes)',
    voteAgainst: 'Voter CONTRE (No)',
    proposalStatusPassed: 'Approuvée & Prête à l\'Exécution',
    proposalStatusActive: 'Vote en Cours',
    createModalTitle: 'Déposer une Proposition sur la Blockchain',
    inputTitleLabel: 'Titre de la Proposition :',
    inputDescLabel: 'Description Détaillée :',
    cancelBtn: 'Annuler',
    submitBtn: 'Soumettre la Proposition (On-Chain)',
    hasVoted: 'Vous avez déjà voté'
  };

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'passed'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [userVotedProposals, setUserVotedProposals] = useState({});

  // ─── [FIX #6] $LAB Balance — DEMO SIMULATION ─────────────────────────────────
  // CURRENT: Hardcoded balance used for UI demo / testnet purposes only.
  // The platform is NOT deployed on any blockchain network.
  //
  // TODO (Production — replace with this ethers.js snippet):
  // ─────────────────────────────────────────────────────────────────────────────
  //   import { ethers } from 'ethers';
  //   const LAB_TOKEN_ADDRESS = '0x...'; // Deployed LabToken contract address
  //   const LAB_ABI = ['function balanceOf(address) view returns (uint256)'];
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const labContract = new ethers.Contract(LAB_TOKEN_ADDRESS, LAB_ABI, provider);
  //   const rawBalance = await labContract.balanceOf(walletAddress);
  //   const userLabBalance = Number(ethers.formatEther(rawBalance));
  // ─────────────────────────────────────────────────────────────────────────────
  const IS_DEMO_MODE = true; // Set to false and use ethers.js above in production
  const userLabBalance = (IS_DEMO_MODE && isConnected) ? 500000 : 0;
  const isVerifiedMember = isConnected && userLabBalance > 0;

  // Mock Active DAO Proposals
  const [proposals, setProposals] = useState([
    {
      id: 'LIP-001',
      title: 'LIP-001: Integration of Solana & Monero Cross-Chain Privacy Bridge',
      author: '0x8F9...41A2 (Core Dev)',
      category: 'Protocol Expansion',
      description: 'Deploy Labyrinth zero-knowledge privacy pools onto Solana mainnet and establish a cross-chain zero-knowledge bridge for Monero ($XMR) privacy transfers.',
      votesFor: 14250000,
      votesAgainst: 1200000,
      quorumBps: 7800, // 78% quorum
      status: 'active',
      endsIn: '2 days 14 hours',
      creationTimestamp: '2026-08-10'
    },
    {
      id: 'LIP-002',
      title: 'LIP-002: Dynamic Fee Adjustment (Lower Protocol Fee from 0.15% to 0.10%)',
      author: '0x3C4...89B1 (Community)',
      category: 'Fee Optimization',
      description: 'Adjust LabyrinthCore protocol fee from 15 bps (0.15%) to 10 bps (0.10%) for deposits exceeding 10 ETH to attract institutional privacy volume.',
      votesFor: 28900000,
      votesAgainst: 3400000,
      quorumBps: 9100, // 91% quorum
      status: 'active',
      endsIn: '4 days 08 hours',
      creationTimestamp: '2026-08-08'
    },
    {
      id: 'LIP-003',
      title: 'LIP-003: Allocate 100,000 $LAB Treasury Grant for CertiK Security Audit',
      author: '0x71C...89F2 (Security Guild)',
      category: 'Security & Audit',
      description: 'Allocate $LAB tokens from DAO Treasury to fund a third-party security audit of Labyrinth V1 ZK-SNARK circuits and smart contracts by CertiK.',
      votesFor: 45000000,
      votesAgainst: 850000,
      quorumBps: 9800, // 98% quorum
      status: 'passed',
      endsIn: 'Passed & Executed',
      creationTimestamp: '2026-08-01'
    }
  ]);

  // Handle Voting Action with Strict Wallet & Token Holder Check
  const handleVote = (proposalId, voteType) => {
    if (!isConnected) {
      setShowAuthWarning(true);
      return;
    }

    if (!isVerifiedMember) {
      alert("⚠️ Accès refusé : Votre portefeuille ne détient pas de jetons $LAB. Seuls les détenteurs de jetons $LAB enregistrés sur la blockchain peuvent participer au vote.");
      return;
    }

    if (userVotedProposals[proposalId]) return;

    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: voteType === 'for' ? p.votesFor + userLabBalance : p.votesFor,
          votesAgainst: voteType === 'against' ? p.votesAgainst + userLabBalance : p.votesAgainst
        };
      }
      return p;
    }));

    setUserVotedProposals(prev => ({ ...prev, [proposalId]: voteType }));
  };

  // Handle Proposal Submission with Strict Wallet Check
  const handleOpenCreateModal = () => {
    if (!isConnected) {
      setShowAuthWarning(true);
      return;
    }

    if (!isVerifiedMember) {
      alert("⚠️ Seuls les membres détenant au moins 100,000 jetons $LAB stakés peuvent publier une proposition sur la blockchain.");
      return;
    }

    setShowCreateModal(true);
  };

  const handleSubmitNewProposal = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newProp = {
      id: `LIP-00${proposals.length + 1}`,
      title: `${newTitle}`,
      author: `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)} (Vous)`,
      category: 'Community Proposal',
      description: newDesc,
      votesFor: userLabBalance,
      votesAgainst: 0,
      quorumBps: 1500,
      status: 'active',
      endsIn: '7 days 00 hours',
      creationTimestamp: new Date().toISOString().split('T')[0]
    };

    setProposals([newProp, ...proposals]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const filteredProposals = proposals.filter(p => {
    if (activeFilter === 'active') return p.status === 'active';
    if (activeFilter === 'passed') return p.status === 'passed';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border-blue-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Vote className="w-3.5 h-3.5" />
              {tDao.badge}
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white font-outfit">
              {tDao.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {tDao.subtitle}
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="btn-cyan py-3 px-6 text-xs font-bold flex items-center gap-2 shrink-0 shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{tDao.submitProposalBtn}</span>
          </button>
        </div>

        {/* ON-CHAIN MEMBER VERIFICATION STATUS BAR */}
        <div className="mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {isConnected ? (
              isVerifiedMember ? (
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              )
            ) : (
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            )}

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {isConnected ? (
                  isVerifiedMember 
                    ? `🟢 Statut : Membre Vérifié de la Communauté DAO (${walletAddress})` 
                    : `🟡 Statut : Portefeuille Connecté — Aucun jeton $LAB détecté`
                ) : (
                  `🔴 Statut : Portefeuille Non Connecté`
                )}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isConnected ? (
                  isVerifiedMember 
                    ? `Votre portefeuille détient ${userLabBalance.toLocaleString()} $LAB. Vous êtes autorisé à voter et proposer.`
                    : `Acquérez ou stakez des jetons $LAB pour activer votre pouvoir de vote.`
                ) : (
                  `Connectez votre portefeuille Web3 pour vérifier votre solde de jetons $LAB On-Chain.`
                )}
              </span>
            </div>
          </div>

          {!isConnected && (
            <button
              onClick={connectWallet}
              className="btn-cyan text-xs py-2 px-4 font-bold flex items-center gap-2 shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Connecter le Portefeuille</span>
            </button>
          )}
        </div>

        {/* Voting Power Metrics Row - Adaptive Light/Dark Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/40 mt-6">
          <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">{tDao.votingPower}</span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
                {userLabBalance.toLocaleString()} vLAB
              </span>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">{tDao.stakedAmount}</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {userLabBalance.toLocaleString()} $LAB
              </span>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Vérification des Membres :</span>
              <span className="text-lg font-black text-violet-600 dark:text-violet-400 font-mono">
                {isConnected ? 'Verrouillé On-Chain' : 'En Attente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Adaptive Light/Dark Mode */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Toutes les Propositions ({proposals.length})
          </button>

          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'active'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Votes en Cours ({proposals.filter(p => p.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveFilter('passed')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'passed'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Approuvées & Exécutées ({proposals.filter(p => p.status === 'passed').length})
          </button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-6">
        {filteredProposals.map((item) => {
          const totalVotes = item.votesFor + item.votesAgainst;
          const pctFor = totalVotes > 0 ? ((item.votesFor / totalVotes) * 100).toFixed(1) : '0.0';
          const pctAgainst = totalVotes > 0 ? ((item.votesAgainst / totalVotes) * 100).toFixed(1) : '0.0';
          const hasVoted = userVotedProposals[item.id];

          return (
            <div key={item.id} className="glass-panel p-6 sm:p-8 space-y-6 hover:border-blue-500/40 transition-all">
              
              {/* Proposal Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                      {item.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    {item.status === 'passed' ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {tDao.proposalStatusPassed}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        {tDao.proposalStatusActive} • {item.endsIn}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                    {item.title}
                  </h3>
                </div>

                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <span>Proposé par : </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{item.author}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Progress Bar & Voting Statistics */}
              <div className="space-y-3 bg-slate-100 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> POUR : {item.votesFor.toLocaleString()} vLAB ({pctFor}%)
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> CONTRE : {item.votesAgainst.toLocaleString()} vLAB ({pctAgainst}%)
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${pctFor}%` }} className="bg-emerald-500 h-full transition-all"></div>
                  <div style={{ width: `${pctAgainst}%` }} className="bg-rose-500 h-full transition-all"></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-mono">
                  <span>Quorum du réseau : {(item.quorumBps / 100).toFixed(0)}% atteint</span>
                  <span>Total Votes : {totalVotes.toLocaleString()} vLAB</span>
                </div>
              </div>

              {/* Voting Action Buttons */}
              {item.status === 'active' && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {hasVoted ? (
                    <div className="w-full bg-slate-100 dark:bg-slate-900 border border-blue-500/40 p-3 rounded-xl text-center text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{tDao.hasVoted} ({hasVoted === 'for' ? 'POUR 🟢' : 'CONTRE 🔴'})</span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVote(item.id, 'for')}
                        className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{tDao.voteFor}</span>
                      </button>

                      <button
                        onClick={() => handleVote(item.id, 'against')}
                        className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{tDao.voteAgainst}</span>
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Mandatory Wallet Auth Warning Modal */}
      {showAuthWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-6 sm:p-8 space-y-6 border-amber-500/40 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Portefeuille Non Connecté
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Pour vérifier que vous êtes un membre effectif de la communauté Labyrinth et contrôler votre solde de jetons $LAB On-Chain, vous devez d'abord connecter votre portefeuille Web3.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowAuthWarning(false)}
                className="w-1/2 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                Fermer
              </button>

              <button
                onClick={() => { setShowAuthWarning(false); connectWallet(); }}
                className="w-1/2 btn-cyan py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connecter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="glass-panel max-w-lg w-full p-6 sm:p-8 space-y-6 border-blue-500/40 shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              {tDao.createModalTitle}
            </h2>

            <form onSubmit={handleSubmitNewProposal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{tDao.inputTitleLabel}</label>
                <input
                  type="text"
                  required
                  placeholder="ex: LIP-004: Deployment on Base Mainnet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">{tDao.inputDescLabel}</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Décrivez en détail votre proposition d'amélioration..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 outline-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  {tDao.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="w-1/2 btn-cyan py-3 text-xs font-bold"
                >
                  {tDao.submitBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DAOGovernance;
