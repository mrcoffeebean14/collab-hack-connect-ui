import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  status: string;
}

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to access the dashboard",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch projects and hackathons
      const [projectsResponse, hackathonsResponse] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROJECTS.MY_PROJECTS}`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HACKATHONS.ALL}`, { headers })
      ]);

      if (!projectsResponse.ok || !hackathonsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const projectsData = await projectsResponse.json();
      const hackathonsData = await hackathonsResponse.json();

      setProjects(projectsData.projects || []);
      setHackathons(hackathonsData.hackathons || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // Here you would typically upload the image to your server
        // and update the user's profile
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {/* Left Sidebar - Profile Section */}
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-gray-400">{userName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>

            {/* User Name */}
            <div className="text-center">
              <h2 className="text-sm text-gray-600">Welcome back,</h2>
              <h1 className="text-xl font-bold text-gray-900">{userName}</h1>
            </div>

            {/* Quick Stats */}
            <div className="w-full pt-4 space-y-3">
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Teams</p>
                <p className="text-2xl font-bold text-purple-600">1</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Hackathons</p>
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button variant="outline" className="w-full text-purple-600 border-purple-600 hover:bg-purple-50">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Overview */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            {/* Your other dashboard content can go here */}
          </div>

          {/* Active Team Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Active Team</CardTitle>
                <p className="text-sm text-gray-500">Your current hackathon team</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">EcoTech Innovators</h3>
                    <p className="text-sm text-gray-500">Global Solution Challenge</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm">Y</div>
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">A</div>
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">M</div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Project Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Team</Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Hackathons Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Upcoming Hackathons</CardTitle>
                <p className="text-sm text-gray-500">Events you've registered for</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Global Solution Challenge</h3>
                      <p className="text-sm text-gray-500">Apr 15-17, 2025</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200">12 days left</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">TechCrunch Disrupt Hackathon</h3>
                      <p className="text-sm text-gray-500">May 5-7, 2025</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">32 days left</Badge>
                  </div>
                  <Button variant="outline" className="w-full">Find More Hackathons</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Notifications Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Notifications</CardTitle>
                <p className="text-sm text-gray-500">Stay updated on your activities</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">James Wilson accepted your team invitation</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">New hackathon announcement: ETH Global</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">New message in EcoTech Innovators team chat</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View All Notifications</Button>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Skills & Achievements</CardTitle>
                <p className="text-sm text-gray-500">Your technical profile</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-800">React</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Node.js</Badge>
                      <Badge className="bg-green-100 text-green-800">Python</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">UI/UX</Badge>
                      <Badge className="bg-pink-100 text-pink-800">Data Analysis</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">SDG Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-cyan-100 text-cyan-800">Education</Badge>
                      <Badge className="bg-teal-100 text-teal-800">Climate</Badge>
                      <Badge className="bg-indigo-100 text-indigo-800">Innovation</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Project Stats</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-gray-800">5</p>
                        <p className="text-sm text-gray-500">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-800">1</p>
                        <p className="text-sm text-gray-500">Ongoing</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-800">3</p>
                        <p className="text-sm text-gray-500">Hackathons</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}