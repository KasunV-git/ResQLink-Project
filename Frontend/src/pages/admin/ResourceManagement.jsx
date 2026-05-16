import React from 'react';

const ResourceManagement = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Resource Management
        </h1>
        <p className="text-foreground/70 text-lg">
          Track and allocate relief resources, equipment, and medical supplies.
        </p>
      </div>

      <div className="p-6 md:p-10 bg-card rounded-xl border border-border shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-foreground/50 italic">
          Content for Resource Management will go here.
        </p>
      </div>
    </div>
  );
};

export default ResourceManagement;
