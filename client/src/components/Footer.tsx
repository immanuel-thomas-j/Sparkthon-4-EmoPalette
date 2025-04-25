import { Github, Info, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="w-3 h-3 bg-accent rounded-full"></span>
              </div>
              <span className="font-bold">EmoPalette</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Generate color palettes from emotions</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Info className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <HelpCircle className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
