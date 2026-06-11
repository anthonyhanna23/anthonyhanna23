import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import { CALENDLY_URL } from "@/lib/config";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

function CalendlyPlaceholder() {
  return (
    <div className="bg-white rounded-3xl border border-black/5 shadow-xl flex flex-col items-center justify-center gap-6 py-20 px-10 text-center min-h-[400px]">
      <CalendarClock className="w-14 h-14 text-primary" />
      <div>
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Scheduling coming soon</h3>
        <p className="text-neutral-500 max-w-xs mx-auto">
          Online booking is almost live. In the meantime, shoot us an email below and we'll get you on the calendar.
        </p>
      </div>
      <a
        href="mailto:piccomessages@gmail.com"
        className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-primary hover:text-foreground transition-all group"
      >
        Email us
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

export function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!CALENDLY_URL) return;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  if (!CALENDLY_URL) return <CalendlyPlaceholder />;

  return (
    <div className="relative bg-white rounded-3xl border border-black/5 shadow-xl overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            Loading calendar...
          </p>
        </div>
      )}
      <div
        className="calendly-inline-widget"
        data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&primary_color=a3e600`}
        style={{ minWidth: "320px", height: "700px" }}
      />
    </div>
  );
}
