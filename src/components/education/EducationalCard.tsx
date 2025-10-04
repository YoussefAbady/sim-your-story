import { Card } from "@/components/ui/card";
import { useEducation } from "@/contexts/EducationContext";
import { EDUCATION_TIPS } from "@/data/educationContent";
import { ComponentProps } from "react";

interface EducationalCardProps extends ComponentProps<typeof Card> {
  educationKey: string;
  children: React.ReactNode;
}

export const EducationalCard = ({ educationKey, children, ...props }: EducationalCardProps) => {
  const { showTip } = useEducation();

  const handleClick = () => {
    const tip = EDUCATION_TIPS[educationKey];
    if (tip) {
      showTip(tip);
    }
  };

  return (
    <Card 
      {...props} 
      onClick={handleClick}
      className={`cursor-help transition-all hover:border-primary/50 ${props.className || ''}`}
    >
      {children}
    </Card>
  );
};
