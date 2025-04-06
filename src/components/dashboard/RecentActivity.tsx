import React, { useCallback, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import useHazardStore from '../../store/hazardStore';

const RecentActivity: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore();
  const loadHazards = useCallback(() => {
    fetchHazards();
  }, [fetchHazards]);
    useEffect(() => {
      loadHazards();
    }, [loadHazards]);
    console.log(hazards)
 
  
  // Sort hazards by most recent
  const sortedHazards = [...hazards].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);
  
  // Helper function to format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    return `${Math.floor(diffSeconds / 86400)} days ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reported':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'reported':
        return 'text-yellow-800 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-800 bg-blue-100';
      case 'resolved':
        return 'text-green-800 bg-green-100';
      case 'dismissed':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <button className="text-sm font-medium text-purple-600 hover:text-purple-500 flex items-center">
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        {sortedHazards.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        ) : (
          sortedHazards.map((hazard) => (
            <div 
              key={hazard.id} 
              className="block hover:bg-gray-50 -mx-6 px-6 py-3 transition-colors"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getStatusIcon(hazard.status)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{hazard.title}</h4>
                    <span 
                      className={`px-2 py-1 rounded text-xs ${getStatusVariant(hazard.status)}`}
                    >
                      {hazard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {hazard.location.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(hazard.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;