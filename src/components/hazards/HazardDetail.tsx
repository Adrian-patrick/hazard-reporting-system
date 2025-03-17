import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, Calendar, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Select from '../ui/Select';
import TextArea from '../ui/TextArea';
import useHazardStore from '../../store/hazardStore';
import useAuthStore from '../../store/authStore';
import { HazardStatus } from '../../types';
import MapView from './MapView';

const HazardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getHazardById, updateHazardStatus, isLoading } = useHazardStore();
  const { user } = useAuthStore();
  const [status, setStatus] = React.useState<HazardStatus>('reported');
  const [resolutionDetails, setResolutionDetails] = React.useState('');
  
  const hazard = id ? getHazardById(id) : undefined;
  
  React.useEffect(() => {
    if (hazard) {
      setStatus(hazard.status);
      setResolutionDetails(hazard.resolutionDetails || '');
    }
  }, [hazard]);
  
  if (!hazard) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Hazard not found</h2>
        <p className="text-gray-500 mt-2">The hazard you're looking for doesn't exist or has been removed.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'reported':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'default';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      case 'critical':
        return 'danger';
      default:
        return 'default';
    }
  };
  
  const handleStatusUpdate = async () => {
    if (!id) return;
    
    try {
      await updateHazardStatus(id, status, resolutionDetails);
    } catch (error) {
      console.error('Failed to update hazard status:', error);
    }
  };
  
  const isAuthority = user?.role === 'authority' || user?.role === 'admin';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{hazard.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={getStatusVariant(hazard.status)}>
              {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge variant={getSeverityVariant(hazard.severity)}>
              {hazard.severity.charAt(0).toUpperCase() + hazard.severity.slice(1)} Severity
            </Badge>
            <Badge variant="secondary">
              {hazard.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{hazard.description}</p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
            <div className="flex items-center text-gray-700 mb-3">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              {hazard.location.address}
            </div>
            <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
              <MapView 
                latitude={hazard.location.latitude} 
                longitude={hazard.location.longitude} 
                zoom={15}
                markers={[{
                  position: [hazard.location.latitude, hazard.location.longitude],
                  title: hazard.title
                }]}
              />
            </div>
          </Card>
          
          {hazard.status === 'resolved' && hazard.resolutionDetails && (
            <Card>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Resolution Details</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{hazard.resolutionDetails}</p>
              {hazard.resolutionDate && (
                <p className="text-sm text-gray-500 mt-4">
                  Resolved on {format(new Date(hazard.resolutionDate), 'PPP')}
                </p>
              )}
            </Card>
          )}
          
          {isAuthority && hazard.status !== 'resolved' && (
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-4">
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as HazardStatus)}
                  options={[
                    { value: 'reported', label: 'Reported' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'resolved', label: 'Resolved' },
                    { value: 'dismissed', label: 'Dismissed' }
                  ]}
                />
                
                {(status === 'resolved' || status === 'dismissed') && (
                  <TextArea
                    label={status === 'resolved' ? 'Resolution Details' : 'Dismissal Reason'}
                    placeholder={status === 'resolved' ? 'Describe how this hazard was resolved...' : 'Explain why this report is being dismissed...'}
                    value={resolutionDetails}
                    onChange={(e) => setResolutionDetails(e.target.value)}
                    rows={4}
                  />
                )}
                
                <Button
                  variant="primary"
                  onClick={handleStatusUpdate}
                  isLoading={isLoading}
                  disabled={status === hazard.status && (!resolutionDetails || resolutionDetails === hazard.resolutionDetails)}
                >
                  Update Status
                </Button>
              </div>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Reported</p>
                  <p>{format(new Date(hazard.reportedAt), 'PPP')}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(hazard.reportedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Reported By</p>
                  <p>User ID: {hazard.reportedBy.substring(0, 8)}</p>
                </div>
              </div>
              
              {hazard.assignedTo && (
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p>Authority ID: {hazard.assignedTo.substring(0, 8)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p>{format(new Date(hazard.updatedAt), 'PPP')}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(hazard.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {hazard.images && hazard.images.length > 0 && (
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {hazard.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden bg-gray-100">
                    <img src={image} alt={`Hazard ${index + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HazardDetail;