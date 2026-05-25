import React from 'react';
import Badge from '../common/Badge';

const VolunteerSkills = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return <span className="text-foreground/40 text-sm italic">No skills listed</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 max-w-xs">
      {skills.map((skill, index) => (
        <Badge key={index} variant="info" className="capitalize text-[10px] px-2">
          {skill}
        </Badge>
      ))}
    </div>
  );
};

export default VolunteerSkills;
