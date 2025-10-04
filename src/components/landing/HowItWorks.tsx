import { motion } from "framer-motion";
import { UserPlus, Sliders, Sparkles, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Share Your Story",
    description: "Quick 3-step setup: age, income, goals. No complex financial jargon.",
    step: "01",
  },
  {
    icon: Sliders,
    title: "Adjust & Explore",
    description: "Move sliders, change choices, see your timeline adapt in real-time.",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Get AI Insights",
    description: "Receive narrative feedback and mentor advice tailored to your simulation.",
    step: "03",
  },
  {
    icon: BarChart3,
    title: "Learn & Grow",
    description: "Unlock lessons, earn badges, and build confidence in your financial future.",
    step: "04",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to visualize your financial future
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-card rounded-2xl p-6 border border-border relative z-10 h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                    {step.step}
                  </div>
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
