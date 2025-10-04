import { Card } from "@/components/ui/card";
import { useEducation } from "@/contexts/EducationContext";
import { ComponentProps } from "react";

interface EducationalCardProps extends ComponentProps<typeof Card> {
  educationKey: string;
  children: React.ReactNode;
  userData?: any;
}

export const EducationalCard = ({ educationKey, children, userData, ...props }: EducationalCardProps) => {
  const { showAITip } = useEducation();

  const handleClick = () => {
    showAITip(educationKey, userData);
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
