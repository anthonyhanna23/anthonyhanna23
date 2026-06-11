import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CalendlyEmbed } from "@/components/CalendlyEmbed";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  brand: z.string().min(2, "Brand name is required"),
  message: z.string().min(10, "Please tell us more about your project"),
});

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      brand: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Send the package to your Node.js server
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // 2. Wait for the server's receipt before showing the success toast
      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        form.reset();
      } else {
        // 3. If the server throws an error, tell the user
        toast({
          title: "Uh oh!",
          description: "Something went wrong. Please try emailing us directly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <div className="pt-32 md:pt-32 min-h-screen bg-background">
      <div className="container mx-auto px-4.5 md:px-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-20 pb-6 md:pb-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[80px] md:text-8xl font-black uppercase tracking-tighter leading-none mb-8 text-center md:text-left">
              Book a <br /> <span className="text-primary">Call<span className="tracking-normal">.</span></span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-6 md:mb-8 max-w-xs md:max-w-md text-left mx-auto md:mx-0">
              Grab a <b className="text-foreground">free intro call</b> — we'll talk about your business, your goals, and how we can turn your social media into a customer machine. No pressure, no commitment.
            </p>

            <ul className="mb-6 md:mb-12 space-y-3 max-w-xs md:max-w-md mx-auto md:mx-0">
              {[
                "Pick a time that works for you",
                "15 minutes, straight to the point",
                "Walk away with a clear game plan",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base md:text-lg font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center md:items-start mb-2 md:mb-0">
              <div>
                <h3 className="font-bold uppercase tracking-wider text-sm text-neutral-400 mb-1">Email Us</h3>
                <a href="mailto:piccomessages@gmail.com" className="text-2xl font-bold hover:text-primary transition-colors block">piccomessages@gmail.com</a>
              </div>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CalendlyEmbed />
          </motion.div>
        </div>

        <div className="max-w-2xl mx-auto pt-16 md:pt-24 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
              Prefer to <span className="text-primary">write<span className="tracking-normal">?</span></span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-500">
              Not ready to talk yet? Tell us about your business and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-black/5 shadow-xl"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold tracking-wide text-xs">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} className="h-12 bg-neutral-50 border-neutral-200 focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold tracking-wide text-xs">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jane@brand.com" {...field} className="h-12 bg-neutral-50 border-neutral-200 focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold tracking-wide text-xs">Brand / Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Brand Name" {...field} className="h-12 bg-neutral-50 border-neutral-200 focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold tracking-wide text-xs">Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what you need..." 
                          className="min-h-[150px] bg-neutral-50 border-neutral-200 focus-visible:ring-primary resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 text-lg font-bold uppercase tracking-wide text-primary bg-foreground hover:bg-primary hover:text-foreground transition-all">
                  Send Message
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
