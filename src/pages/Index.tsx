import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import HackathonCard from "@/components/HackathonCard";
import Footer from "@/components/Footer";
import { ROUTES } from '@/config/constants';
import { useNavigate } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  members: string[];
  openPositions: string[];
}

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
  location: string;
  prizes: string;
  registrationDeadline: string;
}

const Index = () => {
  const navigate = useNavigate();
  
  // Sample data for projects
  const projects: Project[] = [
    {
      _id: "1",
      title: "AI Code Assistant",
      description: "An intelligent coding companion that helps developers write better code faster with real-time suggestions and error detection.",
      members: ["Alex Chen", "Maya Patel"],
      techStack: ["React", "TensorFlow", "Python"],
      openPositions: ["Frontend Developer", "ML Engineer"],
      status: "active"
    },
    {
      _id: "2",
      title: "EcoTrack",
      description: "A sustainability platform that helps users track and reduce their carbon footprint through personalized recommendations.",
      members: ["Sam Johnson", "Leila Kim"],
      techStack: ["Vue.js", "Node.js", "MongoDB"],
      openPositions: ["Backend Developer", "UI/UX Designer"],
      status: "active"
    },
    {
      _id: "3",
      title: "MediConnect",
      description: "A healthcare platform connecting patients with healthcare providers for telemedicine consultations and appointment scheduling.",
      members: ["David Garcia", "Sophie Wang"],
      techStack: ["React Native", "Firebase", "Express"],
      openPositions: ["Mobile Developer", "DevOps Engineer"],
      status: "active"
    }
  ];

  // Sample data for hackathons
  const hackathons: Hackathon[] = [
    {
      _id: "1",
      title: "Climate Tech Hack 2025",
      description: "Build innovative solutions addressing climate change and environmental challenges.",
      startDate: "2025-05-15",
      endDate: "2025-05-17",
      mode: "hybrid",
      location: "Virtual & San Francisco, CA",
      prizes: "$10,000 in total prizes",
      registrationDeadline: "2025-04-30",
      status: "upcoming"
    },
    {
      _id: "2",
      title: "HealthTech Innovation Challenge",
      description: "Create cutting-edge technologies to solve healthcare accessibility and efficiency problems.",
      startDate: "2025-06-05",
      endDate: "2025-06-07",
      mode: "in-person",
      location: "Boston, MA",
      prizes: "$15,000 in cash prizes + mentorship",
      registrationDeadline: "2025-05-20",
      status: "upcoming"
    },
    {
      _id: "3",
      title: "AI for Social Good",
      description: "Develop AI solutions that address pressing social challenges in education, poverty, and accessibility.",
      startDate: "2025-07-10",
      endDate: "2025-07-12",
      mode: "virtual",
      location: "Virtual",
      prizes: "$8,000 in prizes + accelerator interviews",
      registrationDeadline: "2025-06-25",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Collab Hack Connect</h1>
            <p className="text-xl text-center mb-12 max-w-3xl mx-auto">Find your next collaboration or hackathon opportunity to build amazing projects and grow your skills.</p>
            
            {/* Hero Flexbox */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-white/20">
                <h2 className="text-2xl font-bold mb-4">Collaborate for Projects</h2>
                <p className="mb-6">Join exciting projects, contribute your skills, and build your portfolio while working with talented peers.</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => navigate(ROUTES.PROJECTS)}>
                  Explore Projects
                </Button>
              </div>
              
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-white/20">
                <h2 className="text-2xl font-bold mb-4">Hackathons Incoming</h2>
                <p className="mb-6">Discover upcoming hackathons, form teams, and compete for prizes while solving real-world challenges.</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate(ROUTES.HACKATHONS)}>
                  View Hackathons
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Projects Section */}
        <section className="py-16 px-4 md:px-8 bg-slate-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Collaboration Projects</h2>
            <p className="text-lg text-center mb-10 text-gray-600 max-w-3xl mx-auto">Find a project that matches your skills and interests or create your own.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => navigate(ROUTES.PROJECTS)}>
                View All Projects
              </Button>
            </div>
          </div>
        </section>
        
        {/* Hackathons Section */}
        <section className="py-16 px-4 md:px-8 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Upcoming Hackathons</h2>
            <p className="text-lg text-center mb-10 text-gray-600 max-w-3xl mx-auto">Join exciting hackathons, form teams, and build innovative solutions.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map(hackathon => (
                <HackathonCard key={hackathon._id} hackathon={hackathon} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate(ROUTES.HACKATHONS)}>
                View All Hackathons
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
