import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">About Hackathon Connect</h1>
        <p className="text-xl text-gray-600 mb-8">
          A platform connecting developers, fostering collaboration, and powering innovation
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Hackathon Connect aims to create a vibrant community where developers can:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Find exciting projects to collaborate on</li>
            <li>Participate in hackathons and showcase their skills</li>
            <li>Connect with like-minded developers</li>
            <li>Learn and grow through community engagement</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Project collaboration and management</li>
            <li>Hackathon registration and participation</li>
            <li>Team formation and communication</li>
            <li>Resource sharing and learning</li>
            <li>Community engagement and networking</li>
          </ul>
        </div>
      </section>

      <section className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
        <p className="text-gray-600 mb-8">
          Be part of a growing community of developers and innovators
        </p>
        <Link to="/auth/register">
          <Button>Get Started</Button>
        </Link>
      </section>
    </div>
  );
} 