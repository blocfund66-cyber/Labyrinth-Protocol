import React from 'react';
import { Sparkles, Award, Check } from 'lucide-react';

const OnboardingModal = ({ isOpen, onClose, currentLevel, onSelectLevel, t }) => {
  if (!isOpen) return null;

  const tOnboard = t.onboarding;

  const levels = [
    {
      id: 'beginner',
      title: tOnboard.beginnerTitle,
      subtitle: tOnboard.beginnerSub,
      description: tOnboard.beginnerDesc,
      badge: 'Bronze 🥉',
      badgeStyle: 'bg-amber-600/10 border border-amber-600/30 text-amber-700 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full text-xs',
      icon: <Award className="w-6 h-6 text-amber-600 dark:text-amber-500" />
    },
    {
      id: 'intermediate',
      title: tOnboard.interTitle,
      subtitle: tOnboard.interSub,
      description: tOnboard.interDesc,
      badge: 'Argent 🥈',
      badgeStyle: 'bg-slate-400/10 border border-slate-400/30 text-slate-700 dark:text-slate-300 font-bold px-2.5 py-0.5 rounded-full text-xs',
      icon: <Award className="w-6 h-6 text-slate-400 dark:text-slate-300" />
    },
    {
      id: 'advanced',
      title: tOnboard.advTitle,
      subtitle: tOnboard.advSub,
      description: tOnboard.advDesc,
      badge: 'Or 🥇',
      badgeStyle: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 font-bold px-2.5 py-0.5 rounded-full text-xs',
      icon: <Award className="w-6 h-6 text-yellow-500" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden border-blue-500/40 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {tOnboard.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {tOnboard.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {tOnboard.subtitle}
          </p>
        </div>

        {/* Level Cards Selector */}
        <div className="grid grid-cols-1 gap-3.5">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                currentLevel === lvl.id
                  ? 'glass-card-selected'
                  : 'card-item-btn'
              }`}
            >
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl shrink-0 border border-slate-200 dark:border-slate-800">
                {lvl.icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    {lvl.title}
                  </h3>
                  <span className={lvl.badgeStyle}>{lvl.badge}</span>
                </div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{lvl.subtitle}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{lvl.description}</p>
              </div>

              {currentLevel === lvl.id && (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 self-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full btn-cyan py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2"
        >
          <span>{tOnboard.confirmBtn}</span>
        </button>
      </div>
    </div>
  );
};

export default OnboardingModal;
