import React, { useState, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link2, Twitter, Facebook, Instagram, Star, Search, ChevronLeft, ChevronRight, Users, X } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  registrationStartDate?: string;
  mode: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  status: 'UPCOMING' | 'OPEN' | 'ENDED';
  rating?: number;
  participantCount: number;
  participantAvatars: string[];
  themes: string[];
  featured?: boolean;
  image?: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  registered?: boolean;
  role?: 'PARTICIPANT' | 'ORGANIZER';
  teamName?: string;
  submissionStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED';
}

interface TeammateRequest {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  requiredSkills: string[];
  hackathonName: string;
  deadline: string;
  contactInfo: {
    name: string;
    avatar: string;
    role: string;
  };
}

interface TeamApplication {
  id: string;
  hackathonName: string;
  teamName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  teamLeader: {
    name: string;
    avatar: string;
    role: string;
  };
  members: {
    name: string;
    avatar: string;
    role: string;
  }[];
}

interface TeamJoinRequest {
  id: string;
  hackathonName: string;
  applicant: {
    name: string;
    avatar: string;
    role: string;
    skills: string[];
  };
  message: string;
  appliedAt: string;
}

const AVAILABLE_TECHNOLOGIES = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript',
  'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
  'TensorFlow', 'PyTorch', 'OpenCV', 'Solidity', 'Web3.js',
  'Unity', 'Unreal Engine', 'Flutter', 'React Native', 'Swift',
  'Kotlin', 'Java', 'C++', 'Rust', 'Go'
];

const AVAILABLE_SKILLS = [
  'Frontend Development', 'Backend Development', 'DevOps',
  'Machine Learning', 'Data Science', 'Blockchain',
  'UI/UX Design', 'Mobile Development', 'Game Development',
  'Cloud Architecture', 'System Design', 'Security',
  'Database Design', 'API Development', 'Testing'
];

