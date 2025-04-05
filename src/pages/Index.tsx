
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import HackathonCard from "@/components/HackathonCard";
import Footer from "@/components/Footer";

const Index = () => {
  // Sample data for projects
  const projects = [
    {
      id: 1,
      name: "AI Code Assistant",
      description: "An intelligent coding companion that helps developers write better code faster with real-time suggestions and error detection.",
      members: ["Alex Chen", "Maya Patel"],
      technologies: ["React", "TensorFlow", "Python"],
      openPositions: ["Frontend Developer", "ML Engineer"]
    },
    {
      id: 2,
      name: "EcoTrack",
      description: "A sustainability platform that helps users track and reduce their carbon footprint through personalized recommendations.",
      members: ["Sam Johnson", "Leila Kim"],
      technologies: ["Vue.js", "Node.js", "MongoDB"],
      openPositions: ["Backend Developer", "UI/UX Designer"]
    },
    {
      id: 3,
      name: "MediConnect",
      description: "A healthcare platform connecting patients with healthcare providers for telemedicine consultations and appointment scheduling.",
      members: ["David Garcia", "Sophie Wang"],
      technologies: ["React Native", "Firebase", "Express"],
      openPositions: ["Mobile Developer", "DevOps Engineer"]
    }
  ];

  // Sample data for hackathons
  const hackathons = [
    {
      id: 1,
      name: "Climate Tech Hack 2025",
      description: "Build innovative solutions addressing climate change and environmental challenges.",
      date: "May 15-17, 2025",
      location: "Virtual & San Francisco, CA",
      prizes: "$10,000 in total prizes",
      registrationDeadline: "April 30, 2025"
    },
    {
      id: 2,
      name: "HealthTech Innovation Challenge",
      description: "Create cutting-edge technologies to solve healthcare accessibility and efficiency problems.",
      date: "June 5-7, 2025",
      location: "Boston, MA",
      prizes: "$15,000 in cash prizes + mentorship",
      registrationDeadline: "May 20, 2025"
    },
    {
      id: 3,
      name: "AI for Social Good",
      description: "Develop AI solutions that address pressing social challenges in education, poverty, and accessibility.",
      date: "July 10-12, 2025",
      location: "Virtual",
      prizes: "$8,000 in prizes + accelerator interviews",
      registrationDeadline: "June 25, 2025"
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
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Explore Projects</Button>
              </div>
              
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 border border-white/20">
                <h2 className="text-2xl font-bold mb-4">Hackathons Incoming</h2>
                <p className="mb-6">Discover upcoming hackathons, form teams, and compete for prizes while solving real-world challenges.</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">View Hackathons</Button>
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
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">View All Projects</Button>
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
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">View All Hackathons</Button>
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
