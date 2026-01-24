import { motion } from "framer-motion";
import team1 from "@/assets/team-1.png";
import team2 from "@/assets/team-2.png";

export default function About() {
  return (
    <div className="pt-20">
      <section className="py-20 md:py-32 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-12">
            We are <br /> <span className="text-primary">Picco Media.</span>
          </h1>
          <p className="text-xl md:text-3xl font-medium leading-relaxed mb-8">
            We are a collective of digital natives, creators, and strategists obsessed with the scroll. 
          </p>
          <div className="text-lg text-neutral-500 max-w-2xl space-y-6 leading-relaxed">
            <p>
              Founded in 2024, Picco Media started with a simple premise: Most brands are boring on social media because they treat it like a billboard, not a conversation.
            </p>
            <p>
              We fix that. We don't just post; we perform. We understand the algorithm because we live in it. From scripting to shooting, editing to publishing, we handle the entire pipeline of attention.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-neutral-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">The Squad</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
            {[
              { name: "Alex Rivera", role: "Creative Director", img: team1 },
              { name: "Sarah Chen", role: "Head of Strategy", img: team2 }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-neutral-200">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">{member.name}</h3>
                <p className="text-primary font-medium uppercase tracking-wide text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Numbers */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Views Generated", value: "50M+" },
              { label: "Clients Happy", value: "32" },
              { label: "Coffees Consumed", value: "∞" },
              { label: "Awards Won", value: "4" },
            ].map((stat, i) => (
              <div key={i} className="border-l border-white/20 p-8">
                <div className="text-4xl md:text-6xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-widest text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
