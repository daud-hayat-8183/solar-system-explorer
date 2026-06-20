/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface CosmosLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  animate?: boolean;
}

export default function CosmosLogo({
  className = "",
  size = "100%",
  showText = true,
  animate = true,
}: CosmosLogoProps) {
  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_30px_rgba(99,102,241,0.25)]"
      >
        <defs>
          {/* Main Glow Filters */}
          <filter id="cosmos-sun-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur1" />
            <feGaussianBlur stdDeviation="30" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="cosmos-blue-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="cosmos-portal-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <radialGradient id="cosmos-space-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#080c25" />
            <stop offset="65%" stopColor="#03040c" />
            <stop offset="100%" stopColor="#010205" />
          </radialGradient>

          <radialGradient id="cosmos-galaxy-glow" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cosmos-sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="15%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>

          <linearGradient id="cosmos-book-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#312e81" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="cosmos-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="65%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <linearGradient id="cosmos-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <radialGradient id="cosmos-saturn-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          <radialGradient id="cosmos-earth-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#172554" />
          </radialGradient>

          <radialGradient id="cosmos-jupiter-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#431407" />
          </radialGradient>

          <linearGradient id="cosmos-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#fdba74" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
          </linearGradient>

          {/* Text Gradients */}
          <linearGradient id="cosmos-text-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Rim Frame */}
        <circle
          cx="500"
          cy="480"
          r="415"
          stroke="url(#cosmos-book-grad)"
          strokeWidth="10"
          className="opacity-90"
        />
        <circle
          cx="500"
          cy="480"
          r="420"
          stroke="#0f172a"
          strokeWidth="3"
        />
        <circle
          cx="500"
          cy="480"
          r="410"
          stroke="#000000"
          strokeWidth="3.5"
        />

        {/* Clip Path for the interior space above the book */}
        <g>
          {/* Space Background */}
          <circle cx="500" cy="480" r="405" fill="url(#cosmos-space-bg)" />

          {/* Deep Nebula Cosmic Glow at Top */}
          <circle cx="500" cy="300" r="300" fill="url(#cosmos-galaxy-glow)" pointerEvents="none" />

          {/* Spiral Galaxy Graphic */}
          <g transform="translate(500, 240) rotate(-20) scale(1.15)">
            <ellipse
              cx="0"
              cy="0"
              rx="180"
              ry="75"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeDasharray="2 10"
              className={animate ? "animate-spin" : ""}
              style={{ animationDuration: "50s", transformOrigin: "0px 0px" }}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="140"
              ry="55"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
              strokeDasharray="1 8"
              opacity="0.85"
              className={animate ? "animate-spin" : ""}
              style={{ animationDuration: "35s", transformOrigin: "0px 0px", animationDirection: "reverse" }}
            />
            {/* Swirling Galaxy Center */}
            <ellipse
              cx="0"
              cy="0"
              rx="55"
              ry="22"
              fill="url(#cosmos-sun-grad)"
              opacity="0.3"
              filter="url(#cosmos-sun-glow)"
              className={animate ? "animate-pulse" : ""}
              style={{ animationDuration: "4s" }}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="75"
              ry="30"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.75"
              opacity="0.5"
            />
          </g>

          {/* Constellation Starry Dots */}
          <g opacity="0.85">
            <circle cx="300" cy="180" r="1.5" fill="#ffffff" />
            <circle cx="340" cy="220" r="2" fill="#93c5fd" />
            <circle cx="210" cy="290" r="2.5" fill="#ffffff" />
            <circle cx="260" cy="310" r="1" fill="#ffffff" />
            <circle cx="700" cy="190" r="2" fill="#ffffff" />
            <circle cx="680" cy="260" r="1.5" fill="#fef08a" />
            <circle cx="770" cy="245" r="3" fill="#ffffff" className={animate ? "animate-pulse" : ""} style={{ animationDuration: "2s" }} />
            <circle cx="790" cy="320" r="2" fill="#93c5fd" />
            <circle cx="210" cy="410" r="1.5" fill="#ffffff" />
            <circle cx="160" cy="350" r="2" fill="#ffffff" />
            <circle cx="830" cy="390" r="1.5" fill="#ffffff" />
          </g>

          {/* Concentric Elliptical Orbit Paths */}
          <g opacity="0.25">
            <ellipse cx="500" cy="480" rx="120" ry="105" fill="none" stroke="#fbbf24" strokeWidth="1.25" />
            <ellipse cx="500" cy="480" rx="190" ry="155" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            <ellipse cx="500" cy="480" rx="270" ry="210" fill="none" stroke="#fbbf24" strokeWidth="1.25" />
            <ellipse cx="500" cy="480" rx="360" ry="265" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>

          {/* Central Radiative Sun */}
          <g transform="translate(500, 480)">
            {/* External Solar Flare Corona */}
            <circle
              cx="0"
              cy="0"
              r="76"
              fill="url(#cosmos-sun-grad)"
              opacity="0.2"
              filter="url(#cosmos-portal-glow)"
              className={animate ? "animate-pulse" : ""}
              style={{ animationDuration: "5s" }}
            />
            <circle
              cx="0"
              cy="0"
              r="48"
              fill="url(#cosmos-sun-grad)"
              filter="url(#cosmos-sun-glow)"
            />
            {/* Solar Surface Details */}
            <circle cx="0" cy="0" r="38" fill="url(#cosmos-sun-grad)" />
          </g>

          {/* Planets Placed beautifully on Orbits */}
          
          {/* Inner Planet (Mercury) */}
          <circle cx="430" cy="415" r="9" fill="#94a3b8" stroke="#000" strokeWidth="0.5" />
          
          {/* Earth-like sphere with high rendering */}
          <g transform="translate(500, 580)">
            <circle cx="0" cy="0" r="18" fill="url(#cosmos-earth-grad)" stroke="#090d1f" strokeWidth="1.5" />
            {/* Lands silhouettes */}
            <path d="M-8 -6 C-12 -3, -11 5, -6 7 C-2 3, 2 5, 8 2 C12 -6, 2 -12, -8 -6 Z" fill="#34d399" opacity="0.65" />
            <path d="M4 6 C2 10, -2 12, -4 8 C-3 6, 2 4, 4 6 Z" fill="#34d399" opacity="0.65" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Small Moon orbiting Earth */}
          <circle cx="530" cy="598" r="4.5" fill="#cbd5e1" stroke="#090d1f" strokeWidth="0.5" />

          {/* Mars-like Planet */}
          <circle cx="615" cy="460" r="14" fill="#f87171" stroke="#000" strokeWidth="1" />
          <circle cx="611" cy="454" r="3" fill="#991b1b" opacity="0.4" />
          
          {/* Jupiter Banded Giant with Ring Core */}
          <g transform="translate(360, 430)">
            <circle cx="0" cy="0" r="34" fill="url(#cosmos-jupiter-grad)" stroke="#000000" strokeWidth="2.5" />
            {/* Strips details */}
            <path d="M-32 -10 L 32 -10" stroke="#fcd34d" strokeWidth="4" opacity="0.3" strokeLinecap="round" />
            <path d="M-33 0 L 33 0" stroke="#7c2d12" strokeWidth="5" opacity="0.5" strokeLinecap="round" />
            <path d="M-31 12 L 31 12" stroke="#ea580c" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
            {/* Great Red Spot */}
            <circle cx="12" cy="6" r="6" fill="#991b1b" opacity="0.8" />
          </g>

          {/* Saturn planet with custom angular tilted rings */}
          <g transform="translate(680, 510)">
            {/* Saturn back ring segment */}
            <ellipse
              cx="0"
              cy="0"
              rx="55"
              ry="18"
              fill="none"
              stroke="url(#cosmos-ring)"
              strokeWidth="8"
              transform="rotate(-15)"
              opacity="0.8"
            />
            {/* Planet Body */}
            <circle cx="0" cy="0" r="26" fill="url(#cosmos-saturn-grad)" stroke="#000000" strokeWidth="2" />
            {/* Saturn front ring segment overlay */}
            <path
              d="M-48 10 C-35 22, 35 22, 48 10"
              fill="none"
              stroke="url(#cosmos-ring)"
              strokeWidth="8"
              transform="rotate(-15)"
            />
          </g>

          {/* Uranus / Neptune (Blue ice giant) */}
          <circle cx="715" cy="365" r="20" fill="url(#cosmos-earth-grad)" stroke="#000" strokeWidth="1.5" />
          <circle cx="280" cy="275" r="12" fill="#5095d9" stroke="#000" strokeWidth="1" />
        </g>

        {/* The Open Book Vector Path Frame - beautifully frames the celestial sphere */}
        <g id="open-book-frame" filter="url(#cosmos-blue-glow)">
          {/* Inner glowing book shield */}
          <path
            d="M 170 560 
               C 340 600, 440 560, 500 620 
               C 560 560, 660 600, 830 560 
               L 830 568 
               C 660 608, 565 568, 500 627
               C 435 568, 340 608, 170 568 Z"
            fill="url(#cosmos-book-grad)"
          />

          {/* Bright neon edge highlights */}
          <path
            d="M 166 558 
               C 340 602, 442 562, 500 622 
               C 558 562, 660 602, 834 558"
            stroke="#a5b4fc"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          <path
            d="M 175 566 
               C 340 608, 444 568, 500 628 
               C 556 568, 660 608, 825 566"
            stroke="#1d4ed8"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* -------------------- TEXT BRANDING SEGMENT -------------------- */}
        
        {/* Cosmos Main Heading */}
        <g transform="translate(500, 715)">
          {/* Text Back Glow */}
          <text
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="100"
            fontWeight="800"
            letterSpacing="12"
            fill="#1e1b4b"
            filter="url(#cosmos-sun-glow)"
            className="select-none font-bold"
            opacity="0.8"
          >
            COSMOS
          </text>
          
          {/* Textured Metal Text */}
          <text
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="100"
            fontWeight="800"
            letterSpacing="12"
            fill="url(#cosmos-metal-grad)"
            stroke="#312e81"
            strokeWidth="2.5"
            className="select-none font-bold"
          >
            COSMOS
          </text>

          {/* Electric blue horizontal split effect */}
          <text
            textAnchor="middle"
            fontFamily="'Cinzel', serif"
            fontSize="100"
            fontWeight="800"
            letterSpacing="12"
            fill="none"
            stroke="#818cf8"
            strokeWidth="1.2"
            className="select-none font-bold"
            opacity="0.95"
          >
            COSMOS
          </text>
        </g>

        {/* "EXPLORERS" Gold Text with Side Wings */}
        <g transform="translate(500, 780)">
          {/* Spacing alignment lines on left and right */}
          <line x1="-310" y1="-8" x2="-140" y2="-8" stroke="url(#cosmos-gold-grad)" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="140" y1="-8" x2="310" y2="-8" stroke="url(#cosmos-gold-grad)" strokeWidth="4.5" strokeLinecap="round" />
          
          <text
            textAnchor="middle"
            fontFamily="'Space Grotesk', 'Plus Jakarta Sans', sans-serif"
            fontSize="34"
            fontWeight="700"
            letterSpacing="16"
            fill="url(#cosmos-gold-grad)"
            className="uppercase tracking-widest font-extrabold"
          >
            EXPLORERS
          </text>
        </g>

        {/* Subtitle - "LEARN • DISCOVER • EXPLORE" */}
        <g transform="translate(500, 830)">
          <text
            textAnchor="middle"
            fontFamily="'Space Grotesk', sans-serif"
            fontSize="18"
            fontWeight="600"
            letterSpacing="8"
            fill="#a5b4fc"
            className="tracking-widest"
          >
            LEARN • DISCOVER • EXPLORE
          </text>
        </g>

        {/* The 4-point compass/star icon at the absolute bottom */}
        <g transform="translate(500, 895)">
          {/* Star Back Glow */}
          <circle cx="0" cy="0" r="14" fill="#3b82f6" opacity="0.3" filter="url(#cosmos-sun-glow)" />

          {/* Compass Star Wings */}
          {/* Vertical points */}
          <path d="M 0,-34 L 5,-10 L 34,0 L 5,10 L 0,34 L -5,10 L -34,0 L -5,-10 Z" fill="url(#cosmos-blue-grad)" />
          <path d="M 0,-34 L 2.5,-6 L 34,0 L 2.5,6 L 0,34 L -2.5,6 L -34,0 L -2.5,-6 Z" fill="#ffffff" />
          
          {/* Center glowing dot */}
          <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
          <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
}
