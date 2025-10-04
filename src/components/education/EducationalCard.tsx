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
      className={`cursor-pointer group transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-2 hover:scale-[1.02] relative overflow-hidden ${props.className || ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
};