const FeaturedHackathonSlide: React.FC<{ hackathon: Hackathon }> = ({ hackathon }) => (
  <div className="relative flex-[0_0_100%] min-w-0 pl-4 pr-4">
    <div className="grid grid-cols-12 gap-6 max-w-5xl mx-auto">
      <div className="col-span-7">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <img
            src={hackathon.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"}
            alt={hackathon.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-purple-500/90 text-white hover:bg-purple-600/90 backdrop-blur-sm border-0">
              UPCOMING
            </Badge>
          </div>
        </div>
      </div>
      <div className="col-span-5 flex flex-col justify-between py-2">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold mb-1">{hackathon.title}</h3>
            <p className="text-sm text-gray-500">Hackathon</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">THEME</p>
            <div className="flex flex-wrap gap-1">
              {hackathon.themes.map((theme) => (
                <Badge
                  key={theme}
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs"
                >
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-sm text-purple-600">
            {hackathon.registrationStartDate && (
              `Registration opens ${new Date(hackathon.registrationStartDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}`
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-1 flex-wrap">
            <Badge variant="outline" className="text-gray-600 text-xs">
              {hackathon.mode}
            </Badge>
            <Badge variant="outline" className="text-gray-600 text-xs">
              STARTS {new Date(hackathon.startDate).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {hackathon.socialLinks.website && (
                <Link2 className="w-4 h-4 text-blue-600 cursor-pointer" />
              )}
              {hackathon.socialLinks.twitter && (
                <Twitter className="w-4 h-4 text-blue-600 cursor-pointer" />
              )}
            </div>
            <Button size="sm" variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
              Get notified
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HackathonCard: React.FC<{ hackathon: Hackathon; isPast?: boolean }> = ({ hackathon, isPast = false }) => (
  <Card className="bg-white rounded-lg hover:shadow-md transition-shadow">
    <CardHeader className="space-y-0 pb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{hackathon.title}</h3>
          <p className="text-sm text-gray-500">Hackathon</p>
        </div>
        <div className="flex gap-2">
          {hackathon.socialLinks.website && (
            <Link2 className="w-5 h-5 text-blue-600 cursor-pointer" />
          )}
          {hackathon.socialLinks.twitter && (
            <Twitter className="w-5 h-5 text-blue-600 cursor-pointer" />
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">THEME</p>
          <div className="flex flex-wrap gap-2">
            {hackathon.themes.map((theme) => (
              <Badge
                key={theme}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {hackathon.participantAvatars.slice(0, 3).map((avatar, i) => (
                <Avatar key={i} className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={avatar} />
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-emerald-600">
              +{hackathon.participantCount} {isPast ? 'participated' : 'participating'}
            </span>
          </div>
          {hackathon.rating && (
            <div className="flex items-center gap-1">
              <span className="text-amber-500 font-medium">{hackathon.rating}</span>
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="text-gray-600">
              {hackathon.mode}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {hackathon.status}
            </Badge>
          </div>
          <Button
            className={isPast ? "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50" : ""}
          >
            {isPast ? 'See projects' : 'Apply now'}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HackathonHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'hackathons' | 'teammates' | 'your-hackathons'>('hackathons');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createRequestForm, setCreateRequestForm] = useState({
    title: '',
    description: '',
    technologies: [] as string[],
    requiredSkills: [] as string[],
    hackathonName: '',
    deadline: '',
  });
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
  });

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setSelectedSlide(emblaApi.selectedScrollSnap());
      });

      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [emblaApi]);

  // Updated featured hackathons data to show only upcoming events
  const featuredHackathons: Hackathon[] = [
    {
      id: 'featured-1',
      title: 'Web3 Innovation Summit 2025',
      description: 'Shape the future of decentralized web',
      startDate: '2024-12-15',
      registrationStartDate: '2024-09-01',
      mode: 'HYBRID',
      status: 'UPCOMING',
      participantCount: 0,
      participantAvatars: [],
      themes: ['WEB3', 'BLOCKCHAIN', 'DeFi'],
      featured: true,
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: 'featured-2',
      title: 'Space Tech Challenge 2025',
      description: 'Innovate for the next frontier of space exploration',
      startDate: '2025-01-20',
      registrationStartDate: '2024-10-15',
      mode: 'ONLINE',
      status: 'UPCOMING',
      participantCount: 0,
      participantAvatars: [],
      themes: ['SPACE', 'AI/ML', 'ROBOTICS'],
      featured: true,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: 'featured-3',
      title: 'Metaverse Creators Summit',
      description: 'Build the next generation of immersive experiences',
      startDate: '2025-02-10',
      registrationStartDate: '2024-11-01',
      mode: 'HYBRID',
      status: 'UPCOMING',
      participantCount: 0,
      participantAvatars: [],
      themes: ['METAVERSE', 'AR/VR', 'GAMING'],
      featured: true,
      image: 'https://images.unsplash.com/photo-1614066891921-5c2c9e3bc0d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    }
  ];

  // Mock data - replace with actual API call
  const openHackathons: Hackathon[] = [
    {
      id: '1',
      title: 'NITDGP Hacks 2.0',
      description: 'Join the largest AI hackathon',
      startDate: '2024-06-04',
      mode: 'OFFLINE',
      status: 'OPEN',
      participantCount: 1000,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      ],
      themes: ['FINTECH', 'AI/ML', 'HEALTHTECH'],
      socialLinks: {
        facebook: '#',
        instagram: '#'
      }
    },
    {
      id: '2',
      title: 'Hack On Hills 6.0',
      description: 'The biggest hackathon in the hills',
      startDate: '2024-11-04',
      mode: 'OFFLINE',
      status: 'OPEN',
      participantCount: 1000,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
      ],
      themes: ['NO RESTRICTIONS'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '5',
      title: 'CyberSec Challenge',
      description: 'Security and ethical hacking competition',
      startDate: '2024-07-15',
      mode: 'HYBRID',
      status: 'OPEN',
      participantCount: 750,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
      ],
      themes: ['CYBERSECURITY', 'BLOCKCHAIN'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '6',
      title: 'GreenTech Innovate',
      description: 'Sustainable technology solutions',
      startDate: '2024-08-20',
      mode: 'ONLINE',
      status: 'OPEN',
      participantCount: 600,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=16',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=17',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=18',
      ],
      themes: ['SUSTAINABILITY', 'CLEANTECH'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '7',
      title: 'EdTech Summit',
      description: 'Future of education technology',
      startDate: '2024-09-10',
      mode: 'HYBRID',
      status: 'OPEN',
      participantCount: 800,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=19',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=20',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=21',
      ],
      themes: ['EDTECH', 'AI/ML'],
      socialLinks: {
        website: '#',
        facebook: '#'
      }
    },
    {
      id: '8',
      title: 'HealthTech Innovation',
      description: 'Healthcare solutions hackathon',
      startDate: '2024-10-05',
      mode: 'OFFLINE',
      status: 'OPEN',
      participantCount: 450,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=22',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=23',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=24',
      ],
      themes: ['HEALTHCARE', 'IOT'],
      socialLinks: {
        website: '#',
        instagram: '#'
      }
    },
    {
      id: '9',
      title: 'GameDev Challenge',
      description: 'Game development competition',
      startDate: '2024-11-15',
      mode: 'ONLINE',
      status: 'OPEN',
      participantCount: 900,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=25',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=26',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=27',
      ],
      themes: ['GAMING', 'AR/VR'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '10',
      title: 'Smart Cities Hack',
      description: 'Urban innovation challenge',
      startDate: '2024-12-01',
      mode: 'HYBRID',
      status: 'OPEN',
      participantCount: 550,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=28',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=29',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=30',
      ],
      themes: ['SMART CITIES', 'IOT'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    }
  ];

  const pastHackathons: Hackathon[] = [
    {
      id: '3',
      title: 'NextQuantum 2.0',
      description: 'Quantum computing hackathon',
      startDate: '2024-03-15',
      mode: 'OFFLINE',
      status: 'ENDED',
      rating: 2.2,
      participantCount: 250,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
      ],
      themes: ['NO RESTRICTIONS'],
      socialLinks: {}
    },
    {
      id: '4',
      title: 'AM Hacks',
      description: 'Advanced manufacturing hackathon',
      startDate: '2024-03-10',
      mode: 'ONLINE',
      status: 'ENDED',
      participantCount: 1000,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
      ],
      themes: ['BLOCKCHAIN', 'AI/ML'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '11',
      title: 'DataScience Summit',
      description: 'Big data analytics challenge',
      startDate: '2024-02-20',
      mode: 'HYBRID',
      status: 'ENDED',
      rating: 4.8,
      participantCount: 800,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=31',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=32',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=33',
      ],
      themes: ['DATA SCIENCE', 'AI/ML'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    },
    {
      id: '12',
      title: 'RoboHacks',
      description: 'Robotics and automation challenge',
      startDate: '2024-01-15',
      mode: 'OFFLINE',
      status: 'ENDED',
      rating: 4.5,
      participantCount: 400,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=34',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=35',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=36',
      ],
      themes: ['ROBOTICS', 'IOT'],
      socialLinks: {
        website: '#',
        facebook: '#'
      }
    },
    {
      id: '13',
      title: 'CloudNative Con',
      description: 'Cloud computing solutions',
      startDate: '2024-02-01',
      mode: 'ONLINE',
      status: 'ENDED',
      rating: 4.2,
      participantCount: 600,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=37',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=38',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=39',
      ],
      themes: ['CLOUD', 'DEVOPS'],
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    }
  ];

  // Update the FeaturedHackathonSlide to show registration start date
  const getRegistrationInfo = (hackathon: Hackathon) => {
    if (hackathon.registrationStartDate) {
      const date = new Date(hackathon.registrationStartDate);
      return `Registration opens ${date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    }
    return '';
  };

  // Add this after other const declarations but before the return statement
  const teammateRequests: TeammateRequest[] = [
    {
      id: '1',
      title: 'Looking for Full-Stack Developer',
      description: 'Need an experienced developer for MERN stack project in upcoming hackathon',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      requiredSkills: ['TypeScript', 'REST APIs', 'Database Design'],
      hackathonName: 'Web3 Innovation Summit 2025',
      deadline: '2024-08-15',
      contactInfo: {
        name: 'Alex Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        role: 'Frontend Lead'
      }
    },
    {
      id: '2',
      title: 'AI/ML Engineer Needed',
      description: 'Seeking ML expert for computer vision project',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'PyTorch'],
      requiredSkills: ['Deep Learning', 'Computer Vision', 'Data Processing'],
      hackathonName: 'Smart Cities Hack',
      deadline: '2024-09-01',
      contactInfo: {
        name: 'Sarah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        role: 'ML Engineer'
      }
    },
    {
      id: '3',
      title: 'Blockchain Developer Wanted',
      description: 'Looking for someone with Solidity experience for DeFi project',
      technologies: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts'],
      requiredSkills: ['DeFi', 'Smart Contract Security', 'Gas Optimization'],
      hackathonName: 'CyberSec Challenge',
      deadline: '2024-07-30',
      contactInfo: {
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        role: 'Blockchain Developer'
      }
    },
    {
      id: '4',
      title: 'UI/UX Designer Required',
      description: 'Need creative designer for AR/VR gaming interface',
      technologies: ['Figma', 'Adobe XD', 'Unity', 'Blender'],
      requiredSkills: ['3D Design', 'User Research', 'Prototyping'],
      hackathonName: 'GameDev Challenge',
      deadline: '2024-08-20',
      contactInfo: {
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        role: 'UX Designer'
      }
    },
    {
      id: '5',
      title: 'DevOps Engineer Needed',
      description: 'Seeking cloud expert for scalable architecture',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
      requiredSkills: ['CI/CD', 'Infrastructure as Code', 'Monitoring'],
      hackathonName: 'CloudNative Con',
      deadline: '2024-09-15',
      contactInfo: {
        name: 'David Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        role: 'DevOps Lead'
      }
    },
    {
      id: '6',
      title: 'IoT Developer Required',
      description: 'Looking for embedded systems expert for smart city project',
      technologies: ['Arduino', 'Raspberry Pi', 'MQTT', 'C++'],
      requiredSkills: ['Sensor Integration', 'Low-level Programming', 'Networking'],
      hackathonName: 'Smart Cities Hack',
      deadline: '2024-08-30',
      contactInfo: {
        name: 'Lisa Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        role: 'IoT Specialist'
      }
    }
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement request creation logic
    console.log('Form submitted:', createRequestForm);
    setIsCreateModalOpen(false);
    // Reset form
    setCreateRequestForm({
      title: '',
      description: '',
      technologies: [],
      requiredSkills: [],
      hackathonName: '',
      deadline: '',
    });
  };

  // Add after other const declarations
  const yourHackathons: Hackathon[] = [
    {
      id: 'your-1',
      title: 'NITDGP Hacks 2.0',
      description: 'Join the largest AI hackathon',
      startDate: '2024-06-04',
      mode: 'OFFLINE',
      status: 'OPEN',
      participantCount: 1000,
      participantAvatars: [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      ],
      themes: ['FINTECH', 'AI/ML', 'HEALTHTECH'],
      registered: true,
      role: 'PARTICIPANT',
      teamName: 'Tech Titans',
      submissionStatus: 'IN_PROGRESS',
      socialLinks: {
        facebook: '#',
        instagram: '#'
      }
    },
    {
      id: 'your-2',
      title: 'Web3 Innovation Summit 2025',
      description: 'Shape the future of decentralized web',
      startDate: '2024-12-15',
      registrationStartDate: '2024-09-01',
      mode: 'HYBRID',
      status: 'UPCOMING',
      participantCount: 0,
      participantAvatars: [],
      themes: ['WEB3', 'BLOCKCHAIN', 'DeFi'],
      registered: true,
      role: 'ORGANIZER',
      submissionStatus: 'NOT_STARTED',
      socialLinks: {
        website: '#',
        twitter: '#'
      }
    }
  ];

  // Add this component within HackathonHub
  const YourHackathonCard: React.FC<{ hackathon: Hackathon }> = ({ hackathon }) => (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{hackathon.title}</h3>
            <Badge 
              variant="outline" 
              className={cn(
                "mt-2",
                hackathon.role === 'ORGANIZER' 
                  ? "border-purple-500 text-purple-700" 
                  : "border-blue-500 text-blue-700"
              )}
            >
              {hackathon.role}
            </Badge>
          </div>
          {hackathon.role === 'PARTICIPANT' && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm",
                hackathon.submissionStatus === 'SUBMITTED' 
                  ? "border-green-500 text-green-700"
                  : hackathon.submissionStatus === 'IN_PROGRESS'
                  ? "border-yellow-500 text-yellow-700"
                  : "border-gray-500 text-gray-700"
              )}
            >
              {hackathon.submissionStatus?.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">THEME</p>
          <div className="flex flex-wrap gap-2">
            {hackathon.themes.map((theme) => (
              <Badge
                key={theme}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </div>

        {hackathon.role === 'PARTICIPANT' && hackathon.teamName && (
          <div>
            <p className="text-sm text-gray-600 mb-2">TEAM</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {hackathon.participantAvatars.slice(0, 3).map((avatar, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={avatar} />
                  </Avatar>
                ))}
              </div>
              <span className="text-sm font-medium">{hackathon.teamName}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div>
            <Badge variant="outline" className="text-gray-600 mr-2">
              {hackathon.mode}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {hackathon.status}
            </Badge>
          </div>
          <Button 
            className={cn(
              "px-6",
              hackathon.role === 'ORGANIZER' 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {hackathon.role === 'ORGANIZER' ? 'Manage' : 'View Project'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Add this after other const declarations
  const teamApplications: TeamApplication[] = [
    {
      id: 'app-1',
      hackathonName: 'Smart Cities Hack',
      teamName: 'Urban Innovators',
      status: 'PENDING',
      appliedAt: '2024-07-20',
      teamLeader: {
        name: 'John Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        role: 'Project Lead'
      },
      members: [
        {
          name: 'Alice Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
          role: 'UI Designer'
        },
        {
          name: 'Bob Wilson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
          role: 'Backend Developer'
        }
      ]
    },
    {
      id: 'app-2',
      hackathonName: 'GameDev Challenge',
      teamName: 'Pixel Pirates',
      status: 'ACCEPTED',
      appliedAt: '2024-07-15',
      teamLeader: {
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        role: 'Game Designer'
      },
      members: [
        {
          name: 'Tom Brown',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
          role: '3D Artist'
        }
      ]
    }
  ];

  const teamJoinRequests: TeamJoinRequest[] = [
    {
      id: 'req-1',
      hackathonName: 'NITDGP Hacks 2.0',
      applicant: {
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        role: 'Frontend Developer',
        skills: ['React', 'TypeScript', 'UI/UX']
      },
      message: "I'm interested in joining your team. I have experience in frontend development and UI design.",
      appliedAt: '2024-07-22'
    },
    {
      id: 'req-2',
      hackathonName: 'NITDGP Hacks 2.0',
      applicant: {
        name: 'Mike Ross',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        role: 'Backend Developer',
        skills: ['Node.js', 'MongoDB', 'AWS']
      },
      message: "Looking to contribute to your project with my backend expertise.",
      appliedAt: '2024-07-21'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 relative">
          {/* Left side - Your hackathons button */}
          <div className="absolute left-4">
            <Button 
              variant="outline" 
              className={cn(
                "bg-blue-50 text-blue-600 hover:bg-blue-100 text-base px-6 py-2 h-auto whitespace-nowrap",
                activeTab === 'your-hackathons' && "bg-blue-100"
              )}
              onClick={() => setActiveTab('your-hackathons')}
            >
              Your hackathons
            </Button>
          </div>

          {/* Center - Navigation buttons */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === 'hackathons' ? 'default' : 'ghost'}
              className={cn(
                "text-base font-medium px-6 rounded-lg",
                activeTab === 'hackathons' 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-600 hover:text-blue-600 bg-transparent"
              )}
              onClick={() => setActiveTab('hackathons')}
            >
              Hackathons
            </Button>
            <Button
              variant={activeTab === 'teammates' ? 'default' : 'ghost'}
              className={cn(
                "text-base font-medium px-6 rounded-lg",
                activeTab === 'teammates'
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-600 bg-transparent"
              )}
              onClick={() => setActiveTab('teammates')}
            >
              <Users className="w-4 h-4 mr-2" />
              Find Teammates
            </Button>
          </div>
        </div>
      </div>

      {/* Create Request Button */}
      {activeTab === 'teammates' && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-6 py-2 h-auto"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Teammate Request</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new teammate request for your hackathon project.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateRequest} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Looking for Full-Stack Developer"
                  value={createRequestForm.title}
                  onChange={(e) => setCreateRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role and requirements..."
                  value={createRequestForm.description}
                  onChange={(e) => setCreateRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1.5 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hackathon">Hackathon</Label>
                <Select
                  value={createRequestForm.hackathonName}
                  onValueChange={(value) => setCreateRequestForm(prev => ({ ...prev, hackathonName: value }))}
                  required
                >
                  <SelectTrigger id="hackathon" className="mt-1.5">
                    <SelectValue placeholder="Select hackathon" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...openHackathons, ...featuredHackathons].map((hackathon) => (
                      <SelectItem key={hackathon.id} value={hackathon.title}>
                        {hackathon.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="technologies">Required Technologies</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {AVAILABLE_TECHNOLOGIES.map((tech) => (
                    <Badge
                      key={tech}
                      variant={createRequestForm.technologies.includes(tech) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        createRequestForm.technologies.includes(tech)
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => {
                        setCreateRequestForm(prev => ({
                          ...prev,
                          technologies: prev.technologies.includes(tech)
                            ? prev.technologies.filter(t => t !== tech)
                            : [...prev.technologies, tech]
                        }));
                      }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Required Skills</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={createRequestForm.requiredSkills.includes(skill) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        createRequestForm.requiredSkills.includes(skill)
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => {
                        setCreateRequestForm(prev => ({
                          ...prev,
                          requiredSkills: prev.requiredSkills.includes(skill)
                            ? prev.requiredSkills.filter(s => s !== skill)
                            : [...prev.requiredSkills, skill]
                        }));
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={createRequestForm.deadline}
                  onChange={(e) => setCreateRequestForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Create Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'your-hackathons' ? (
          <div className="space-y-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Hackathons</h1>
              <p className="text-gray-600">Manage your hackathon participations and team activities</p>
            </div>
            
            {/* Upcoming Hackathons Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Upcoming Hackathons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yourHackathons.map((hackathon) => (
                  <YourHackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            </section>

            {/* Team Applications Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Your Team Applications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamApplications.map((application) => (
                  <Card key={application.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{application.hackathonName}</h3>
                          <p className="text-sm text-gray-500">Team: {application.teamName}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-sm",
                            application.status === 'ACCEPTED' 
                              ? "border-green-500 text-green-700"
                              : application.status === 'REJECTED'
                              ? "border-red-500 text-red-700"
                              : "border-yellow-500 text-yellow-700"
                          )}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">TEAM MEMBERS</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border-2 border-purple-200">
                              <AvatarImage src={application.teamLeader.avatar} />
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{application.teamLeader.name}</p>
                              <p className="text-xs text-gray-500">{application.teamLeader.role}</p>
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {application.members.map((member, i) => (
                              <Avatar key={i} className="w-8 h-8 border-2 border-white">
                                <AvatarImage src={member.avatar} />
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(application.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Team Join Requests Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Team Join Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamJoinRequests.map((request) => (
                  <Card key={request.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={request.applicant.avatar} />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.applicant.name}</h3>
                          <p className="text-sm text-gray-500">{request.applicant.role}</p>
                        </div>
                      </div>
                      <Badge className="mt-2 bg-blue-100 text-blue-700">
                        {request.hackathonName}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{request.message}</p>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-2">SKILLS</p>
                        <div className="flex flex-wrap gap-2">
                          {request.applicant.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-gray-100 text-gray-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4">
                        <p className="text-sm text-gray-500">
                          Received: {new Date(request.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                            Decline
                          </Button>
                          <Button className="bg-green-600 text-white hover:bg-green-700">
                            Accept
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        ) : activeTab === 'hackathons' ? (
          <>
            <div className="flex justify-center items-center mb-12">
              <div className="w-full max-w-2xl relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                  placeholder="Type to begin search, or use the global shortcut"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-24 py-6 w-full text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <kbd className="px-2.5 py-1.5 bg-white rounded-lg text-sm font-medium shadow-sm">Ctrl</kbd>
                  <span className="text-gray-500">+</span>
                  <kbd className="px-2.5 py-1.5 bg-white rounded-lg text-sm font-medium shadow-sm">K</kbd>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="overflow-hidden rounded-xl bg-gray-50" ref={emblaRef}>
                <div className="flex">
                  {featuredHackathons.map((hackathon) => (
                    <div key={hackathon.id} className="relative flex-[0_0_100%] min-w-0 pl-4 pr-4">
                      <div className="grid grid-cols-12 gap-6 max-w-5xl mx-auto">
                        <div className="col-span-7">
                          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                            <img
                              src={hackathon.image}
                              alt={hackathon.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary" className="bg-purple-500/90 text-white hover:bg-purple-600/90 backdrop-blur-sm border-0">
                                UPCOMING
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-5 flex flex-col justify-between py-2">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xl font-bold mb-1">{hackathon.title}</h3>
                              <p className="text-sm text-gray-500">Hackathon</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">THEME</p>
                              <div className="flex flex-wrap gap-1">
                                {hackathon.themes.map((theme) => (
                                  <Badge
                                    key={theme}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs"
                                  >
                                    {theme}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-purple-600">
                              {getRegistrationInfo(hackathon)}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex gap-1 flex-wrap">
                              <Badge variant="outline" className="text-gray-600 text-xs">
                                {hackathon.mode}
                              </Badge>
                              <Badge variant="outline" className="text-gray-600 text-xs">
                                STARTS {new Date(hackathon.startDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {hackathon.socialLinks.website && (
                                  <Link2 className="w-4 h-4 text-blue-600 cursor-pointer" />
                                )}
                                {hackathon.socialLinks.twitter && (
                                  <Twitter className="w-4 h-4 text-blue-600 cursor-pointer" />
                                )}
                              </div>
                              <Button size="sm" variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                                Get notified
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-3">
                {featuredHackathons.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      selectedSlide === index ? "bg-purple-600 w-3" : "bg-gray-300"
                    )}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Open</h2>
                  <Button variant="ghost" className="text-blue-600">
                    All open hackathons →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Past</h2>
                  <Button variant="ghost" className="text-blue-600">
                    All past hackathons →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} isPast />
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="mb-12">
              <h1 className="text-3xl font-bold mb-4">Find Teammates</h1>
              <p className="text-gray-600">Connect with potential teammates for upcoming hackathons</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teammateRequests.map((request) => (
                <Card key={request.id} className="bg-white hover:shadow-lg transition-shadow">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={request.contactInfo.avatar} />
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.contactInfo.name}</h3>
                          <p className="text-sm text-gray-500">{request.contactInfo.role}</p>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-lg">{request.title}</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {request.hackathonName}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{request.description}</p>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">TECHNOLOGIES</p>
                      <div className="flex flex-wrap gap-2">
                        {request.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">REQUIRED SKILLS</p>
                      <div className="flex flex-wrap gap-2">
                        {request.requiredSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-gray-600"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="text-sm text-gray-500">
                        Deadline: {new Date(request.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <Button className="bg-blue-600 text-white hover:bg-blue-700">
                        Request to Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="text-gray-600 text-sm">
                CodeSetu is a platform connecting developers through hackathons and collaborative projects.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
                <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Browse Hackathons</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Find Teammates</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Host a Hackathon</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Community</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Support</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-gray-600">Email: contact@codesetu.com</li>
                <li className="text-gray-600">Location: Bangalore, India</li>
                <li><a href="#" className="text-gray-600 hover:text-blue-500">Contact Form</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} CodeSetu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HackathonHub; 