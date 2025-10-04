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
      className={`cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 ${props.className || ''}`}
    >
      {children}
    </Card>
  );
};
