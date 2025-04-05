import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { API_CONFIG, API_ENDPOINTS } from '@/config/constants';

interface HackathonFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  venue: string;
  maxTeamSize: string;
  registrationDeadline: string;
  techStack: string;
  prizes: string;
}

interface HackathonFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export default function HackathonForm({ initialData, onSuccess }: HackathonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<HackathonFormData>({
    defaultValues: initialData || {
      techStack: '',
      prizes: ''
    }
  });
  const { toast } = useToast();

  const mode = watch('mode');

  const onSubmit = async (data: HackathonFormData) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const requestBody = {
        ...data,
        techStack: data.techStack.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0),
        prizes: data.prizes.split(',').map(prize => {
          const [rank, amount] = prize.split(':').map(item => item.trim());
          return { rank, prize: amount };
        })
      };

      console.log('Submitting hackathon data:', requestBody);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.HACKATHONS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save hackathon');
      }

      const responseData = await response.json();
      console.log('Hackathon created successfully:', responseData);

      toast({
        title: 'Success',
        description: initialData ? 'Hackathon updated successfully' : 'Hackathon created successfully',
      });

      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save hackathon',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Hackathon Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter hackathon title"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'Description is required' })}
          placeholder="Describe your hackathon"
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
          />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate', { required: 'End date is required' })}
          />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mode">Mode</Label>
        <Select
          onValueChange={(value) => setValue('mode', value)}
          defaultValue={initialData?.mode || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {errors.mode && <p className="text-sm text-red-500">{errors.mode.message}</p>}
      </div>

      {mode !== 'online' && (
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            {...register('venue', { required: mode !== 'online' ? 'Venue is required for offline/hybrid events' : false })}
            placeholder="Enter venue details"
          />
          {errors.venue && <p className="text-sm text-red-500">{errors.venue.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
        <Input
          id="maxTeamSize"
          type="number"
          {...register('maxTeamSize', { required: 'Maximum team size is required' })}
          placeholder="Enter maximum team size"
        />
        {errors.maxTeamSize && <p className="text-sm text-red-500">{errors.maxTeamSize.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationDeadline">Registration Deadline</Label>
        <Input
          id="registrationDeadline"
          type="date"
          {...register('registrationDeadline', { required: 'Registration deadline is required' })}
        />
        {errors.registrationDeadline && <p className="text-sm text-red-500">{errors.registrationDeadline.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
        <Input
          id="techStack"
          {...register('techStack')}
          placeholder="React, Node.js, MongoDB"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prizes">Prizes (format: rank:prize, comma-separated)</Label>
        <Input
          id="prizes"
          {...register('prizes')}
          placeholder="1st:$1000, 2nd:$500, 3rd:$250"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (initialData ? 'Update Hackathon' : 'Create Hackathon')}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            reset();
            if (onSuccess) {
              onSuccess();
            }
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 