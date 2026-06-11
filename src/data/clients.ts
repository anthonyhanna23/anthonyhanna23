import marcRiceImage from "@/assets/webp files/IMG_8347.webp";

export interface ClientStory {
  slug: string;
  name: string;
  niche: string;
  location: string;
  services: string[];
  summary: string;
  testimonial: {
    quote: string;
    attribution: string;
    // While true, the UI renders a "testimonial coming soon" state instead of the quote —
    // never ship an invented quote under a real client's name.
    isPlaceholder: boolean;
  };
  image: string;
  // Instagram username links this client to the live feed; omit for Facebook-only clients
  // (the Instagram Login API doesn't cover Facebook Pages).
  igUsername?: string;
  portfolioProjectId: number;
}

export const clients: ClientStory[] = [
  {
    slug: "marc-rice",
    name: "Marc Rice",
    niche: "Real Estate",
    location: "Columbus, OH",
    services: ["Video Planning", "Filming & Editing", "Account Management", "Marketing Strategy"],
    summary:
      "Marc came to us to stand out in a crowded Columbus real estate market. We plan and film weekly short-form video, run his Instagram end to end, and build content around the questions his future clients are already asking.",
    testimonial: {
      quote: "",
      attribution: "Marc Rice, Realtor",
      isPlaceholder: true,
    },
    image: marcRiceImage,
    igUsername: "marcrice",
    portfolioProjectId: 1,
  },
];
