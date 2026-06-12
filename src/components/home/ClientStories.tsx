import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { clients } from "@/data/clients";

export function ClientStories() {
  return (
    <section className="py-12 md:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-12 md:mb-20">
          <h2 className="text-foreground font-extrabold tracking-[0.3em] uppercase text-base mb-4">
            Client Stories
          </h2>
          <h3 className="text-[7.5vw] md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
            Local Businesses,<br />
            <span className="text-primary [text-shadow:0_1px_4px_rgba(0,0,0,0.25)] md:[text-shadow:none]">Real<br className="md:hidden" /> Results</span>
          </h3>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {clients.map((client, i) => (
            <motion.div
              key={client.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden [direction:ltr]">
                <img
                  src={client.image}
                  alt={`${client.name} - social media content by Picco Media in Columbus, Ohio`}
                  className={`w-full h-full object-cover ${client.slug === "marc-rice" ? "scale-110 object-[50%_75%]" : ""}`}
                />
                <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-full">
                  <span className="font-bold uppercase tracking-wide text-xs">{client.location}</span>
                </div>
              </div>

              <div className="[direction:ltr]">
                <span className="inline-block text-xs font-bold border border-black/10 px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 bg-primary/10 text-foreground">
                  {client.niche}
                </span>
                <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.95]">
                  {client.name}
                </h4>
                <p className="text-lg text-neutral-500 leading-relaxed mb-8">{client.summary}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {client.services.map((service) => (
                    <span
                      key={service}
                      className="text-xs font-bold uppercase tracking-wide bg-white border border-black/5 px-3 py-1.5 rounded-full shadow-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                {client.testimonial.isPlaceholder ? null : (
                  <div className="border-l-4 border-primary pl-5 mb-8">
                    <Quote className="w-6 h-6 text-primary mb-2" fill="currentColor" />
                    <p className="text-lg font-medium leading-relaxed mb-2">"{client.testimonial.quote}"</p>
                    <p className="text-sm font-bold uppercase tracking-wide text-neutral-400">
                      {client.testimonial.attribution}
                    </p>
                  </div>
                )}

                <Link
                  to={`/portfolio?project=${client.portfolioProjectId}`}
                  className="inline-flex items-center gap-2 font-bold uppercase tracking-wide text-foreground hover:text-primary hover:gap-4 transition-all"
                >
                  See the work <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
