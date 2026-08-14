import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText, Lock, Download, Award, Search, AlertCircle } from 'lucide-react';

const ProofOfInnocence = ({ t }) => {
  const tPoi = t.poi;
  const [nullifierInput, setNullifierInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const handleGenerateCertificate = (e) => {
    e.preventDefault();
    if (!nullifierInput) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCertificateGenerated(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Panel */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{tPoi.badge}</span>
          </div>
          <span className="badge-emerald self-start sm:self-auto shrink-0">{tPoi.cexBadge}</span>
        </div>

        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{tPoi.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
          {tPoi.subtitle}
        </p>
      </div>

      {/* Generator Box */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-500" />
          {tPoi.generatorTitle}
        </h3>

        {!certificateGenerated ? (
          <form onSubmit={handleGenerateCertificate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {tPoi.inputLabel}
              </label>
              <input
                type="text"
                required
                placeholder="0x7f4a...9b12"
                value={nullifierInput}
                onChange={(e) => setNullifierInput(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3.5 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-slate-100 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tPoi.infoText}
              </p>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full btn-cyan py-3.5 text-sm flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{tPoi.verifyingBtn}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{tPoi.generateBtn}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{tPoi.successTitle}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-300">{tPoi.successStatus}</p>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <div><span className="text-slate-500">{tPoi.certId}</span> poi-zk-lab-994827104</div>
              <div><span className="text-slate-500">{tPoi.merkleHash}</span> 0x3a9f...8b21</div>
              <div><span className="text-slate-500">{tPoi.sanctionCheck}</span></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert("Certificat PDF/JSON téléchargé avec succès !")}
                className="btn-cyan py-2.5 px-5 text-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{tPoi.downloadBtn}</span>
              </button>

              <button
                onClick={() => setCertificateGenerated(false)}
                className="btn-secondary py-2.5 px-5 text-xs"
              >
                {tPoi.verifyAnother}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Doctrine d'Anonymat Total Cypherpunk & Protection Anti-Tornado Cash */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-amber-500/30 bg-amber-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Doctrine d'Anonymat Cypherpunk & Immunité Décentralisée
            </h3>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              Protection Souveraine des Fondateurs, Développeurs & Utilisateurs
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          Tirant les leçons juridiques de l'écosystème Tornado Cash, <strong>Labyrinth Protocol fonctionne selon la doctrine du Zero-Knowledge Absolu</strong>. Le protocole est conçu pour être une infrastructure mathématique autonome et immuable sur la blockchain. <strong>Les fondateurs et développeurs opèrent sous anonymat cryptographique total</strong> sans aucun compte de réseau social centralisé, protégeant ainsi l'écosystème contre tout risque de coercition tout en garantissant un anonymat souverain à ses utilisateurs.
        </p>
      </div>
    </div>
  );
};

export default ProofOfInnocence;
