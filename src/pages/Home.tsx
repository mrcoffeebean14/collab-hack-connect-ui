import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Hackathon Connect</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with developers, collaborate on projects, and participate in exciting hackathons
        </p>
        <div className="space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/auth/login">
                <Button>Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </>
          ) : (
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          <p className="text-gray-600 mb-4">
            Find and collaborate on exciting projects with developers from around the world
          </p>
          <Link to="/projects">
            <Button variant="outline">Explore Projects</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Hackathons</h2>
          <p className="text-gray-600 mb-4">
            Participate in hackathons, showcase your skills, and win amazing prizes
          </p>
          <Link to="/hackathons">
            <Button variant="outline">View Hackathons</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Community</h2>
          <p className="text-gray-600 mb-4">
            Connect with like-minded developers and grow your network
          </p>
          <Link to="/about">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 