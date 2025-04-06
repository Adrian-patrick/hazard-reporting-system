import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, MapPin, Clock, User } from 'lucide-react';
import Badge from '../ui/Badge';
import { HazardReport } from '../../types';

interface HazardCardProps {
  hazard: HazardReport;
}

const HazardCard: React.FC<HazardCardProps> = ({ hazard }) => {
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

  const getHazardTypeIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getHazardTypeIcon(hazard.type)}
            <h3 className="ml-2 text-lg font-medium text-gray-900 truncate">
              {hazard.title}
            </h3>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getSeverityVariant(hazard.severity)}>
              {hazard.severity.charAt(0).toUpperCase() + hazard.severity.slice(1)}
            </Badge>
            <Badge variant={getStatusVariant(hazard.status)}>
              {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>
        
        <p className="mt-2 text-gray-600 line-clamp-2">
          {hazard.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-y-2 text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[200px]">{hazard.location.address}</span>
          </div>
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDistanceToNow(new Date(hazard.reportedAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>ID: {hazard.reportedBy.substring(0, 8)}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
        <Link
          to={`/hazards/${hazard.id}`}
          className="text-sm font-medium text-purple-600 hover:text-purple-500"
        >
          View Details
        </Link>
        
        {hazard.status === 'resolved' && hazard.resolutionDate && (
          <span className="text-sm text-gray-500">
            Resolved {formatDistanceToNow(new Date(hazard.resolutionDate), { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
};

export default HazardCard;