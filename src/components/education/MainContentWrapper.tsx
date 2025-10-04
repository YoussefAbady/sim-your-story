import { useEducation } from "@/contexts/EducationContext";

export const MainContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isPanelOpen } = useEducation();
  
  return (
    <div 
      className="transition-all duration-300 ease-in-out min-h-screen"
      style={{ 
        marginLeft: isPanelOpen ? '384px' : '0',
      }}
    >
      {children}
    </div>
  );
};
