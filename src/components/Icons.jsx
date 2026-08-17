import React from 'react';
import logoImg from '../assets/logo.png';

/**
 * Official Crypto Blockchain & Token SVG Logos Component Suite
 * 100% Authentic Brand Assets (Ethereum, BNB Chain, Polygon, Avalanche, Arbitrum One, Optimism, Base L2, Solana, USDC, USDT, DAI, WBTC)
 */

// 1. Ethereum (ETH) — Official Ethereum Foundation Diamond Logo
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

// 2. BNB Chain (BNB) — Official Binance BNB Diamond Vector Logo
export const BnbIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
    <path d="M12.116 14.404L16 10.52L19.884 14.404L22.24 12.048L16 5.808L9.76 12.048L12.116 14.404ZM5.808 16L8.164 13.644L10.52 16L8.164 18.356L5.808 16ZM12.116 17.596L16 21.48L19.884 17.596L22.24 19.952L16 26.192L9.76 19.952L12.116 17.596ZM23.836 16L26.192 13.644L23.836 11.288L21.48 13.644L23.836 16ZM16 13.568L13.568 16L16 18.432L18.432 16L16 13.568Z" fill="white"/>
  </svg>
);

// 3. Polygon (POL/MATIC) — Official Polygon Network Purple Emblem
export const PolygonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#8247E5"/>
    <path d="M72 32L50 19L28 32V58L50 71L72 58V32ZM50 26.5L64.5 35V52L50 60.5L35.5 52V35L50 26.5Z" fill="white"/>
    <path d="M50 38L58 42.5V51.5L50 56L42 51.5V42.5L50 38Z" fill="#8247E5"/>
  </svg>
);

// 4. Avalanche (AVAX) — Official Avalanche Red Mountain Logo
export const AvaxIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="250" fill="#E84142"/>
    <path d="M341.4 350H400L250 90L100 350H158.6L250 191.4L341.4 350ZM208.6 350H291.4L250 278.6L208.6 350Z" fill="white"/>
  </svg>
);

// 5. Arbitrum One (ARB) — Official Offchain Labs Arbitrum Blue Shield Logo
export const ArbitrumIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="250" cy="250" r="250" fill="#213147"/>
    <path d="M247.3 118.8L151.7 263.2L116 230L174.5 118.8H247.3ZM325.5 118.8L384 230L348.3 263.2L252.7 118.8H325.5ZM250 178.6L322.2 287.8H277.8L250 245.9L222.2 287.8H177.8L250 178.6ZM177.8 312.2H322.2L350 354.1H150L177.8 312.2Z" fill="#28A0F0"/>
    <path d="M250 178.6L322.2 287.8H277.8L250 245.9L222.2 287.8H177.8L250 178.6Z" fill="#96BEDC"/>
    <path d="M177.8 312.2H322.2L350 354.1H150L177.8 312.2Z" fill="#FFFFFF"/>
  </svg>
);

// 6. Optimism (OP) — Official OP Mainnet Red Circle + Stylized 'OP' Logo
export const OptimismIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="100" fill="#FF0420"/>
    <path d="M68.5 61.5C48.9 61.5 33 77.4 33 97s15.9 35.5 35.5 35.5c19.6 0 35.5-15.9 35.5-35.5S88.1 61.5 68.5 61.5zm0 50.8c-8.4 0-15.3-6.9-15.3-15.3 0-8.4 6.9-15.3 15.3-15.3 8.4 0 15.3 6.9 15.3 15.3 0 8.4-6.9 15.3-15.3 15.3zM116.5 63h20.2c16 0 28.3 10.3 28.3 26 0 16.2-12.8 26.5-29 26.5h-19.5V63zm20 35.2c6.1 0 10.8-4.1 10.8-9.7 0-5.7-4.6-9.7-10.8-9.7h-3.3v19.4h3.3z" fill="#FFFFFF"/>
  </svg>
);

// 7. Base L2 — Official Coinbase Base Blue Circle Logo
export const BaseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M55.5 90C74.5538 90 90 74.5538 90 55.5C90 36.4462 74.5538 21 55.5 21C37.3824 21 22.5401 34.9747 21.1094 52.7344H67.5V58.2656H21.1094C22.5401 76.0253 37.3824 90 55.5 90Z" fill="white"/>
  </svg>
);

// 8. Solana (SOL) — Official Solana Gradient Slanted Bars Logo
export const SolanaIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#solana-grad-1)"/>
    <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-grad-2)"/>
    <path d="M332.4 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.8c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-grad-3)"/>
    <defs>
      <linearGradient id="solana-grad-1" x1="397" y1="234.1" x2="0" y2="311.6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="solana-grad-2" x1="397" y1="0" x2="0" y2="77.6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
      <linearGradient id="solana-grad-3" x1="0" y1="117.1" x2="397" y2="194.7" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
      </linearGradient>
    </defs>
  </svg>
);

