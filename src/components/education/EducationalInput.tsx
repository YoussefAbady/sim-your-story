import { Input } from "@/components/ui/input";
import { useEducation } from "@/contexts/EducationContext";
import { ComponentProps } from "react";

interface EducationalInputProps extends ComponentProps<typeof Input> {
  educationKey: string;
  userData?: any;
}

export const EducationalInput = ({ educationKey, userData, ...props }: EducationalInputProps) => {
  const { showAITip } = useEducation();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    showAITip(educationKey, userData);
    props.onFocus?.(e);
  };

  return <Input {...props} onFocus={handleFocus} />;
};
