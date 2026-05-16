import React, { useState } from 'react';
import ProfileCard from '../../components/auth/ProfileCard';
import LogoutSection from '../../components/auth/LogoutSection';

const initialUser = {
  name: 'Admin User',
  email: 'admin@resqlink.org',
  phone: '+94 77 123 4567',
  role: 'Super Admin'
};

const Profile = () => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);
  const [errors, setErrors] = useState({});

  const handleEditToggle = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUser(formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // In a real app, this would clear tokens and redirect to login
    alert('Logging out...');
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="text-foreground/70 text-lg">
          Manage your account information and preferences.
        </p>
      </div>

      <ProfileCard 
        user={user}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
        formData={formData}
        onFormChange={handleFormChange}
        errors={errors}
      />

      <LogoutSection onLogout={handleLogout} />
    </div>
  );
};

export default Profile;
