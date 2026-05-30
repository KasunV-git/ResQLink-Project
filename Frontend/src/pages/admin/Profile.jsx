import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../../components/auth/ProfileCard';
import LogoutSection from '../../components/auth/LogoutSection';
import { logout } from '../../services/authService';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/common/FormInput';
import ActionButton from '../../components/common/ActionButton';
import Card from '../../components/common/Card';
import { FiPlus, FiTrash2, FiFolderPlus } from 'react-icons/fi';

const initialUser = {
  name: 'Admin User',
  email: 'admin@resqlink.org',
  phone: '+94 77 123 4567',
  role: 'Super Admin'
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);
  const [errors, setErrors] = useState({});

  // Dynamic Custom Sections
  const [customSections, setCustomSections] = useState(() => {
    const saved = localStorage.getItem('resqlink_profile_custom_sections');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Emergency Contact',
        subtitle: 'Primary contact during disaster coordination operations.',
        fields: [
          { label: 'Contact Name', value: 'Jane Doe' },
          { label: 'Relationship', value: 'Spouse' },
          { label: 'Contact Number', value: '+94 77 987 6543' }
        ]
      }
    ];
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newFields, setNewFields] = useState([{ label: '', value: '' }]);
  const [modalError, setModalError] = useState('');

  const saveCustomSections = (newSections) => {
    setCustomSections(newSections);
    localStorage.setItem('resqlink_profile_custom_sections', JSON.stringify(newSections));
  };

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
    logout();
    navigate('/admin/login');
  };

  // Custom Section Management
  const handleOpenModal = () => {
    setNewSectionTitle('');
    setNewSectionSubtitle('');
    setNewFields([{ label: '', value: '' }]);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleAddField = () => {
    setNewFields([...newFields, { label: '', value: '' }]);
  };

  const handleRemoveField = (index) => {
    if (newFields.length > 1) {
      setNewFields(newFields.filter((_, i) => i !== index));
    } else {
      setNewFields([{ label: '', value: '' }]);
    }
  };

  const handleFieldChange = (index, key, value) => {
    const updated = [...newFields];
    updated[index][key] = value;
    setNewFields(updated);
  };

  const handleDeleteSection = (id) => {
    const updated = customSections.filter(section => section.id !== id);
    saveCustomSections(updated);
  };

  const handleAddSectionSave = () => {
    if (!newSectionTitle.trim()) {
      setModalError('Section Title is required.');
      return;
    }

    const filteredFields = newFields.filter(f => f.label.trim() !== '');
    if (filteredFields.length === 0) {
      setModalError('Please define at least one valid field (with a label).');
      return;
    }

    const newSection = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      subtitle: newSectionSubtitle.trim() || 'Custom administrative profile details.',
      fields: filteredFields.map(f => ({
        label: f.label.trim(),
        value: f.value.trim()
      }))
    };

    saveCustomSections([...customSections, newSection]);
    setIsModalOpen(false);
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

      {/* Dynamic Custom Sections */}
      {customSections.map((section) => (
        <Card 
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          className="max-w-2xl mx-auto relative group transition-colors"
        >
          {/* Delete section button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => handleDeleteSection(section.id)}
              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-500 hover:text-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              title="Delete Section"
            >
              <FiTrash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields && section.fields.length > 0 ? (
              section.fields.map((field, idx) => (
                <div key={idx} className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-background/50 border border-border/40 backdrop-blur-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{field.label}</span>
                  <span className="text-sm font-semibold text-foreground">{field.value || '—'}</span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-sm text-foreground/50 py-4">
                No custom fields defined in this section.
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Add Custom Section Button Card */}
      <div className="max-w-2xl mx-auto w-full">
        <button
          onClick={handleOpenModal}
          className="w-full py-8 border-2 border-dashed border-border hover:border-primary-500/50 rounded-xl flex flex-col items-center justify-center gap-3 bg-card/20 hover:bg-card/50 transition-all duration-300 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FiPlus size={24} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-foreground group-hover:text-primary-500 transition-colors">Add Profile Section</h3>
            <p className="text-xs text-foreground/50 mt-1">Configure a custom metadata card to your administrative account</p>
          </div>
        </button>
      </div>

      <LogoutSection onLogout={handleLogout} />

      {/* Add Custom Section Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Profile Section"
        footer={
          <>
            <ActionButton 
              variant="ghost" 
              label="Cancel" 
              onClick={() => setIsModalOpen(false)} 
            />
            <ActionButton 
              variant="success" 
              label="Save Section" 
              icon={FiFolderPlus}
              onClick={handleAddSectionSave} 
            />
          </>
        }
      >
        <div className="flex flex-col gap-6">
          {modalError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <span>⚠</span>
              {modalError}
            </div>
          )}

          <FormInput
            label="Section Title"
            id="section-title"
            required
            value={newSectionTitle}
            onChange={(e) => {
              setNewSectionTitle(e.target.value);
              setModalError('');
            }}
            placeholder="e.g. Emergency Contact, Security Clearances"
          />

          <FormInput
            label="Section Subtitle"
            id="section-subtitle"
            value={newSectionSubtitle}
            onChange={(e) => setNewSectionSubtitle(e.target.value)}
            placeholder="e.g. Primary information for operational duties"
          />

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground/80">Section Fields</span>
              <button
                type="button"
                onClick={handleAddField}
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors focus:outline-none"
              >
                <FiPlus size={14} />
                <span>Add Field</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {newFields.map((field, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <FormInput
                      label={index === 0 ? "Field Label" : ""}
                      id={`field-label-${index}`}
                      value={field.label}
                      onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                      placeholder="e.g. Primary Contact"
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label={index === 0 ? "Field Value" : ""}
                      id={`field-value-${index}`}
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="p-2.5 rounded-lg border border-border bg-card/50 text-foreground/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors mb-0.5"
                    title="Remove Field"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

