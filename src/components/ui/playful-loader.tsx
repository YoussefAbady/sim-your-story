import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlayfulLoaderProps {
  variant?: "dots" | "spinner" | "pulse" | "bars";
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export const PlayfulLoader = ({
  variant = "dots",
  size = "md",
  className,
  message,
}: PlayfulLoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const containerSizes = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className={cn("flex items-center", containerSizes[size])}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                sizeClasses[size],
                "rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
              )}
              animate={{
                scale: [1, 1.2, 1],
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {message && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <motion.div
          className={cn(
            sizeClasses[size],
            "rounded-full border-4 border-muted border-t-primary"
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <motion.div
          className={cn(
            sizeClasses[size],
            "rounded-full bg-gradient-fun"
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className={cn("flex items-end", containerSizes[size])}>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={cn("w-2 rounded-full bg-primary")}
              animate={{
                height: ["20%", "100%", "20%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
              style={{ minHeight: "8px" }}
            />
          ))}
        </div>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  return null;
};
