import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Play, TrendingUp, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import fashionThumb from "@/assets/portfolio-fashion.png";
import techThumb from "@/assets/portfolio-tech.png";
import foodThumb from "@/assets/portfolio-food.png";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Abstract Background" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Make It <br />
              <span className="text-stroke text-transparent hover:text-primary transition-all duration-500 cursor-default">Pop</span>
              <span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/80 max-w-xl mb-10 leading-relaxed">
              We engineer social media presence for brands that refuse to be boring. Specializing in high-impact Instagram Reels and TikToks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-primary hover:text-foreground transition-all flex items-center gap-2 group cursor-pointer inline-flex justify-center">
                  Start Growth 
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="border border-foreground/20 bg-white/50 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-white hover:border-transparent transition-all cursor-pointer inline-flex justify-center">
                  View Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Play className="w-12 h-12 mb-6 text-primary" />,
                title: "Content Production",
                desc: "We shoot, edit, and deliver high-voltage short-form video content that stops the scroll."
              },
              {
                icon: <TrendingUp className="w-12 h-12 mb-6 text-secondary" />,
                title: "Growth Strategy",
                desc: "Data-driven plans to explode your reach. We don't guess; we engineer virality."
              },
              {
                icon: <Users className="w-12 h-12 mb-6 text-pink-500" />,
                title: "Community Mgmt",
                desc: "Turning followers into fans. We handle the noise so you can focus on business."
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-black/5 bg-white p-10 rounded-2xl hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
              >
                {service.icon}
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Preview */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              Latest <br /><span className="text-primary">Drops</span>
            </h2>
            <Link href="/portfolio" className="hidden md:flex items-center gap-2 text-primary font-bold uppercase tracking-wide hover:gap-4 transition-all cursor-pointer">
                View All Work <ArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[fashionThumb, techThumb, foodThumb].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img 
                  src={img} 
                  alt="Work thumbnail" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div>
                    <p className="text-primary font-bold uppercase tracking-wider text-sm mb-2">Instagram Reel</p>
                    <h3 className="text-white text-2xl font-bold uppercase leading-none">Campaign {i + 1}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 md:hidden">
            <Link href="/portfolio" className="flex items-center gap-2 text-primary font-bold uppercase tracking-wide cursor-pointer">
                View All Work <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
