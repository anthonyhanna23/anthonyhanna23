import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Play, ArrowLeft } from "lucide-react";
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
const projects = [
  { 
    id: 1, 
    title: "Marc Rice", 
    category: "Real Estate", 
    image: marcRiceThumb, 
    client: "Instagram",
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

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="mx-auto container pt-20 md:pt-32 min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container mx-auto pt-8 px-6 mb-5 md:mb-15 text-left md:text-left">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-0 md:gap-8">
                <div>
                  <h1 className="text-[45px] md:text-8xl font-black uppercase tracking-tighter leading-[0.6] mb-0 md:mb-1 text-center md:text-left">
                    Selected <br /> <span className="text-stroke text-foreground">Work</span>
                  </h1>
                      <p className="mt-0 text-lg md:text-xl text-neutral-500 max-w-md text-center md:text-left md:mx-0">
                      A curation of our most impactful campaigns. Real results, real engagement.
                      </p>
                </div>
                
                
              </div>
            </div>

            <div className="container mx-auto px-6 pb-10 md:pb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-neutral-100">
                      <img 
                        src={project.image} 
                        alt={`${project.title} - Professional Social Media Videography and Photography in Columbus, Ohio`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white text-black p-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ArrowUpRight size={24} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-neutral-500 font-medium">{project.client}</p>
                      </div>
                      <span className="text-xs font-bold border border-black/10 px-2 py-1 rounded uppercase">
                        {project.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="folder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="container mx-auto px-6 pb-10 md:pb-32"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors mb-12 uppercase font-bold tracking-widest text-sm group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </button>

            <div className="mb-16">
              <h2 className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">Project Folder</h2>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">{selectedProject.title}</h1>
              <p className="text-xl text-neutral-500 max-w-xl">
                Campaign overview and delivered assets for <span className="text-black font-bold">{selectedProject.client}</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {selectedProject.videos.map((video, idx) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  {video.url ? (
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Open ${video.title}`}>
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-neutral-100 cursor-pointer">
                        <img 
                          src={video.thumb} 
                          alt={`${video.title} - Professional Social Media Videography and Photography in Columbus, Ohio`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Play size={24} fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-neutral-100 cursor-pointer">
                      <img 
                        src={video.thumb} 
                        alt={`${video.title} - Professional Social Media Videography and Photography in Columbus, Ohio`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <Play size={24} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  )}
                  <h3 className="font-bold uppercase tracking-tight text-lg">{video.title}</h3>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{video.type}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
