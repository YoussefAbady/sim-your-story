import { motion } from "framer-motion";
import { TrendingUp, Brain, Trophy, LineChart } from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Interactive Timeline",
    description: "Watch your financial journey unfold with beautiful, animated visualizations that bring your future to life.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Brain,
    title: "AI Mentor",
    description: "Get personalized guidance from an AI that explains complex concepts through relatable stories and scenarios.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    title: "Smart Simulations",
    description: "Run thousands of scenarios to understand how your choices today impact your retirement tomorrow.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn badges, unlock lessons, and track your progress as you build financial literacy.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Powered by AI Simulations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Educational, not advisory. Experience the future before you live it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-6 border border-border h-full hover:shadow-lg transition-all duration-300">
                <div className={`${feature.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