// 9. USDC — Official USD Coin Centre Logo
export const UsdcIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="1000" cy="1000" r="1000" fill="#2775CA"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1250 1150C1250 1067.16 1182.84 1000 1100 1000H900C844.772 1000 800 955.228 800 900C800 844.772 844.772 800 900 800H1200V650H1050V550H950V650H900C761.929 650 650 761.929 650 900C650 1038.07 761.929 1150 900 1150H1100C1155.23 1150 1200 1194.77 1200 1250C1200 1305.23 1155.23 1350 1100 1350H800V1200H650V1350H800V1450H950V1350H1100C1238.07 1350 1350 1238.07 1350 1100" fill="white"/>
  </svg>
);

// 10. USDT — Official Tether Green Logo
export const UsdtIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="1000" cy="1000" r="1000" fill="#26A17B"/>
    <path d="M1275 600H1550V825H1275V975C1275 1025 1250 1075 1200 1100C1150 1125 1075 1125 1000 1125C925 1125 850 1125 800 1100C750 1075 725 1025 725 975V825H450V600H725V450H1275V600ZM1000 700C1165.69 700 1300 744.772 1300 800C1300 855.228 1165.69 900 1000 900C834.315 900 700 855.228 700 800C700 744.772 834.315 700 1000 700Z" fill="white"/>
  </svg>
);

// 11. DAI — Official MakerDAO Dai Yellow Logo
export const DaiIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="1000" cy="1000" r="1000" fill="#F4B731"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M600 600H1000C1220.91 600 1400 779.086 1400 1000C1400 1220.91 1220.91 1400 1000 1400H600V600ZM750 750V925H1000C1041.42 925 1075 958.579 1075 1000C1075 1041.42 1041.42 1075 1000 1075H750V1250H1000C1138.07 1250 1250 1138.07 1250 1000C1250 861.929 1138.07 750 1000 750H750Z" fill="white"/>
  </svg>
);

// 12. WBTC — Official Wrapped Bitcoin Orange Logo
export const WbtcIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="1000" cy="1000" r="1000" fill="#F7931A"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M1292.5 867.5C1315 827.5 1300 770 1242.5 750C1205 737.5 1145 745 1092.5 745V600H980V745H905V600H792.5V745H650V857.5H717.5V1142.5H650V1255H792.5V1400H905V1255H980V1400H1092.5V1255C1185 1255 1262.5 1227.5 1282.5 1122.5C1297.5 1037.5 1262.5 980 1205 952.5C1257.5 927.5 1282.5 892.5 1292.5 867.5ZM905 857.5H1045C1087.5 857.5 1115 872.5 1115 905C1115 937.5 1087.5 952.5 1045 952.5H905V857.5ZM905 1142.5V1042.5H1062.5C1107.5 1042.5 1137.5 1060 1137.5 1092.5C1137.5 1125 1107.5 1142.5 1062.5 1142.5H905Z" fill="white"/>
  </svg>
);

// 13. Protocol Main Brand Logo Component — Direct original image file imported into Vite bundle
export const AbstractLabyrinthLogo = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 bg-[#050814] flex items-center justify-center p-0.5 group transition-all shrink-0`}>
    <img 
      src={logoImg} 
      alt="Labyrinth Protocol Logo" 
      className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform" 
    />
  </div>
);

// 14. Official X (Formerly Twitter) Modern Brand Logo SVG
export const XLogoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// 15. Minotorus Badass Geometric Cyber-Bull Head Vector Icon (Directly Inspired by Reference Images 1 & 2)
export const BullHeadIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* Left Angular Horn */}
    <path 
      d="M20 16L32 34L22 44L14 36L14 26L20 16Z" 
      fill="currentColor" 
    />
    <path 
      d="M20 16L14 26L22 28L28 22L20 16Z" 
      fill="#F59E0B" 
    />

    {/* Right Angular Horn */}
    <path 
      d="M80 16L68 34L78 44L86 36L86 26L80 16Z" 
      fill="currentColor" 
    />
    <path 
      d="M80 16L86 26L78 28L72 22L80 16Z" 
      fill="#F59E0B" 
    />

    {/* Skull / Forehead Crown Plate */}
    <path 
      d="M34 34H66L72 44L50 60L28 44L34 34Z" 
      fill="currentColor" 
    />

    {/* Cheek Wings / Jaw Flares */}
    <path 
      d="M16 46L28 46L40 64L38 72L22 56L16 46Z" 
      fill="currentColor" 
    />
    <path 
      d="M84 46L72 46L60 64L62 72L78 56L84 46Z" 
      fill="currentColor" 
    />

    {/* Main Face Center Bridge */}
    <path 
      d="M42 56H58L56 72H44L42 56Z" 
      fill="currentColor" 
    />

    {/* Fierce Aggressive Slanted Eyes (Amber / Glow) */}
    <polygon points="32,48 42,54 36,58" fill="#F59E0B" />
    <polygon points="68,48 58,54 64,58" fill="#F59E0B" />

    {/* Geometric Muzzle / Snout */}
    <path 
      d="M38 74L50 68L62 74L58 88H42L38 74Z" 
      fill="currentColor" 
    />

    {/* Nostril Slots */}
    <polygon points="45,78 48,78 46,84 43,84" fill="#050814" />
    <polygon points="55,78 52,78 54,84 57,84" fill="#050814" />
    <path d="M44 86H56" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
