/** Sample content for the per-module "Load sample data" demo buttons.
 *  Plain data only — each module wires this into its own store. */

export const DEMO_PLATFORMS: {
  name: string;
  summary: string;
  accountNoun: string;
  accountNounPlural: string;
  apiBaseUrl: string;
  credentialFields: { key: string; label: string; secret: boolean }[];
}[] = [
  {
    name: "LinkedIn",
    summary: "Company Pages and organization posts.",
    accountNoun: "Page",
    accountNounPlural: "Pages",
    apiBaseUrl: "https://api.linkedin.com/v2",
    credentialFields: [
      { key: "clientId", label: "Client ID", secret: false },
      { key: "clientSecret", label: "Client Secret", secret: true },
    ],
  },
  {
    name: "Instagram",
    summary: "Business accounts via the Graph API.",
    accountNoun: "Business account",
    accountNounPlural: "Business accounts",
    apiBaseUrl: "https://graph.facebook.com/v19.0",
    credentialFields: [
      { key: "appId", label: "App ID", secret: false },
      { key: "appSecret", label: "App Secret", secret: true },
    ],
  },
  {
    name: "Facebook",
    summary: "Facebook Pages managed by the business.",
    accountNoun: "Page",
    accountNounPlural: "Pages",
    apiBaseUrl: "https://graph.facebook.com/v19.0",
    credentialFields: [
      { key: "appId", label: "App ID", secret: false },
      { key: "appSecret", label: "App Secret", secret: true },
    ],
  },
  {
    name: "X",
    summary: "Organization accounts on X (Twitter).",
    accountNoun: "Account",
    accountNounPlural: "Accounts",
    apiBaseUrl: "https://api.x.com/2",
    credentialFields: [
      { key: "apiKey", label: "API Key", secret: false },
      { key: "apiKeySecret", label: "API Key Secret", secret: true },
    ],
  },
];

export const DEMO_ORGANIZATIONS: { name: string; description: string; industry: string }[] = [
  {
    name: "Acme Retail",
    description: "Multi-channel retailer selling home goods across North America.",
    industry: "Retail & E-commerce",
  },
  {
    name: "Northwind Traders",
    description: "Regional restaurant group with 40+ locations.",
    industry: "Food & Beverage",
  },
  {
    name: "Blue Ridge Health",
    description: "Community healthcare network and clinics.",
    industry: "Healthcare",
  },
];

export const DEMO_TEMPLATES: {
  label: string;
  description: string;
  iconKey: string;
  promptTemplate: string;
  defaultCta: string;
}[] = [
  {
    label: "Product Announcement",
    description: "Introduce a new product or feature.",
    iconKey: "megaphone",
    promptTemplate: "Announce a new product from {orgName} in an exciting, benefit-focused way.",
    defaultCta: "Shop now",
  },
  {
    label: "Promotion / Discount",
    description: "Advertise a sale, discount, or limited-time offer.",
    iconKey: "gift",
    promptTemplate: "Promote a limited-time discount from {orgName} that creates urgency.",
    defaultCta: "Save now",
  },
  {
    label: "Company Milestone",
    description: "Celebrate an anniversary, award, or achievement.",
    iconKey: "trophy",
    promptTemplate: "Celebrate a milestone or achievement for {orgName}.",
    defaultCta: "Learn more",
  },
  {
    label: "Job Opening",
    description: "Share an open role to attract candidates.",
    iconKey: "briefcase",
    promptTemplate: "Announce an open role at {orgName} to attract qualified candidates.",
    defaultCta: "Apply now",
  },
];

/** A 1x1 transparent PNG — stands in for a generated image when test data
 *  bypasses the AI image generation call (which needs the backend). */
export const DEMO_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export const DEMO_POST_CONTENT: {
  contentTypeLabel: string;
  prompt: string;
  caption: string;
  hashtags: string[];
}[] = [
  {
    contentTypeLabel: "Product Announcement",
    prompt: "Announce our new spring collection launching this week.",
    caption:
      "Our new spring collection has arrived! Fresh styles, sustainable materials, and prices you'll love. Shop the full line today. 🌸",
    hashtags: ["#NewArrivals", "#SpringCollection", "#ShopNow"],
  },
  {
    contentTypeLabel: "Promotion / Discount",
    prompt: "Promote a weekend flash sale, 20% off everything.",
    caption: "This weekend only: take 20% off your entire order. No code needed — just add to cart and save. ⏰",
    hashtags: ["#FlashSale", "#WeekendDeal", "#LimitedTime"],
  },
  {
    contentTypeLabel: "Company Milestone",
    prompt: "Celebrate reaching 10,000 customers served.",
    caption: "We just crossed 10,000 happy customers! Thank you for trusting us — here's to the next 10,000. 🎉",
    hashtags: ["#Milestone", "#ThankYou", "#Grateful"],
  },
];
