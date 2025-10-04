import { Card } from "@/components/ui/card";
import { useEducation } from "@/contexts/EducationContext";
import { ComponentProps } from "react";
import { useSessionPoints } from "@/hooks/useSessionPoints";

interface EducationalCardProps extends ComponentProps<typeof Card> {
  educationKey: string;
  children: React.ReactNode;
  userData?: any;
}

export const EducationalCard = ({ educationKey, children, userData, ...props }: EducationalCardProps) => {
  const { showAITip } = useEducation();
  const { awardPoints, POINT_VALUES } = useSessionPoints();

  const handleClick = () => {
    // Award points for card click
    awardPoints(`card_click_${educationKey}`, POINT_VALUES.CARD_CLICK);
    
    showAITip(educationKey, userData);
  };

  return (
    <Card 
      {...props} 
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 relative ${props.className || ''}`}
    >
      {children}
    </Card>
  );
};
