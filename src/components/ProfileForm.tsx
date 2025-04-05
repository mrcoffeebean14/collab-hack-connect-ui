import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';

interface ProfileFormData {
  bio: string;
  githubId: string;
  technicalBackground: string;
  skills: string;
}

interface ProfileFormProps {
  initialData?: {
    bio: string;
    githubId: string;
    technicalBackground: string;
    skills: string[];
  };
  onSuccess?: () => void;
}

export default function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      bio: initialData?.bio || '',
      githubId: initialData?.githubId || '',
      technicalBackground: initialData?.technicalBackground || '',
      skills: initialData?.skills?.join(', ') || ''
    }
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Validate form data
      if (!data.bio?.trim() || !data.githubId?.trim() || !data.technicalBackground?.trim() || !data.skills?.trim()) {
        throw new Error('Please fill in all required fields');
      }

      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const skillsArray = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      
      if (skillsArray.length === 0) {
        throw new Error('Please enter at least one skill');
      }

      const requestBody = {
        bio: data.bio.trim(),
        githubId: data.githubId.trim(),
        technicalBackground: data.technicalBackground.trim(),
        skills: skillsArray
      };

      console.log('Form data before submission:', data);
      console.log('Processed request body:', requestBody);
      console.log('API Endpoint:', `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROFILE}`);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Handle specific validation errors
        if (errorData.message === 'Validation error') {
          throw new Error('Please fill in all required fields correctly');
        }
        
        throw new Error(errorData.message || `Failed to save profile. Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Success response:', responseData);
      
      toast({
        title: 'Success',
        description: initialData ? 'Profile updated successfully' : 'Profile created successfully',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Detailed error:', error);
      let errorMessage = 'Failed to save profile';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check if the server is running.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Profile endpoint not found. Please check the API configuration.';
        } else if (error.message.includes('Validation error')) {
          errorMessage = 'Please fill in all required fields correctly.';
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Textarea
          id="bio"
          {...register('bio')}
          className="mt-1"
          placeholder="Tell us about yourself"
        />
      </div>

      <div>
        <label htmlFor="githubId" className="block text-sm font-medium text-gray-700">
          GitHub ID
        </label>
        <Input
          id="githubId"
          type="text"
          {...register('githubId')}
          className="mt-1"
          placeholder="Your GitHub username"
        />
      </div>

      <div>
        <label htmlFor="technicalBackground" className="block text-sm font-medium text-gray-700">
          Technical Background
        </label>
        <Textarea
          id="technicalBackground"
          {...register('technicalBackground')}
          className="mt-1"
          placeholder="Describe your technical background and experience"
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <Input
          id="skills"
          type="text"
          {...register('skills')}
          className="mt-1"
          placeholder="Comma-separated list of skills"
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
      </Button>
    </form>
  );
} 