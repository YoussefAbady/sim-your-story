import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 1,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, { duration: duration * 1000 });
  const prevValueRef = useRef(value);

  useEffect(() => {
    springValue.set(value);
    
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [value, springValue]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(".");
  };

  // Detect if value increased for celebration effect
  const valueIncreased = value > prevValueRef.current;
  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return (
    <motion.span
      className={cn(
        "inline-block tabular-nums",
        valueIncreased && "animate-bounce-in",
        className
      )}
      initial={false}
      animate={valueIncreased ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      {formatNumber(displayValue)}
      {suffix}
    </motion.span>
  );
};
