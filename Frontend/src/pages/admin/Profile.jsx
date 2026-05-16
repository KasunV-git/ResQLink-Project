import React from 'react';

const Profile = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Profile
        </h1>
        <p className="text-foreground/70 text-lg">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="p-6 md:p-10 bg-card rounded-xl border border-border shadow-sm min-h-[400px] flex items-center justify-center">
        <p className="text-foreground/50 italic">
          Content for Admin Profile will go here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
