import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import useHazardStore from '../../store/hazardStore';

const DashboardStats: React.FC = () => {
  const { hazards, fetchHazards } = useHazardStore();
  const [loading, setLoading] = useState(true);
  
  const loadHazards = useCallback(() => {
    setLoading(true);
    fetchHazards()
      .finally(() => setLoading(false));
  }, [fetchHazards]);
  
  useEffect(() => {
    loadHazards();
  }, [loadHazards]);
  
  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  const reportedCount = hazards.filter(h => h.status === 'reported').length;
  const inProgressCount = hazards.filter(h => h.status === 'in-progress').length;
  const resolvedCount = hazards.filter(h => h.status === 'resolved').length;
  const totalCount = hazards.length;

  const stats = [
    {
      title: 'Total Reports',
      value: totalCount,
      icon: <Activity className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Reported',
      value: reportedCount,
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      title: 'In Progress',
      value: inProgressCount,
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Resolved',
      value: resolvedCount,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100 text-green-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-6 flex items-center">
          <div className="mr-4 p-3 rounded-full bg-opacity-10" style={{ backgroundColor: stat.color.split(' ')[0] }}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
