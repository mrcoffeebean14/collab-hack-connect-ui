import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Calendar, MapPin, Users, Clock } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import HackathonCard from "@/components/HackathonCard";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";
import ProjectForm from "@/components/ProjectForm";
import HackathonForm from "@/components/HackathonForm";
import { API_CONFIG, API_ENDPOINTS, ROUTES } from '@/config/constants';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
  collaborationRequests: Array<{
    user: {
      _id: string;
      name: string;
    };
    status: string;
    message: string;
  }>;
}

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
  techStack?: string[];
  venue?: string;
  maxTeamSize?: number;
  registrationDeadline?: string;
}

interface Profile {
  _id: string;
  user: string;
  bio: string;
  githubId: string;
  technicalBackground: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showHackathonForm, setShowHackathonForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const API_BASE_URL = API_CONFIG.BASE_URL;

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name);
    } else {
      // Redirect to login if no user data
      navigate(ROUTES.LOGIN);
      return;
    }
    
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        navigate(ROUTES.LOGIN);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user's projects
      const projectsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROJECTS.MY_PROJECTS}`, {
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });
      
      if (!projectsResponse.ok) {
        throw new Error(`Projects API error: ${projectsResponse.status} ${projectsResponse.statusText}`);
      }
      
      const projectsData = await projectsResponse.json();
      setProjects(projectsData.projects || []);

      // Fetch hackathons
      const hackathonsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HACKATHONS.REGISTERED}`, {
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });
      
      if (!hackathonsResponse.ok) {
        throw new Error(`Hackathons API error: ${hackathonsResponse.status} ${hackathonsResponse.statusText}`);
      }
      
      const hackathonsData = await hackathonsResponse.json();
      setHackathons(hackathonsData.hackathons || []);

      // Try to fetch notifications, but don't throw if it fails
      try {
        const notificationsResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}`, {
          headers,
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
        });
        
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications || []);
        } else {
          console.warn('Notifications endpoint not available');
          setNotifications([]);
        }
      } catch (error) {
        console.warn('Error fetching notifications:', error);
        setNotifications([]);
      }

      // Fetch profile
      const profileResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT)
      });
      
      if (!profileResponse.ok) {
        throw new Error(`Profile API error: ${profileResponse.status} ${profileResponse.statusText}`);
      }
      
      const profileData = await profileResponse.json();
      setProfile(profileData.profile || null);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast({
            title: "Timeout Error",
            description: "The request took too long to complete",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    }
  };

  const handleCollaborationResponse = async (projectId: string, requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/collaboration-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      toast({
        title: "Success",
        description: `Collaboration request ${status}`,
      });

      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating collaboration request:', error);
      toast({
        title: "Error",
        description: "Failed to update collaboration request",
        variant: "destructive",
      });
    }
  };

  const scrollProjects = (direction: 'left' | 'right') => {
    const container = document.getElementById('projects-container');
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || null);
      } else if (response.status === 404) {
        // Profile doesn't exist yet, which is fine
        setProfile(null);
      } else {
        const errorData = await response.json();
        console.error('Error fetching profile:', errorData.error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSuccess = () => {
    fetchProfile();
  };

  const handleHackathonSuccess = () => {
    setShowHackathonForm(false);
    fetchDashboardData();
  };

  const fetchHackathons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HACKATHONS.ALL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hackathons');
      }

      const data = await response.json();
      console.log('Fetched hackathons:', data);
      setHackathons(data.hackathons || []);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch hackathons',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* User Welcome Section */}
      <div className="bg-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-xl text-purple-100">
              Here's what's happening with your projects and hackathons
            </p>
          </div>
        </div>
      </div>

      {/* Landing Page Content */}
      <div className="bg-white">
        <div className="container mx-auto py-20 px-4">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Next Project Partner
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-16">
              Connect with developers, designers, and creators to build amazing projects together.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
              <div className="w-full md:w-1/2 transform transition-transform hover:scale-105">
                <Card className="h-full min-h-[400px] border-4 border-purple-200 hover:border-purple-500 transition-colors shadow-lg">
                  <CardHeader className="text-center py-8">
                    <CardTitle className="text-3xl md:text-4xl">Browse Projects</CardTitle>
                    <CardDescription className="text-lg mt-4">Discover exciting projects to collaborate on</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center items-center flex-grow">
                    <div className="mb-8 text-center">
                      <p className="text-gray-600 mb-4">Find projects that match your skills and interests</p>
                      <ul className="text-left inline-block text-gray-600">
                        <li className="mb-2">✓ Connect with like-minded developers</li>
                        <li className="mb-2">✓ Build your portfolio</li>
                        <li className="mb-2">✓ Learn new technologies</li>
                      </ul>
                    </div>
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full max-w-xs text-lg py-6" onClick={() => navigate(ROUTES.PROJECTS)}>
                      Explore Projects
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="w-full md:w-1/2 transform transition-transform hover:scale-105">
                <Card className="h-full min-h-[400px] border-4 border-indigo-200 hover:border-indigo-500 transition-colors shadow-lg">
                  <CardHeader className="text-center py-8">
                    <CardTitle className="text-3xl md:text-4xl">Join Hackathons</CardTitle>
                    <CardDescription className="text-lg mt-4">Participate in upcoming hackathons</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-center items-center flex-grow">
                    <div className="mb-8 text-center">
                      <p className="text-gray-600 mb-4">Challenge yourself and win amazing prizes</p>
                      <ul className="text-left inline-block text-gray-600">
                        <li className="mb-2">✓ Compete with top talent</li>
                        <li className="mb-2">✓ Win cash prizes and swag</li>
                        <li className="mb-2">✓ Network with industry leaders</li>
                      </ul>
                    </div>
                    <Button size="lg" variant="outline" className="w-full max-w-xs text-lg py-6" onClick={() => navigate(ROUTES.HACKATHONS)}>
                      View Hackathons
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Section */}
        <div className="container mx-auto py-16 px-4">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold text-center mb-4">Featured Projects</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollProjects('left')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollProjects('right')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto pb-4 gap-8 scrollbar-hide" id="projects-container" style={{ scrollBehavior: 'smooth' }}>
              {/* Sample Project Cards */}
              <div className="flex-none w-full md:w-[70%] lg:w-[60%]">
                <Card className="h-full min-h-[500px] hover:shadow-xl transition-all duration-300 border-4 border-purple-200 hover:border-purple-500">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl">AI Code Assistant</CardTitle>
                    <CardDescription className="text-lg">An intelligent coding companion that helps developers write better code faster with real-time suggestions and error detection.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-[350px]">
                    <div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-base font-medium">React</span>
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-base font-medium">TensorFlow</span>
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-base font-medium">Python</span>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Project Highlights</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Real-time code suggestions and error detection</li>
                          <li>Integration with popular IDEs and code editors</li>
                          <li>Machine learning models trained on millions of code samples</li>
                          <li>Customizable to individual coding styles</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <span className="text-base text-gray-600 font-medium">Alex Chen</span>
                      </div>
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-6">Join Project</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-none w-full md:w-[70%] lg:w-[60%]">
                <Card className="h-full min-h-[500px] hover:shadow-xl transition-all duration-300 border-4 border-indigo-200 hover:border-indigo-500">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl">EcoTrack</CardTitle>
                    <CardDescription className="text-lg">A sustainability platform that helps users track and reduce their carbon footprint through personalized recommendations.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-[350px]">
                    <div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-base font-medium">Vue.js</span>
                        <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-base font-medium">Node.js</span>
                        <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-base font-medium">MongoDB</span>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Project Highlights</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Personalized carbon footprint tracking</li>
                          <li>Actionable recommendations for reducing environmental impact</li>
                          <li>Community challenges and achievements</li>
                          <li>Integration with smart home devices</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <span className="text-base text-gray-600 font-medium">Sam Johnson</span>
                      </div>
                      <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-6">Join Project</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-none w-full md:w-[70%] lg:w-[60%]">
                <Card className="h-full min-h-[500px] hover:shadow-xl transition-all duration-300 border-4 border-blue-200 hover:border-blue-500">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl">MediConnect</CardTitle>
                    <CardDescription className="text-lg">A healthcare platform connecting patients with healthcare providers for telemedicine consultations and appointment scheduling.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-[350px]">
                    <div>
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-base font-medium">React Native</span>
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-base font-medium">Firebase</span>
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-base font-medium">Express</span>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Project Highlights</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Secure video consultations with healthcare providers</li>
                          <li>Automated appointment scheduling and reminders</li>
                          <li>Electronic health records management</li>
                          <li>Prescription refill requests and delivery tracking</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                        <span className="text-base text-gray-600 font-medium">David Garcia</span>
                      </div>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-6">Join Project</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User's Projects */}
              {projects.map((project) => (
                <div key={project._id} className="flex-none w-full md:w-[70%] lg:w-[60%]">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto py-12 px-4 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {notifications.map((notification) => (
                      <Card key={notification._id}>
                        <CardContent className="pt-4">
                          <p className="text-sm">{notification.message}</p>
                          {notification.type === 'collaboration_request' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleCollaborationResponse(notification.projectId, notification._id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCollaborationResponse(notification.projectId, notification._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Projects</h2>
                <Button onClick={() => setShowProjectForm(true)}>
                  Create New Project
                </Button>
              </div>
              {showProjectForm && (
                <ProjectForm onSuccess={() => setShowProjectForm(false)} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hackathons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Hackathons</h2>
                <Button onClick={() => setShowHackathonForm(true)}>
                  Create New Hackathon
                </Button>
              </div>
              {showHackathonForm && (
                <HackathonForm onSuccess={handleHackathonSuccess} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No hackathons found. Create one to get started!</p>
                  </div>
                ) : (
                  hackathons.map((hackathon) => (
                    <Card key={hackathon._id} className="p-6">
                      <CardHeader>
                        <CardTitle>{hackathon.title}</CardTitle>
                        <CardDescription>{hackathon.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm capitalize">{hackathon.mode}</span>
                            {hackathon.venue && <span className="text-sm"> - {hackathon.venue}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Max Team Size: {hackathon.maxTeamSize}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Registration Deadline: {new Date(hackathon.registrationDeadline).toLocaleDateString()}
                            </span>
                          </div>
                          {hackathon.techStack && hackathon.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {hackathon.techStack.map((tech, index) => (
                                <Badge key={index} variant="secondary">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your professional details and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium">Bio</h3>
                        <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">GitHub</h3>
                        <p className="text-sm text-gray-600 mt-1">{profile.githubId}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Technical Background</h3>
                        <p className="text-sm text-gray-600 mt-1">{profile.technicalBackground}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Skills</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowProfileForm(true)}
                          className="w-full"
                        >
                          Update Profile
                        </Button>
                        {showProfileForm && (
                          <div className="mt-4">
                            <ProfileForm initialData={profile} onSuccess={handleProfileSuccess} />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-gray-500 text-center">Profile not created yet</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowProfileForm(true)}
                        className="w-full"
                      >
                        Create Profile
                      </Button>
                      {showProfileForm && (
                        <div className="mt-4">
                          <ProfileForm onSuccess={handleProfileSuccess} />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </div>
  );
} 