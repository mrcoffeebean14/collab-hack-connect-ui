
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code, Briefcase } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    members: string[];
    technologies: string[];
    openPositions: string[];
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden transition duration-300 hover:shadow-md flex flex-col h-full">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 pb-3">
        <CardTitle className="text-xl text-gray-800">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-12">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-2 flex-1">
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Team Members</h4>
              <p className="text-sm text-gray-600">{project.members.join(', ')}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <Code className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Technologies</h4>
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-start gap-2">
            <Briefcase className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Open Positions</h4>
              <div className="flex flex-wrap gap-1">
                {project.openPositions.map((position, index) => (
                  <Badge key={index} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                    {position}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Join Project</Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
