import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/lib/constants';

interface HackathonCardProps {
  hackathon: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    mode: string;
    status: string;
    registrationStartDate: string;
    registrationEndDate: string;
    maxTeamSize: number;
    minTeamSize: number;
    participants: Array<{
      user: {
        id: string;
        name: string;
      };
      team: string;
    }>;
  };
  onUpdate?: () => void;
}

export function HackathonCard({ hackathon, onUpdate }: HackathonCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for hackathons",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const registrationStart = new Date(hackathon.registrationStartDate);
    const registrationEnd = new Date(hackathon.registrationEndDate);

    if (now < registrationStart) {
      toast({
        title: "Registration Not Open",
        description: "Registration for this hackathon has not started yet",
        variant: "destructive",
      });
      return;
    }

    if (now > registrationEnd) {
      toast({
        title: "Registration Closed",
        description: "Registration for this hackathon has ended",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.HACKATHONS.REGISTER(hackathon.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          team: `Team ${user.name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register for hackathon');
      }

      toast({
        title: "Registration Successful",
        description: "You have successfully registered for the hackathon",
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register for hackathon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isRegistered = hackathon.participants.some(
    participant => participant.user.id === user?.id
  );

  const getRegistrationStatus = () => {
    const now = new Date();
    const registrationStart = new Date(hackathon.registrationStartDate);
    const registrationEnd = new Date(hackathon.registrationEndDate);

    if (now < registrationStart) {
      return {
        status: 'upcoming',
        message: `Registration starts on ${registrationStart.toLocaleDateString()}`,
      };
    }

    if (now > registrationEnd) {
      return {
        status: 'closed',
        message: 'Registration closed',
      };
    }

    return {
      status: 'open',
      message: 'Registration open',
    };
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{hackathon.title}</CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary">{hackathon.mode}</Badge>
          <Badge variant={hackathon.status === 'ongoing' ? 'default' : 'secondary'}>
            {hackathon.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{hackathon.description}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            <span className="font-semibold">Date:</span>{" "}
            {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
            {new Date(hackathon.endDate).toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Team Size:</span>{" "}
            {hackathon.minTeamSize}-{hackathon.maxTeamSize} members
          </p>
          <p className="text-sm">
            <span className="font-semibold">Registration:</span>{" "}
            {registrationStatus.message}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Participants:</span>{" "}
            {hackathon.participants.length}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant={registrationStatus.status === 'open' ? 'default' : 'secondary'}>
          {registrationStatus.message}
        </Badge>
        {!isRegistered && registrationStatus.status === 'open' && (
          <Button 
            onClick={handleRegister} 
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Now"}
          </Button>
        )}
        {isRegistered && (
          <Button variant="outline" disabled>
            Already Registered
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
