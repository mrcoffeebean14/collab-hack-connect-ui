import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Filter, X, Calendar, Users, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  teamMembers?: string[];
  startDate?: string;
  endDate?: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  techStack: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      _id: '1',
      title: 'AI-Powered Chat Application',
      description: 'A real-time chat application with AI-powered language translation and sentiment analysis.',
      techStack: ['React', 'Node.js', 'Socket.io', 'TensorFlow.js'],
      status: 'active',
      teamMembers: ['John Doe', 'Alice Smith'],
      startDate: '2024-03-01',
      endDate: '2024-06-30'
    },
    {
      _id: '2',
      title: 'Blockchain Voting System',
      description: 'Secure and transparent voting system built on blockchain technology for organizational elections.',
      techStack: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
      status: 'pending',
      teamMembers: ['Bob Wilson'],
      startDate: '2024-04-01',
      endDate: '2024-07-31'
    },
    {
      _id: '3',
      title: 'Smart Home IoT Dashboard',
      description: 'Centralized dashboard for monitoring and controlling IoT devices in smart homes.',
      techStack: ['React', 'Python', 'MQTT', 'MongoDB'],
      status: 'completed',
      teamMembers: ['Emma Davis', 'Mike Johnson', 'Sarah Lee'],
      startDate: '2024-01-15',
      endDate: '2024-03-15'
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    techStack: '',
    status: 'pending',
    startDate: '',
    endDate: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view projects",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROJECTS.MY_PROJECTS}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);

    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create a project",
          variant: "destructive",
        });
        return;
      }

      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()),
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROJECTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        techStack: '',
        status: 'pending',
        startDate: '',
        endDate: '',
      });
      fetchProjects();

    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter !== 'all' && project.status.toLowerCase() !== filter) return false;
    if (techFilter && !project.techStack.some(tech => 
      tech.toLowerCase().includes(techFilter.toLowerCase())
    )) return false;
    return true;
  });

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleCollaborate = (projectId: string) => {
    toast({
      title: "Collaboration Request Sent",
      description: "The project owner will review your request to join.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-2">Manage and track your project portfolio</p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the project details below to create a new project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input
                    id="techStack"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="Enter technologies (comma-separated)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-4">
            <Button 
              variant={filter === 'all' ? "default" : "outline"}
              onClick={() => setFilter('all')}
            >
              All Projects
            </Button>
            <Button 
              variant={filter === 'active' ? "default" : "outline"}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={filter === 'completed' ? "default" : "outline"}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <div className="flex-1">
            <Input
              placeholder="Filter by tech stack..."
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{project.title}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                {/* Tech Stack */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Team</p>
                    <div className="flex -space-x-2">
                      {project.teamMembers.map((member, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm border-2 border-white"
                          title={member}
                        >
                          {member.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(project)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="secondary"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700"
                    onClick={() => handleCollaborate(project._id)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Collab
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedProject && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-center">
                    <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                    <p className="text-gray-900">{selectedProject.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedProject.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Started: {format(new Date(selectedProject.startDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}

                  {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Team Members
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.teamMembers.map((member, index) => (
                          <Badge key={index} variant="secondary">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900">No projects found</h3>
            <p className="text-gray-600 mt-2">
              {filter === 'all' 
                ? "Start by creating your first project!"
                : `No ${filter} projects found. Try changing the filter.`}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 