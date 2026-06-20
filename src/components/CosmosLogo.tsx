/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
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
  // Use import.meta.env.BASE_URL to resolve paths correctly in development and production
  const logoUrl = `${import.meta.env.BASE_URL || "/"}logo.png`;

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoUrl}
        alt="Cosmos Explorers Logo"
        className={`w-full h-full object-contain ${animate ? "animate-pulse" : ""}`}
        style={{ animationDuration: "4s" }}
      />
    </div>
  );
}
