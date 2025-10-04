import { Input } from "@/components/ui/input";
import { useEducation } from "@/contexts/EducationContext";
import { ComponentProps, forwardRef } from "react";

interface EducationalInputProps extends ComponentProps<typeof Input> {
  educationKey: string;
  userData?: any;
}

export const EducationalInput = forwardRef<HTMLInputElement, EducationalInputProps>(
  ({ educationKey, userData, ...props }, ref) => {
    const { showAITip } = useEducation();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      showAITip(educationKey, userData);
      props.onFocus?.(e);
    };

    return <Input {...props} ref={ref} onFocus={handleFocus} />;
  }
);

EducationalInput.displayName = "EducationalInput";
