import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Hackathon {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
}

interface HackathonCardProps {
  hackathon: Hackathon;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{hackathon.title}</CardTitle>
        <CardDescription>{hackathon.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
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
        <Button className="w-full">View Details</Button>
      </CardContent>
    </Card>
  );
}
