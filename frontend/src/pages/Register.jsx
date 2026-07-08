import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sprout, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES } from '../utils/statesData';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const profilePicture = watch('profilePicture');

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
      await registerUser(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-earth-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl card p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mb-3">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create your AgriWorld account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of farmers growing smarter</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center">
            <label className="cursor-pointer flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-primary-50 border-2 border-dashed border-primary-200 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-6 h-6 text-primary-400" />
                )}
              </div>
              <span className="text-xs text-gray-500">Profile picture (optional)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} {...register('profilePicture')} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Full Name</label>
              <input className="input-field" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-text">Email</label>
              <input type="email" className="input-field" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                className="input-field"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label-text">Mobile Number</label>
              <input className="input-field" {...register('mobile', { required: 'Mobile number is required' })} />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className="label-text">State</label>
              <select className="input-field" {...register('state', { required: 'State is required' })}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label className="label-text">District</label>
              <input className="input-field" {...register('district', { required: 'District is required' })} />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
            </div>
            <div>
              <label className="label-text">Village</label>
              <input className="input-field" {...register('village', { required: 'Village is required' })} />
              {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
