export type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** Public link; omitted for unreleased work, which the modal marks as coming soon. */
  href?: string;
  category: "dev" | "design";
  accent: string;
  featured?: boolean;
  /** Still in development; badged "Upcoming" on its card and in the case study. */
  upcoming?: boolean;
  /** Service-style label the work filter groups by. */
  kind?: "Web Development" | "iOS Development" | "Software Development" | "Design";
  /** Headline number or keyword shown as a pill on featured stories. */
  stat?: { value: string; label: string };
  /** CSS object-position for the cover when it gets cropped (default: top centre). */
  focus?: string;
  /** Long cover shown in the case-study modal. */
  image: string;
  /** Square 1:1 image for the gallery card; falls back to `image` when missing. */
  preview?: string;
  /** Short bullet list shown in the case-study modal. */
  highlights?: string[];
  /** Long-form write-up sections; rendered in the modal when present. */
  sections?: { heading: string; body: string }[];
};

export const projects: Project[] = [
  {
    id: "elovatesr",
    title: "Elovate SR",
    subtitle: "Warzone rank tracker",
    description:
      "Full-stack Call of Duty: Warzone rank tracker with a live leaderboard, cloud-synced progression calculator, and OCR-powered stat extraction from match screenshots.",
    tags: ["Next.js", "TypeScript", "Supabase", "Google Cloud Vision"],
    href: "https://elovatesr.com",
    category: "dev",
    accent: "#EAB308",
    kind: "Web Development",
    stat: {
      value: "OCR",
      label: "Stat extraction from match screenshots, alongside a live leaderboard",
    },
    focus: "0% 50%",
    image: "/images/elovate-long.jpg",
    preview: "/images/elovate-square-cover.jpg",
    highlights: [
      "Live leaderboard",
      "Cloud-synced progression calculator",
      "OCR-powered stat extraction from match screenshots",
    ],
  },
  {
    id: "wkcc-perks",
    title: "WKCC Perks",
    subtitle: "iOS application",
    description:
      "Built from the ground up in Swift and SwiftUI — a perks directory connecting chamber members with 50 local partner businesses.",
    tags: ["Swift", "SwiftUI", "REST APIs", "iOS"],
    href: "https://apps.apple.com/us/app/wkcc-perks/id6795765162",
    category: "dev",
    accent: "#3B82F6",
    featured: true,
    kind: "iOS Development",
    stat: {
      value: "50",
      label: "Local partner businesses in the perks directory",
    },
    image: "/images/wkcc-long.png",
    preview: "/images/wkcc-square-cover.png",
    highlights: [
      "Built from the ground up in Swift and SwiftUI",
      "Perks directory for chamber members",
      "200+ local partner businesses",
    ],
  },
  {
    id: "vaultair",
    title: "Vaultair",
    subtitle: "Password manager",
    description:
      "Encrypted, local-first desktop vault for gaming and online accounts, with passwords, MFA codes and an identity relationship map. Live on Windows, with Mac support coming soon.",
    tags: ["Rust", "TypeScript", "Tauri", "SQLCipher", "Argon2id", "GitHub Actions"],
    href: "https://github.com/bubb4rd/vaultair",
    category: "dev",
    accent: "#1E293B",
    kind: "Software Development",
    image: "/images/vaultair-long.jpg",
    preview: "/images/vaultair-square-cover.jpg",
    highlights: [
      "Encrypted storage with SQLCipher, Argon2id and integrity-checked backups",
      "Passwords, TOTP and recovery codes in one searchable vault",
      "Relationship map connecting identities, emails and accounts",
      "Windows Hello unlock, auto-lock and clipboard protection",
      "Rust and frontend test suites with CI on GitHub Actions",
    ],
  },
  {
    id: "gliide",
    title: "Gliide",
    subtitle: "Job search app",
    description:
      "In-house job tracking, resume tailoring and application powerhouse for Mac. Built for students, early-career developers and anyone finding their career.",
    tags: ["Rust", "Tauri", "Svelte", "TypeScript", "SQLite", "Typst"],
    category: "dev",
    accent: "#0E7490",
    upcoming: true,
    kind: "Software Development",
    image: "/images/gliide-app-long.jpg",
    preview: "/images/gliide-app-square-cover.jpg",
    highlights: [
      "Fit scoring against any job posting",
      "Honest resume edits you accept with a click",
      "One-page, ATS-readable PDF export",
      "Application tracker with a daily job feed",
      "Mac first, with Windows and iOS planned",
    ],
  },
  {
    id: "pantrypulse",
    title: "PantryPulse",
    subtitle: "Recipe tracking app",
    description:
      "Full-stack recipe app for discovering meals from available ingredients.",
    tags: ["React", "Tailwind CSS", "Firebase", "REST APIs"],
    href: "https://pantry-pulse.netlify.app",
    category: "dev",
    accent: "#8B5CF6",
    kind: "Web Development",
    image:
      "/images/pantrypulse-cover.png",
    preview: "/images/pantrypulse-square-cover.png",
    highlights: [
      "Discover meals from the ingredients you already have",
      "Full-stack build on React, Tailwind CSS and Firebase",
    ],
  },
  {
    id: "borgwithus",
    title: "Borgwithus",
    subtitle: "Cocktail generator",
    description: "A dynamic drink name generator with 300+ monthly users.",
    tags: ["React", "CSS", "HTML", "Netlify"],
    href: "https://borgwithus.xyz",
    category: "dev",
    accent: "#06B6D4",
    kind: "Web Development",
    image:
      "/images/BORGWITHUS.png",
  },
  {
    id: "bubbard",
    title: "BUBBARD Design",
    subtitle: "Freelance graphic design",
    description:
      "Digital graphics and visual content engaging 100+ users per post. Direct client collaboration to deliver designs aligned with brand vision across social platforms.",
    tags: ["Adobe Creative Suite", "Figma", "Social Media"],
    href: "https://be.net/bubbard/",
    category: "design",
    accent: "#F472B6",
    kind: "Design",
    stat: { value: "100+", label: "Users engaged per post" },
    image: "/images/bubbard-design-project.png",
  }
];
