import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import fashionThumb from "@/assets/portfolio-fashion.png";
import techThumb from "@/assets/portfolio-tech.png";
import foodThumb from "@/assets/portfolio-food.png";

const projects = [
  { id: 1, title: "Neon Streetwear", category: "Fashion", image: fashionThumb, client: "UrbanFit" },
  { id: 2, title: "Cyber Deck Launch", category: "Tech", image: techThumb, client: "NexTech" },
  { id: 3, title: "Midnight Burger", category: "Food", image: foodThumb, client: "Burger Lab" },
  { id: 4, title: "Summer Vibes", category: "Lifestyle", image: fashionThumb, client: "SunCo" }, // reusing thumb for demo
  { id: 5, title: "AI Assistant", category: "Tech", image: techThumb, client: "BotAI" },
  { id: 6, title: "Coffee Culture", category: "Food", image: foodThumb, client: "Bean & Brew" },
];

export default function Portfolio() {
  return (
    <div className="pt-32 min-h-screen">
      <div className="container mx-auto px-6 mb-20">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
            <div>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Selected <br /> <span className="text-stroke text-foreground">Work</span>
                </h1>
                <p className="text-xl text-neutral-500 max-w-md">
                A curation of our most impactful campaigns. Real results, real engagement.
                </p>
            </div>
            
            <div className="flex gap-4">
                {['All', 'Fashion', 'Tech', 'Food'].map(cat => (
                    <button key={cat} className="px-4 py-2 border border-black/10 rounded-full text-sm uppercase font-bold hover:bg-black hover:text-white transition-colors">
                        {cat}
                    </button>
                ))}
            </div>
        </motion.div>
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
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden mb-6 bg-neutral-100">
                <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white text-black p-4 rounded-full">
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
    </div>
  );
}
