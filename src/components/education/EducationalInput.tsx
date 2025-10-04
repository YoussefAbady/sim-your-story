import { Input } from "@/components/ui/input";
import { useEducation } from "@/contexts/EducationContext";
import { EDUCATION_TIPS } from "@/data/educationContent";
import { ComponentProps } from "react";

interface EducationalInputProps extends ComponentProps<typeof Input> {
  educationKey: string;
}

export const EducationalInput = ({ educationKey, ...props }: EducationalInputProps) => {
  const { showTip } = useEducation();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const tip = EDUCATION_TIPS[educationKey];
    if (tip) {
      showTip(tip);
    }
    props.onFocus?.(e);
  };

  return <Input {...props} onFocus={handleFocus} />;
};
