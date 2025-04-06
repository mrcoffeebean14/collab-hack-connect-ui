import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/lib/constants';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    status: string;
    owner: {
      id: string;
      name: string;
    };
    teamMembers: Array<{
      id: string;
      name: string;
    }>;
    collaborationRequests: Array<{
      id: string;
      user: {
        id: string;
        name: string;
      };
      status: string;
    }>;
  };
  onUpdate?: () => void;
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCollaborate = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to collaborate on projects",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS.COLLABORATE(project.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send collaboration request');
      }

      toast({
        title: "Request Sent",
        description: "Your collaboration request has been sent successfully",
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send collaboration request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PROJECTS.HANDLE_REQUEST(requestId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: action === 'accept' ? 'accepted' : 'rejected' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      toast({
        title: "Success",
        description: `Request ${action}ed successfully`,
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = user?.id === project.owner.id;
  const isTeamMember = project.teamMembers.some(member => member.id === user?.id);
  const hasPendingRequest = project.collaborationRequests.some(
    request => request.user.id === user?.id && request.status === 'pending'
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <div className="flex gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{project.description}</p>
        <div className="mt-4">
          <p className="text-sm">
            <span className="font-semibold">Owner:</span> {project.owner.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Team Members:</span>{" "}
            {project.teamMembers.map((member) => member.name).join(", ")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
          {project.status}
        </Badge>
        {!isOwner && !isTeamMember && !hasPendingRequest && (
          <Button 
            onClick={handleCollaborate} 
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Collaborate"}
          </Button>
        )}
        {isOwner && project.collaborationRequests.length > 0 && (
          <div className="space-y-2">
            {project.collaborationRequests.map((request) => (
              <div key={request.id} className="flex items-center gap-2">
                <span className="text-sm">{request.user.name}</span>
                <Button
                  size="sm"
                  onClick={() => handleRequestAction(request.id, 'accept')}
                  disabled={isLoading}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRequestAction(request.id, 'reject')}
                  disabled={isLoading}
                >
                  Reject
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
