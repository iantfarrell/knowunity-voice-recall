import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Dev-only build-activity indicator badge — pure tooling chrome, not part
  // of the app UI. Left on it pollutes every screenshot taken against the
  // dev server with a floating "N" badge that has no equivalent in Figma or
  // production. Disabled so visual QA screenshots match what actually ships.
  devIndicators: false,
};

export default nextConfig;
