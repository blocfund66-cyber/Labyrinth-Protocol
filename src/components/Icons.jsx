import React from 'react';

// Official Crypto Blockchain & Token SVG Logos Component

export const EthIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 784 1277" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M392.07 0L383.5 29.11V873.74L392.07 882.29L784.13 650.54L392.07 0Z" fill="#343434"/>
    <path d="M392.07 0L0 650.54L392.07 882.29V472.33V0Z" fill="#8C8C8C"/>
    <path d="M392.07 956.52L387.24 962.41V1271.67L392.07 1276.36L784.37 724.89L392.07 956.52Z" fill="#3C3C3B"/>
    <path d="M392.07 1276.36V956.52L0 724.89L392.07 1276.36Z" fill="#8C8C8C"/>
    <path d="M392.07 882.29L784.13 650.54L392.07 472.33V882.29Z" fill="#141414"/>
    <path d="M0 650.54L392.07 882.29V472.33L0 650.54Z" fill="#393939"/>
  </svg>
);

export const BnbIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F3BA2F"/>
    <path d="M12 5L15 8L12 11L9 8L12 5Z" fill="white"/>
    <path d="M7 10L10 13L7 16L4 13L7 10Z" fill="white"/>
    <path d="M17 10L20 13L17 16L14 13L17 10Z" fill="white"/>
    <path d="M12 15L15 18L12 21L9 18L12 15Z" fill="white"/>
    <path d="M12 10.5L13.5 12L12 13.5L10.5 12L12 10.5Z" fill="white"/>
  </svg>
);

export const PolygonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#8247E5"/>
    <path d="M16.5 8.5L12 6L7.5 8.5V13.5L12 16L16.5 13.5V8.5Z" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const AvaxIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#E84142"/>
    <path d="M12 6L6 17H9.5L12 12.5L14.5 17H18L12 6Z" fill="white"/>
  </svg>
);

export const ArbitrumIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 19.5H22L12 2Z" fill="#28A0F0"/>
    <path d="M12 6L6 16.5H18L12 6Z" fill="#96BEDC"/>
    <path d="M10 11L12 7.5L14 11H10Z" fill="#FFFFFF"/>
  </svg>
);

export const OptimismIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FF0420"/>
    <path d="M8 8V16M16 8V16M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const BaseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#0052FF"/>
    <path d="M12 6V18M6 12H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const SolanaIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 17.5L7.5 20.5H20.5L17.5 17.5H4.5Z" fill="url(#solana-grad-1)"/>
    <path d="M4.5 10.5L7.5 13.5H20.5L17.5 10.5H4.5Z" fill="url(#solana-grad-2)"/>
    <path d="M4.5 3.5L7.5 6.5H20.5L17.5 3.5H4.5Z" fill="url(#solana-grad-3)"/>
    <defs>
      <linearGradient id="solana-grad-1" x1="4.5" y1="19" x2="20.5" y2="19" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="solana-grad-2" x1="4.5" y1="12" x2="20.5" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="solana-grad-3" x1="4.5" y1="5" x2="20.5" y2="5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const UsdcIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#2775CA"/>
    <text x="12" y="16" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">$</text>
  </svg>
);

export const UsdtIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#26A17B"/>
    <text x="12" y="16" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">T</text>
  </svg>
);

export const DaiIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F4B731"/>
    <text x="12" y="16" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">D</text>
  </svg>
);

export const WbtcIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F7931A"/>
    <text x="12" y="16" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">₿</text>
  </svg>
);

export const AbstractLabyrinthLogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative rounded-xl overflow-hidden border border-blue-500/40 shadow-lg shadow-blue-500/30 group transition-all`}>
    <img 
      src="/logo.jpg" 
      alt="Labyrinth Logo" 
      className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform" 
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'block';
      }}
    />
    <svg className="w-full h-full p-1 text-blue-500 bg-slate-950 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"/>
      <path d="M12 6V10M12 10H16M12 10H8M12 14V18"/>
      <path d="M6 12H10M14 12H18"/>
    </svg>
  </div>
);
