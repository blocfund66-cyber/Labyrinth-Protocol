import React from 'react';
import { Sparkles, Compass, Zap, BookOpen, Check } from 'lucide-react';

const OnboardingModal = ({ isOpen, onClose, currentLevel, onSelectLevel, t }) => {
  if (!isOpen) return null;

  const tOnboard = t.onboarding;

  const levels = [
    {
      id: 'beginner',
      title: tOnboard.beginnerTitle,
      subtitle: tOnboard.beginnerSub,
      description: tOnboard.beginnerDesc,
      badge: 'Guide',
      badgeColor: 'badge-emerald',
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />
    },
    {
      id: 'intermediate',
      title: tOnboard.interTitle,
      subtitle: tOnboard.interSub,
      description: tOnboard.interDesc,
      badge: 'Standard',
      badgeColor: 'badge-cyan',
      icon: <Compass className="w-6 h-6 text-blue-500" />
    },
    {
      id: 'advanced',
      title: tOnboard.advTitle,
      subtitle: tOnboard.advSub,
      description: tOnboard.advDesc,
      badge: 'Expert ZK',
      badgeColor: 'badge-violet',
      icon: <Zap className="w-6 h-6 text-violet-500" />
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
                  <span className={lvl.badgeColor}>{lvl.badge}</span>
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
