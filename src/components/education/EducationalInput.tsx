import { Input } from "@/components/ui/input";
import { useEducation } from "@/contexts/EducationContext";
import { ComponentProps, forwardRef } from "react";
import { useSessionPoints } from "@/hooks/useSessionPoints";

interface EducationalInputProps extends ComponentProps<typeof Input> {
  educationKey: string;
  userData?: any;
}

export const EducationalInput = forwardRef<HTMLInputElement, EducationalInputProps>(
  ({ educationKey, userData, ...props }, ref) => {
    const { showAITip } = useEducation();
    const { awardPoints, POINT_VALUES } = useSessionPoints();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Award points for field focus
      awardPoints(`field_focus_${educationKey}`, POINT_VALUES.FIELD_FOCUS);
      
      showAITip(educationKey, userData);
      props.onFocus?.(e);
    };

    return <Input {...props} ref={ref} onFocus={handleFocus} />;
  }
);

EducationalInput.displayName = "EducationalInput";
