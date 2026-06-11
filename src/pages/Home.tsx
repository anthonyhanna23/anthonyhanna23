import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Clapperboard, Video, Target, AtSign, Handshake } from "lucide-react";
import { ClientStories } from "@/components/home/ClientStories";
import { useInstagramFeed } from "@/hooks/useInstagramFeed";
import { workItems as fallbackWorkItems } from "@/data/fallbackWork";
import reel1 from '../assets/webp files/IMG_8346.webp'
import reel2 from '../assets/webp files/IMG_8347.webp'
import reel3 from '../assets/webp files/IMG_8348.webp'
import reel4 from '../assets/webp files/Flores_Thumb1.webp'
import reel5 from '../assets/webp files/Screenshot1.webp'
import reel6 from '@/assets/webp files/Screenshot2.webp'

const thumbnails = [
  reel6,
  reel2,
  reel3,
  reel4,
  reel5,
  reel1
];

export default function Home() {
  // Live Instagram posts when available; hardcoded items otherwise.
  const { items: feedItems, isLive } = useInstagramFeed();
  const workItems = isLive
    ? feedItems.slice(0, 3).map((item) => ({
        image: item.thumbnailUrl,
        link: item.permalink,
        title: item.clientName.toUpperCase(),
      }))
    : fallbackWorkItems;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-auto md:min-h-screen flex items-start md:items-center pt-48 md:pt-20">
        {/* Animated Background Grid - Vertical/Reels Style */}
        <div className="absolute inset-0 z-0 bg-gray-50 overflow-hidden flex flex-col justify-center gap-5">

          {/* Row 1: Scrolls Left */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex gap-5 min-w-max"
          >
            {[...thumbnails,...thumbnails].map((src, i) => (
              <img key={i} src={src} alt="Reel thumbnail" className="w-[200px] h-[350px] object-cover rounded-lg opacity-90 grayscale-[0%] hover:grayscale-0 hover:scale-105 transition-all duration-300" />
            ))}
          </motion.div>

          {/* Row 2: Scrolls Right */}
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
            className="flex gap-5 min-w-max"
          >
            {[...thumbnails,...thumbnails].map((src, i) => (
              <img key={i} src={src} alt="Reel thumbnail" className="w-[200px] h-[350px] object-cover rounded-lg opacity-90 grayscale-[0%] hover:grayscale-0 hover:scale-105 transition-all duration-300" />
            ))}
          </motion.div>

          {/* Row 3: Scrolls Left */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
            className="flex gap-5 min-w-max"
          >
            {[...thumbnails,...thumbnails].map((src, i) => (
              <img key={i} src={src} alt="Reel thumbnail" className="w-[200px] h-[350px] object-cover rounded-lg opacity-90 grayscale-[0%] hover:grayscale-0 hover:scale-105 transition-all duration-300" />
            ))}
          </motion.div>

          {/* THE FIX: Added 'pointer-events-none' so mouse passes through to images */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-white from-5% via-white/50 via-30% md:via-60% to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-2 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-[76px] md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 [text-shadow:0px_4px_10px_rgba(0,0,0,0.5)]">
              Make It <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}   // Starts invisible and slightly lower down
                animate={{ opacity: 1, y: 0 }}    // Fades to visible and slides into place
                transition={{
                  delay: 1.0,                     // Waits 1.8 seconds
                  duration: 1,                    // Takes 1 second to fade in (smooth)
                  ease: "easeOut"                 // No bounce, just a smooth landing
                }}
                className="inline-block"
              >
                <span className="text-stroke text-transparent hover:text-primary transition-all duration-500 cursor-default"></span>
                <span className="text-primary [text-shadow:0px_4px_10px_rgba(0,0,0,0.5)]">POP.</span>
              </motion.span>
            </h1>
                  <p className="text-xl md:text-2xl font-medium text-black max-w-sm md:max-w-3xl mb-10 leading-relaxed drop-shadow-lg text-left ml-5 md:ml-0">
              We plan, film, and edit <b>scroll-stopping video</b> — and run your strategy and accounts — so Columbus businesses like yours turn followers into <b>paying customers.</b>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-primary hover:text-foreground transition-all flex items-center gap-2 group cursor-pointer inline-flex justify-center">
                  Book a Free Call
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="border border-foreground/20 bg-white/50 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg uppercase tracking-wide hover:bg-white hover:border-transparent transition-all cursor-pointer inline-flex justify-center">
                  View Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 md:py-16 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-10 md:mb-14">
            <h2 className="text-[48px] md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              What We <span className="text-foreground">Do</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-500 mt-4 max-w-2xl ml-2">
              Everything your social media needs, handled end to end. One goal: more customers for your business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Clapperboard className="w-12 h-12 mb-6 text-primary" />,
                title: "Video Planning",
                desc: "We map out content ideas built around what your future customers are actually searching for — so every video has a job to do."
              },
              {
                icon: <Video className="w-12 h-12 mb-6 text-secondary" />,
                title: "Filming & Editing",
                desc: "We show up, shoot, and edit scroll-stopping short-form video that makes people stop, watch, and remember your business."
              },
              {
                icon: <Target className="w-12 h-12 mb-6 text-pink-500" />,
                title: "Marketing Strategy",
                desc: "A clear plan with real goals — reach, leads, customers — and the numbers to back it up. We don't guess; we engineer growth."
              },
              {
                icon: <AtSign className="w-12 h-12 mb-6 text-primary" />,
                title: "Account Management",
                desc: "We run your Instagram, YouTube, and more — posting, captions, comments — so your accounts stay active while you run your business."
              },
              {
                icon: <Handshake className="w-12 h-12 mb-6 text-secondary" />,
                title: "1-on-1 Partnership",
                desc: "We meet with you directly, track what's working, and adjust until the goal is hit: more customers walking through your door."
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-primary p-10 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4 leading-[0.95]">Ready to grow?</h3>
                <p className="text-black/70 leading-relaxed font-medium">
                  Free intro call. We'll tell you exactly what we'd do for your business.
                </p>
              </div>
              <Link
                to="/contact"
                className="mt-8 bg-foreground text-background px-6 py-3.5 rounded-full font-bold text-base uppercase tracking-wide hover:bg-white hover:text-foreground transition-all inline-flex items-center justify-center gap-2 group"
              >
                Book a Free Call
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Stories */}
      <ClientStories />

      {/* Featured Work Preview */}
      <section className="py-8 md:py-16 bg-foreground text-background">
        <div className="container mx-auto px-7">
          <div className="flex justify-between items-end mb-7 md:mb-16">
            <h2 className="text-[55px] md:text-7xl font-black uppercase tracking-tighter text-center md:text-left leading-[0.9]">
              Latest <br /><span className="text-primary">Drops</span>
            </h2>
            <Link to="/portfolio" className="hidden md:flex items-center gap-2 text-primary font-bold uppercase tracking-wide hover:gap-4 transition-all cursor-pointer">
                View All Work <ArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {workItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.link}          // The link from your list
                target="_blank"           // Opens in new tab
                rel="noopener noreferrer" // Security best practice
                whileHover={{ y: -10 }}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer block"
              >
                <img
                  src={item.image}
                  alt="Work thumbnail"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div>
                    <p className="text-primary font-bold uppercase tracking-wider text-sm mb-2">Instagram Reel</p>
                    <h3 className="text-white text-2xl font-bold uppercase leading-none">{item.title}</h3>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <div className="mt-12 md:hidden">
            <Link to="/portfolio" className="flex items-center gap-2 text-primary font-bold uppercase tracking-wide cursor-pointer">
                View All Work <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
