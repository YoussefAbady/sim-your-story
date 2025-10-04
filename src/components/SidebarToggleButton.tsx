import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="default"
      className="gap-2"
      onClick={toggleSidebar}
    >
      <Settings className="w-4 h-4" />
      <span className="font-medium">Advanced Controls</span>
    </Button>
  );
}
