import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';
import useHazardStore from '../../store/hazardStore';
import { HazardSeverity, HazardType } from '../../types';
import MapSelector from './MapSelector';

interface HazardFormData {
  title: string;
  description: string;
  type: HazardType;
  severity: HazardSeverity;
  address: string;
}

const HazardForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<HazardFormData>();
  const { user } = useAuthStore();
  const { addHazard, isLoading } = useHazardStore();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const hazardTypes = [
    { value: 'road-damage', label: 'Road Damage' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'fallen-tree', label: 'Fallen Tree' },
    { value: 'power-outage', label: 'Power Outage' },
    { value: 'gas-leak', label: 'Gas Leak' },
    { value: 'structural-damage', label: 'Structural Damage' },
    { value: 'fire-hazard', label: 'Fire Hazard' },
    { value: 'other', label: 'Other' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low - Minor issue, no immediate danger' },
    { value: 'medium', label: 'Medium - Moderate concern, potential risk' },
    { value: 'high', label: 'High - Serious issue requiring prompt attention' },
    { value: 'critical', label: 'Critical - Immediate danger to life or property' }
  ];

  const onSubmit = async (data: HazardFormData) => {
    if (!location) {
      alert('Please select a location on the map');
      return;
    }

    if (!user) {
      alert('You must be logged in to report a hazard');
      navigate('/login');
      return;
    }

    try {
      await addHazard({
        title: data.title,
        description: data.description,
        type: data.type,
        severity: data.severity,
        status: 'reported',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: data.address
        },
        reportedBy: user.id
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit hazard report:', error);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
    setShowMap(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Hazard Title"
        placeholder="E.g., Large pothole on Main Street"
        fullWidth
        error={errors.title?.message}
        {...register('title', { 
          required: 'Title is required',
          minLength: {
            value: 5,
            message: 'Title must be at least 5 characters'
          }
        })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Hazard Type"
          options={hazardTypes}
          fullWidth
          error={errors.type?.message}
          {...register('type', { required: 'Please select a hazard type' })}
        />
        
        <Select
          label="Severity Level"
          options={severityLevels}
          fullWidth
          error={errors.severity?.message}
          {...register('severity', { required: 'Please select a severity level' })}
        />
      </div>
      
      <TextArea
        label="Description"
        placeholder="Please provide details about the hazard..."
        rows={4}
        fullWidth
        error={errors.description?.message}
        {...register('description', { 
          required: 'Description is required',
          minLength: {
            value: 10,
            message: 'Description must be at least 10 characters'
          }
        })}
      />
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Address or location description"
            fullWidth
            error={errors.address?.message}
            {...register('address', { required: 'Address is required' })}
          />
          
          <Button 
            type="button"
            variant="outline"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-5 w-5 mr-1" />
            {location ? 'Change' : 'Select'}
          </Button>
        </div>
        
        {location && (
          <p className="text-sm text-green-600">
            Location selected: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        )}
        
        {showMap && (
          <div className="mt-2 border border-gray-300 rounded-md overflow-hidden h-64">
            <MapSelector onLocationSelect={handleLocationSelect} />
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          disabled={!location}
        >
          Submit Hazard Report
        </Button>
      </div>
    </form>
  );
};

export default HazardForm;