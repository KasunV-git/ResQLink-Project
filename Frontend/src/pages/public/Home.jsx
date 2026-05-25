import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground mb-4">
        Welcome to ResQLink
      </h1>
      <p className="max-w-2xl text-xl text-foreground/80 mb-8">
        The complete disaster management system connecting administrators, citizens, and volunteers.
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Get Started
        </button>
        <button className="px-6 py-3 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-border transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Home;
