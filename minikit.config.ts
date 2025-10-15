const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
  },
  miniapp: {
    version: "1",
    name: "Baselifestyle", 
    subtitle: "Share Your Daily Wins", 
    description: "Post your daily activities and receive NFTs from supporters who love your content",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png?v=${Date.now()}`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png?v=${Date.now()}`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["social", "nft", "activity", "lifestyle", "community"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png?v=${Date.now()}`, 
    tagline: "Share your daily activities, earn NFTs",
    ogTitle: "Baselifestyle - Share Your Daily Wins",
    ogDescription: "Post your daily activities and receive NFTs from people who love your content",
    ogImageUrl: `${ROOT_URL}/blue-hero.png?v=${Date.now()}`,
  },
} as const;

