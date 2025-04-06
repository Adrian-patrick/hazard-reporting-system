import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import HazardCard from './HazardCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import useHazardStore from '../../store/hazardStore';
import { HazardReport, HazardStatus, HazardType, HazardSeverity } from '../../types';

interface HazardListProps {
  userOnly?: boolean;
}

const HazardList: React.FC<HazardListProps> = ({ userOnly = false }) => {
  const { hazards, fetchHazards, isLoading } = useHazardStore();
  const [filteredHazards, setFilteredHazards] = useState<HazardReport[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<HazardStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<HazardType | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<HazardSeverity | 'all'>('all');

  useEffect(() => {
    fetchHazards();
  }, [fetchHazards]);

  useEffect(() => {
    let filtered = [...hazards];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        hazard => 
          hazard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hazard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hazard.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(hazard => hazard.status === statusFilter);
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(hazard => hazard.type === typeFilter);
    }
    
    // Filter by severity
    if (severityFilter !== 'all') {
      filtered = filtered.filter(hazard => hazard.severity === severityFilter);
    }
    
    setFilteredHazards(filtered);
  }, [hazards, searchTerm, statusFilter, typeFilter, severityFilter]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'reported', label: 'Reported' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'road-damage', label: 'Road Damage' },
    { value: 'flooding', label: 'Flooding' },
    { value: 'fallen-tree', label: 'Fallen Tree' },
    { value: 'power-outage', label: 'Power Outage' },
    { value: 'gas-leak', label: 'Gas Leak' },
    { value: 'structural-damage', label: 'Structural Damage' },
    { value: 'fire-hazard', label: 'Fire Hazard' },
    { value: 'other', label: 'Other' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search hazards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                fullWidth
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Filters:</span>
            </div>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as HazardStatus | 'all')}
              options={statusOptions}
              className="w-full md:w-40"
            />
            
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as HazardType | 'all')}
              options={typeOptions}
              className="w-full md:w-40"
            />
            
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as HazardSeverity | 'all')}
              options={severityOptions}
              className="w-full md:w-40"
            />
          </div>
        </div>
      </div>
      
      {filteredHazards.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No hazards found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHazards.map((hazard) => (
            <HazardCard key={hazard.id} hazard={hazard} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HazardList;