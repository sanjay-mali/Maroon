import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <div className="text-blue-500">
        <Icon size={24}/>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;