import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';

interface ProjectFormData {
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
  demoUrl: string;
  lookingFor: string;
  startDate: string;
  endDate: string;
}

interface ProjectFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export default function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: initialData || {
      techStack: '',
      lookingFor: ''
    }
  });
  const { toast } = useToast();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const requestBody = {
        ...data,
        techStack: data.techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
        lookingFor: data.lookingFor.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROJECTS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project');
      }

      toast({
        title: 'Success',
        description: initialData ? 'Project updated successfully' : 'Project created successfully',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save project',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter project title"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe your project"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
        <Input
          id="techStack"
          {...register('techStack', { required: 'Tech stack is required' })}
          placeholder="React, Node.js, MongoDB"
        />
        {errors.techStack && <p className="text-sm text-red-500">{errors.techStack.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="githubUrl">GitHub Repository URL</Label>
        <Input
          id="githubUrl"
          type="url"
          {...register('githubUrl')}
          placeholder="https://github.com/username/repo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="demoUrl">Demo URL</Label>
        <Input
          id="demoUrl"
          type="url"
          {...register('demoUrl')}
          placeholder="https://your-project-demo.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lookingFor">Looking For (comma-separated)</Label>
        <Input
          id="lookingFor"
          {...register('lookingFor')}
          placeholder="Frontend Developer, Backend Developer, UI/UX Designer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : (initialData ? 'Update Project' : 'Create Project')}
      </Button>
    </form>
  );
} 