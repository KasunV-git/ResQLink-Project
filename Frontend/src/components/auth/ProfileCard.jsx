import React from 'react';
import Card from '../common/Card';
import FormInput from '../common/FormInput';
import ActionButton from '../common/ActionButton';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

const ProfileCard = ({ 
  user, 
  isEditing, 
  onEditToggle, 
  onSave, 
  onCancel, 
  formData, 
  onFormChange,
  errors 
}) => {
  return (
    <Card 
      title="Admin Profile" 
      subtitle="Manage your personal information and account settings."
      className="max-w-2xl mx-auto"
    >
      <div className="flex flex-col gap-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 py-4 border-b border-border/50">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-foreground/60">{user.role}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput 
            label="Full Name" 
            id="name" 
            value={isEditing ? formData.name : user.name} 
            onChange={(e) => onFormChange('name', e.target.value)}
            disabled={!isEditing}
            icon={FiUser}
            error={errors.name}
          />
          <FormInput 
            label="Email Address" 
            id="email" 
            type="email"
            value={isEditing ? formData.email : user.email} 
            onChange={(e) => onFormChange('email', e.target.value)}
            disabled={!isEditing}
            icon={FiMail}
            error={errors.email}
          />
          <FormInput 
            label="Contact Number" 
            id="phone" 
            value={isEditing ? formData.phone : user.phone} 
            onChange={(e) => onFormChange('phone', e.target.value)}
            disabled={!isEditing}
            icon={FiPhone}
            error={errors.phone}
          />
          <FormInput 
            label="Administrative Role" 
            id="role" 
            value={user.role} 
            disabled={true}
            icon={FiShield}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          {!isEditing ? (
            <ActionButton 
              variant="primary" 
              label="Edit Profile" 
              icon={FiEdit2} 
              onClick={onEditToggle}
            />
          ) : (
            <>
              <ActionButton 
                variant="ghost" 
                label="Cancel" 
                icon={FiX} 
                onClick={onCancel}
              />
              <ActionButton 
                variant="success" 
                label="Save Changes" 
                icon={FiSave} 
                onClick={onSave}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
