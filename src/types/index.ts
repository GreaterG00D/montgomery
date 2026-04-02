export interface NavItem {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  tag?: string;
}

export interface Social {
  label: string;
  href: string;
  icon: "youtube" | "instagram" | "tiktok" | "cameo" | "twitter" | "twitch";
}

export interface ScrollProgress {
  progress: number;
  velocity: number;
  direction: 1 | -1;
}
