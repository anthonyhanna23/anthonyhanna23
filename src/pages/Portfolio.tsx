import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, ArrowLeft } from "lucide-react";
import { projects, type ProjectVideo } from "@/data/fallbackWork";
import { useInstagramFeed } from "@/hooks/useInstagramFeed";

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  // Deep-link support: /portfolio?project=<id> opens that project folder directly
  const linkedProject = projects.find((p) => String(p.id) === searchParams.get("project")) ?? null;
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(linkedProject);
  const { items: feedItems, isLive } = useInstagramFeed();

  // Projects connected to an Instagram account show the live (admin-filtered)
  // feed; the hardcoded videos list is the fallback. Facebook clients have no
  // clientSlug and always render their manual list.
  const liveVideos: ProjectVideo[] =
    selectedProject?.clientSlug && isLive
      ? feedItems
          .filter((item) => item.clientSlug === selectedProject.clientSlug)
          .map((item) => ({
            id: item.id,
            title: item.caption ? `${item.caption.slice(0, 50)}${item.caption.length > 50 ? "…" : ""}` : "Instagram Post",
            type: item.mediaType === "VIDEO" ? "Instagram Reel" : "Instagram Post",
            thumb: item.thumbnailUrl,
            url: item.permalink,
          }))
      : [];
  const displayVideos = liveVideos.length > 0 ? liveVideos : selectedProject?.videos ?? [];

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
                  <h1 className="text-[10vw] md:text-8xl font-black uppercase tracking-tighter leading-[0.85] md:leading-[0.6] mb-3 md:mb-1 text-center md:text-left">
                    Selected <br /><span className="md:hidden">Work</span><span className="hidden md:inline text-stroke text-foreground">Work</span>
                  </h1>
                      <p className="mt-0 text-lg md:text-xl text-neutral-500 max-w-md text-center md:text-left mx-auto md:mx-0">
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
              {displayVideos.map((video, idx) => (
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
