// Hardcoded work items, used as a silent fallback whenever the live Instagram
// feed (/api/feed) is unavailable or not configured yet. Facebook-only clients
// (Flores Landscaping) always render from here — the Instagram API doesn't
// cover Facebook Pages.
import marcRiceThumb1 from "@/assets/webp files/MarcRiceThumb1.webp";
import FloresThumb1 from "@/assets/webp files/Flores_Thumb1.webp";
import marcRiceThumb3 from "@/assets/webp files/IMG_8347.webp";
import marcRiceThumb from "@/assets/webp files/IMG_8347.webp";
import moreExperience from "@/assets/webp files/moreExperience.webp";
import beforeAndAfter from "@/assets/webp files/Screenshot2.webp";
import Evictions from "@/assets/webp files/Evictions.webp";
import mamdani from "@/assets/webp files/Mamdani.webp";
import landlords from "@/assets/webp files/Landlords.webp";
import BBrecruitmentVid from "@/assets/webp files/BBRecruitment.webp";
import joinBuilders from "@/assets/webp files/joinBuilders.webp";
import BBSocial from "@/assets/webp files/BB2025Social.webp";
import pitchingStartups from "@/assets/webp files/pitchingStartups.webp";
import flores from "@/assets/webp files/IMG_8348.webp";
import flores1 from "@/assets/webp files/Flores1.webp";
import flores2 from "@/assets/webp files/Flores2.webp";
import flores3 from "@/assets/webp files/Flores3.webp";
import flores4 from "@/assets/webp files/IMG_8349.webp";

export interface FallbackWorkItem {
  image: string;
  link: string;
  title: string;
}

export interface ProjectVideo {
  id: string;
  title: string;
  type: string;
  thumb: string;
  url: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  client: string;
  // Matches FeedItem.clientSlug; when set, the portfolio folder shows live
  // Instagram posts for this client (manual videos remain the fallback).
  clientSlug?: string;
  videos: ProjectVideo[];
}

export const workItems: FallbackWorkItem[] = [
  {
    image: marcRiceThumb1,
    link: "https://www.instagram.com/reel/DR4u5SyDQ_z/",
    title: "MARC RICE"
  },
  {
    image: FloresThumb1,
    link: "https://www.facebook.com/reel/2276250422826973",
    title: "FLORES LANDSCAPING"
  },
  {
    image: marcRiceThumb3,
    link: "https://www.instagram.com/reel/DSYD2_pEp0k/",
    title: "MARC RICE"
  }
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Marc Rice",
    category: "Real Estate",
    image: marcRiceThumb,
    client: "Instagram",
    clientSlug: "marc-rice",
    videos: [
      { id: "v1", title: "More Experience???", type: "Instagram Reel", thumb: moreExperience, url: "https://www.instagram.com/reel/DUWCu4kDj6k/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
      { id: "v2", title: "Before and After", type: "Instagram Reel", thumb: beforeAndAfter, url: "https://www.instagram.com/p/DTiikh9DSuw/" },
      { id: "v3", title: "Evictions...", type: "Instagram Reel", thumb: Evictions, url: "https://www.instagram.com/reel/DQW9dQajTEo/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
      { id: "v4", title: "Mamdani", type: "Instagram Reel", thumb: mamdani, url: "https://www.instagram.com/reel/DQ-AdeqEkD7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
      { id: "v5", title: "Landlords", type: "Instagram Reel", thumb: landlords, url: "https://www.instagram.com/p/DR4u5SyDQ_z/" }
    ]
  },
  {
    id: 2,
    title: "Business Builders",
    category: "Entrepreneurship",
    image: joinBuilders,
    client: "Instagram",
    videos: [
      { id: "v6", title: "Take Your Turn", type: "Recruitment Campaign", thumb: BBrecruitmentVid, url: "https://www.instagram.com/p/DN0iBgrwOti/" },
      { id: "v7", title: "2025 Social", type: "Instagram Reel", thumb: BBSocial, url: "https://www.instagram.com/reel/DIPEaEZR8CQ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" },
      { id: "v8", title: "Pitching Startups", type: "Instagram Reel", thumb: pitchingStartups, url: "https://www.instagram.com/reel/DI41WeIgRO4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" }
    ]
  },
  {
    id: 3,
    title: "Flores Landscaping",
    category: "Landscaping",
    image: flores,
    client: "Facebook",
    videos: [
      { id: "v9", title: "Patio Showcase", type: "Facebook Reel", thumb: flores, url: "https://www.facebook.com/share/r/1k3nqZSWri/?mibextid=wwXIfr" },
      { id: "v10", title: "Patio Construction", type: "Facebook Reel", thumb: flores4, url: "https://www.facebook.com/share/r/1AQdZSz9EZ/?mibextid=wwXIfr" },
      { id: "v11", title: "Star Wars AI", type: "Facebook Promo", thumb: flores2, url: "https://www.facebook.com/share/v/16sn1nKbj6/?mibextid=wwXIfr" },
      { id: "v12", title: "Patio Showcase", type: "Facebook Reel", thumb: flores1, url: "https://www.facebook.com/share/r/1Hqr6R8vNs/?mibextid=wwXIfr" },
      { id: "v13", title: "Neighborhood Sign Showcase", type: "Facebook Reel", thumb: flores3, url: "https://www.facebook.com/share/r/1AFuRd5uGK/?mibextid=wwXIfr" }
    ]
  },
];
