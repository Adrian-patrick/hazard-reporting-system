import React from 'react';
import { AlertTriangle, Clock, CheckCircle, Activity } from 'lucide-react';
import Card from '../ui/Card';
import useHazardStore from '../../store/hazardStore';

const DashboardStats: React.FC = () => {
  const { hazards } = useHazardStore();
  
  const reportedCount = hazards.filter(h => h.status === 'reported').length;
  const inProgressCount = hazards.filter(h => h.status === 'in-progress').length;
  const resolvedCount = hazards.filter(h => h.status === 'resolved').length;
  const totalCount = hazards.length;
  
  const stats = [
    {
      title: 'Total Reports',
      value: totalCount,
      icon: <Activity className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100 text-blue-800'
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
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-100 text-purple-800'
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
        <Card key={index} className="flex items-center">
          <div className="mr-4 p-3 rounded-full bg-opacity-10" style={{ backgroundColor: stat.color.split(' ')[0] }}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;