
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Award, Clock } from "lucide-react";

interface HackathonCardProps {
  hackathon: {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    prizes: string;
    registrationDeadline: string;
  };
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  return (
    <Card className="overflow-hidden transition duration-300 hover:shadow-md flex flex-col h-full">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pb-3">
        <CardTitle className="text-xl text-gray-800">{hackathon.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-12">{hackathon.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-2 flex-1">
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Date</h4>
              <p className="text-sm text-gray-600">{hackathon.date}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Location</h4>
              <p className="text-sm text-gray-600">{hackathon.location}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <Award className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Prizes</h4>
              <p className="text-sm text-gray-600">{hackathon.prizes}</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Registration Deadline</h4>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {hackathon.registrationDeadline}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Register Now</Button>
      </CardFooter>
    </Card>
  );
};

export default HackathonCard;
