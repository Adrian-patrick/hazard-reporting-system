import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import useHazardStore from '../../store/hazardStore';

const RecentActivity: React.FC = () => {
  const { hazards } = useHazardStore();
  
  // Sort hazards by updatedAt date (most recent first)
  const sortedHazards = [...hazards].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5); // Get only the 5 most recent
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
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
  
  return (
    <Card className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <Link to="/dashboard/hazards" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {sortedHazards.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          sortedHazards.map((hazard) => (
            <Link 
              key={hazard.id} 
              to={`/hazards/${hazard.id}`}
              className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getStatusIcon(hazard.status)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{hazard.title}</h4>
                    <Badge variant={getStatusVariant(hazard.status)} size="sm">
                      {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {hazard.location.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(hazard.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;