import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 md:py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-md">
            <Link to="/" className="font-display font-black text-4xl tracking-tighter uppercase cursor-pointer inline-block">
                Picco Media<span className="text-primary">.</span>
            </Link>
            <p className="text-neutral-400 font-medium leading-relaxed">
              We define brands through high-voltage social content. 
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <h4 className="font-display font-bold text-lg uppercase tracking-wider text-primary">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-primary transition-colors cursor-pointer">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors cursor-pointer">About</Link></li>
                <li><Link to="/portfolio" className="hover:text-primary transition-colors cursor-pointer">Work</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors cursor-pointer">Contact</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-display font-bold text-lg uppercase tracking-wider text-primary">Socials</h4>
              <ul className="space-y-2">
                <li><a href="https://www.instagram.com/picco.media" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2"><Instagram size={16}/> Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2"><Linkedin size={16}/> LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-4 md:mt-16 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Picco Media. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
