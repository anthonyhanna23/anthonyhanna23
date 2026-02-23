import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display font-black text-2xl tracking-tighter uppercase cursor-pointer hover:text-primary transition-colors">
            Picco<span className="text-primary">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "font-medium text-sm uppercase tracking-wide transition-colors hover:text-primary cursor-pointer",
                location === link.href ? "text-primary" : "text-foreground"
              )}
            >
                {link.label}
            </Link>
          ))}
          <Link href="/contact" className="bg-foreground text-background px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-primary hover:text-foreground transition-all cursor-pointer">
              Start Project
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 right-0 bg-background border-b border-black/5 p-6 md:hidden flex flex-col gap-6"
        >
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "font-display font-bold text-3xl uppercase tracking-tight cursor-pointer",
                location === link.href ? "text-primary" : "text-foreground"
              )}
            >
                {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
