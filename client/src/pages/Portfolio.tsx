import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Play, ArrowLeft } from "lucide-react";
import fashionThumb from "@/assets/portfolio-fashion.png";
import techThumb from "@/assets/portfolio-tech.png";
import marcRiceThumb from "@/assets/IMG_8347.jpg";
import foodThumb from "@/assets/portfolio-food.png";

const projects = [
  { 
    id: 1, 
    title: "Marc Rice", 
    category: "Fashion", 
    image: marcRiceThumb, 
    client: "UrbanFit",
    videos: [
      { id: "v1", title: "Street Style 01", type: "Instagram Reel", thumb: fashionThumb },
      { id: "v2", title: "Summer Drop", type: "TikTok", thumb: fashionThumb },
      { id: "v3", title: "Brand Identity", type: "Campaign Video", thumb: fashionThumb }
    ]
  },
  { 
    id: 2, 
    title: "Cyber Deck Launch", 
    category: "Tech", 
    image: marcRiceThumb, 
    client: "NexTech",
    videos: [
      { id: "v4", title: "Product Reveal", type: "Product Ad", thumb: techThumb },
      { id: "v5", title: "UX Showcase", type: "Tech Demo", thumb: techThumb }
    ]
  },
  { 
    id: 3, 
    title: "Midnight Burger", 
    category: "Food", 
    image: foodThumb, 
    client: "Burger Lab",
    videos: [
      { id: "v6", title: "The Sizzle", type: "Promo", thumb: foodThumb },
      { id: "v7", title: "Behind the Scenes", type: "Process Video", thumb: foodThumb }
    ]
  },
  { 
    id: 4, 
    title: "Summer Vibes", 
    category: "Lifestyle", 
    image: fashionThumb, 
    client: "SunCo",
    videos: [
      { id: "v8", title: "Beach Day", type: "Lifestyle Reel", thumb: fashionThumb }
    ]
  },
  { 
    id: 5, 
    title: "AI Assistant", 
    category: "Tech", 
    image: techThumb, 
    client: "BotAI",
    videos: [
      { id: "v9", title: "AI Voice Demo", type: "Promo", thumb: techThumb }
    ]
  },
  { 
    id: 6, 
    title: "Coffee Culture", 
    category: "Food", 
    image: foodThumb, 
    client: "Bean & Brew",
    videos: [
      { id: "v10", title: "Morning Brew", type: "Cinematic Reel", thumb: foodThumb }
    ]
  },
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="pt-32 min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container mx-auto px-6 mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                    Selected <br /> <span className="text-stroke text-foreground">Work</span>
                  </h1>
                  <p className="text-xl text-neutral-500 max-w-md">
                    A curation of our most impactful campaigns. Real results, real engagement.
                  </p>
                </div>
                
                
              </div>
            </div>

            <div className="container mx-auto px-6 pb-32">
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
                        alt={project.title}
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
            className="container mx-auto px-6 pb-32"
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
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-neutral-100 cursor-pointer">
                    <img 
                      src={video.thumb} 
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                  </div>
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
