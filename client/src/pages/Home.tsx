import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ArrowRight, Play, TrendingUp, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import marcRiceThumb1 from "@/assets/MarcRiceThumb1.png";
import FloresThumb1 from "@/assets/Flores_Thumb1.jpg";
import marcRiceThumb3 from "@/assets/IMG_8347.jpg";

import reel1 from '../assets/IMG_8346.jpg' 
import reel2 from '../assets/IMG_8347.jpg'
import reel3 from '../assets/IMG_8348.jpg'
import reel4 from '../assets/Flores_Thumb1.jpg'
import reel5 from '../assets/Screenshot1.png'
import reel6 from '../assets/Screenshot2.png'

const workItems = [
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
]


const thumbnails = [
  reel6,
  reel2,
  reel3,
  reel4,
  reel5,
  reel1
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
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
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 [text-        shadow:0px_4px_10px_rgba(0,0,0,0.5)]">
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
                <span className="text-stroke text-transparent hover:text-primary transition-all duration-500 cursor-default "></span>
                <span className="text-primary [text-shadow:0px_4px_10px_rgba(0,0,0,0.5)]">POP.</span>
              </motion.span>
            </h1>
                  <p className="text-xl md:text-2xl font-medium text-black max-w-xl mb-10 leading-relaxed drop-shadow-lg">
              We engineer social media presence for brands that <b>refuse to be boring.</b> Stop posting for likes and start building a presence that <b>converts strangers into paying clients.</b>
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
            <Link href="/portfolio" className="flex items-center gap-2 text-primary font-bold uppercase tracking-wide cursor-pointer">
                View All Work <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
