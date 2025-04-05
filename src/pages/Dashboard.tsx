import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
}

interface Profile {
  bio: string;
  githubId: string;
  techBackground: string;
  skills: string[];
}

export default function Dashboard() {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [collaboratedProjects, setCollaboratedProjects] = useState<Project[]>([]);
  const [registeredHackathons, setRegisteredHackathons] = useState<Hackathon[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user's projects
      const projectsResponse = await fetch(`${API_BASE_URL}/projects/my-projects`, {
        headers
      });
      const projectsData = await projectsResponse.json();
      setMyProjects(projectsData.projects);

      // Fetch collaborated projects
      const collabResponse = await fetch(`${API_BASE_URL}/projects/collaborated`, {
        headers
      });
      const collabData = await collabResponse.json();
      setCollaboratedProjects(collabData.projects);

      // Fetch registered hackathons
      const hackathonsResponse = await fetch(`${API_BASE_URL}/hackathons/registered`, {
        headers
      });
      const hackathonsData = await hackathonsResponse.json();
      setRegisteredHackathons(hackathonsData.hackathons);

      // Fetch notifications
      const notificationsResponse = await fetch(`${API_BASE_URL}/notifications`, {
        headers
      });
      const notificationsData = await notificationsResponse.json();
      setNotifications(notificationsData.notifications);

      // Fetch profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
        headers
      });
      const profileData = await profileResponse.json();
      setProfile(profileData.profile);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Projects</h2>
              <div className="space-y-4">
                {myProjects.map((project) => (
                  <Card key={project._id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Status: {project.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Collaborated Projects</h2>
              <div className="space-y-4">
                {collaboratedProjects.map((project) => (
                  <Card key={project._id}>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Status: {project.status}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hackathons">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Registered Hackathons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredHackathons.map((hackathon) => (
                <Card key={hackathon._id}>
                  <CardHeader>
                    <CardTitle>{hackathon.title}</CardTitle>
                    <CardDescription>{hackathon.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Mode:</span> {hackathon.mode}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Status:</span> {hackathon.status}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(hackathon.startDate).toLocaleDateString()} -{' '}
                        {new Date(hackathon.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Bio</h3>
                    <p className="text-sm text-gray-600">{profile.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">GitHub</h3>
                    <p className="text-sm text-gray-600">{profile.githubId}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Technical Background</h3>
                    <p className="text-sm text-gray-600">{profile.techBackground}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Profile not created yet</p>
                  <Button className="mt-4">Create Profile</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 