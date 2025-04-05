
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-4 md:px-8">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo and brand name */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-700">CollabHackConnect</span>
        </Link>
        
        {/* Navigation links - show on desktop, hide on mobile unless menu is open */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
          <Link to="/projects" className="text-gray-700 hover:text-purple-600 font-medium">Projects</Link>
          <Link to="/hackathons" className="text-gray-700 hover:text-purple-600 font-medium">Hackathons</Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">About</Link>
        </div>
        
        {/* Authentication buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">Log In</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign Up</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
