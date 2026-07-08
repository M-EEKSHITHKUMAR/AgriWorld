import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Upload, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { IMAGE_BASE_URL } from '../services/api';
import { INDIAN_STATES } from '../utils/statesData';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name,
      mobile: user?.mobile,
      state: user?.state,
      district: user?.district,
      village: user?.village,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'profilePicture') {
          if (value?.[0]) formData.append('profilePicture', value[0]);
        } else {
          formData.append(key, value);
        }
      });
      await refreshProfile(formData);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <div className="flex justify-center">
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-primary-50 border-2 border-dashed border-primary-200 flex items-center justify-center overflow-hidden">
              {preview || user?.profilePicture ? (
                <img
                  src={preview || `${IMAGE_BASE_URL}${user.profilePicture}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-primary-400" />
              )}
            </div>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Change photo
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} {...register('profilePicture')} />
          </label>
        </div>

        <div>
          <label className="label-text">Email</label>
          <input className="input-field bg-gray-50" value={user?.email} disabled />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Full Name</label>
            <input className="input-field" {...register('name', { required: 'Required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label-text">Mobile Number</label>
            <input className="input-field" {...register('mobile', { required: 'Required' })} />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
          </div>
          <div>
            <label className="label-text">State</label>
            <select className="input-field" {...register('state', { required: 'Required' })}>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-text">District</label>
            <input className="input-field" {...register('district', { required: 'Required' })} />
          </div>
          <div>
            <label className="label-text">Village</label>
            <input className="input-field" {...register('village', { required: 'Required' })} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
