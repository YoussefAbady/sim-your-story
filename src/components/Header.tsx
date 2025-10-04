import zusLogo from "@/assets/zus-logo.png";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src={zusLogo} 
            alt="ZUS Logo" 
            className="h-12 w-auto"
          />
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Strona główna
          </Link>
          <Link 
            to="/simulation" 
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Symulator
          </Link>
        </nav>
      </div>
    </header>
  );
};
