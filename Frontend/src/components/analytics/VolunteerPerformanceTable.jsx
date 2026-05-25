import React from 'react';
import Table from '../common/Table';
import { FiStar, FiClock, FiCheckSquare, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const data = [
  { id: 1, name: 'Kasun Perera', completed: 12, rating: 4.8, time: '22m' },
  { id: 2, name: 'Nimali Fernando', completed: 8, rating: 4.5, time: '35m' },
  { id: 3, name: 'Chamara Silva', completed: 15, rating: 4.9, time: '18m' },
  { id: 4, name: 'Sanduni De Silva', completed: 10, rating: 4.7, time: '25m' },
  { id: 5, name: 'Ruwan Kumara', completed: 6, rating: 4.2, time: '42m' },
];

const VolunteerPerformanceTable = () => {
  const navigate = useNavigate();

  const columns = [
    { 
      key: 'name', 
      label: 'Volunteer', 
      render: (v) => <span className="font-semibold text-foreground">{v.name}</span> 
    },
    { 
      key: 'completed', 
      label: 'Tasks', 
      render: (v) => (
        <div className="flex items-center gap-2">
          <FiCheckSquare className="text-primary-500" />
          <span>{v.completed}</span>
        </div>
      )
    },
    { 
      key: 'rating', 
      label: 'Avg Rating', 
      render: (v) => (
        <div className="flex items-center gap-1.5 text-amber-500">
          <FiStar fill="currentColor" size={14} />
          <span className="font-bold">{v.rating}</span>
        </div>
      )
    },
    { 
      key: 'time', 
      label: 'Resp. Time', 
      render: (v) => (
        <div className="flex items-center gap-1.5 text-foreground/70">
          <FiClock size={14} />
          <span>{v.time}</span>
        </div>
      )
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <h3 className="text-lg font-bold text-foreground">Top Volunteer Performance</h3>
      </div>
      <div className="p-0 flex-1 overflow-x-auto">
        <Table columns={columns} data={data} keyField="id" />
      </div>
      <div className="p-4 border-t border-border bg-card/30 flex justify-center">
        <button
          onClick={() => navigate('/admin/volunteers')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50/50 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-primary-950/20 border border-transparent rounded-lg transition-all duration-200 cursor-pointer"
        >
          <span>See All Volunteer Performance</span>
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default VolunteerPerformanceTable;
