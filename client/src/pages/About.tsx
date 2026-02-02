import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Linkedin, Instagram } from "lucide-react";
import team1 from "@/assets/team-1.png";
import team2 from "@/assets/team-2.png";

const team = [
  {
    name: "Charlie Dumo",
    role: "CO-FOUNDER & CEO",
    expertise: "F&B E-commerce Strategy",
    quote: "I built a food brand from scratch. Now I help others do the same, faster.",
    bio: "Charlie founded Charlie's Crunch, a dessert brand that scaled from concept to nationwide distribution. He learned food & beverage e-commerce through real-world experience—every challenge, every optimization, every growth milestone. Now he applies that hands-on knowledge to help F&B brands scale efficiently.",
    img: team1,
  },
  {
    name: "Alex Rivera",
    role: "CREATIVE DIRECTOR",
    expertise: "Visual Storytelling & Short-form Content",
    quote: "Content is currency. We make sure your brand is the richest in the room.",
    bio: "Alex has spent the last decade mastering the art of the 'scroll-stop'. With a background in cinematic production and social psychology, he bridges the gap between high-end aesthetics and algorithmic performance.",
    img: team2,
  }
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextMember = () => setActiveIndex((prev) => (prev + 1) % team.length);
  const prevMember = () => setActiveIndex((prev) => (prev - 1 + team.length) % team.length);

  return (
    <div className="pt-20 min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <section className="py-20 md:py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4">[ THE TEAM ]</p>
          <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
            Meet the <span className="text-stroke text-white">Team</span>
          </h1>
          <p className="text-neutral-500 mt-6 max-w-xl mx-auto font-medium">
            Social media specialists building the bridge from content to conversion success.
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
            >
              {/* Photo Side */}
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border-2 border-primary/20 shadow-[0_0_50px_-12px_rgba(191,255,0,0.3)]">
                <img 
                  src={team[activeIndex].img} 
                  alt={team[activeIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info Side */}
              <div className="space-y-8">
                <div>
                  <p className="text-primary font-bold tracking-widest text-xs mb-2 uppercase">[ {team[activeIndex].role} ]</p>
                  <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-4">{team[activeIndex].name}</h2>
                  <p className="text-neutral-400 font-bold uppercase text-xs tracking-wider">
                    Expertise: <span className="text-white">{team[activeIndex].expertise}</span>
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-primary">
                  <p className="text-xl md:text-2xl font-display italic font-medium leading-tight">
                    "{team[activeIndex].quote}"
                  </p>
                </div>

                <p className="text-neutral-400 leading-relaxed text-sm md:text-base max-w-lg">
                  {team[activeIndex].bio}
                </p>

                <div className="flex gap-4">
                  <a href="#" className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-800 transition-colors">
                    <Linkedin size={16} className="text-primary" /> LinkedIn
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-800 transition-colors">
                    <Instagram size={16} className="text-primary" /> Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-6 mt-16 md:mt-24">
            <div className="flex items-center gap-4">
              <button 
                onClick={prevMember}
                className="p-3 rounded-full border border-neutral-800 hover:border-primary hover:text-primary transition-all active:scale-95"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                {team.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-12 bg-primary' : 'w-2 bg-neutral-800'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextMember}
                className="p-3 rounded-full border border-neutral-800 hover:border-primary hover:text-primary transition-all active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Avatars */}
            <div className="flex gap-3">
              {team.map((member, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-primary scale-110 shadow-[0_0_15px_rgba(191,255,0,0.5)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Dark Theme */}
      <section className="py-32 bg-neutral-950 border-t border-neutral-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Views Generated", value: "50M+" },
              { label: "Clients Happy", value: "32" },
              { label: "Viral Reels", value: "150+" },
              { label: "Awards Won", value: "4" },
            ].map((stat, i) => (
              <div key={i} className="p-8">
                <div className="text-4xl md:text-6xl font-display font-black text-primary mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
