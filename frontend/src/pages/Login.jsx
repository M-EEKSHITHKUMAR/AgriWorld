import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Sprout, Mail, Lock, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('farmer');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const isAdmin = mode === 'admin';

  const switchMode = (nextMode) => {
    setMode(nextMode);
    reset();
  };

  const onSubmit = async (formData) => {
    try {
      if (isAdmin) {
        await adminLogin(formData);
        toast.success('Welcome, Admin!');
      } else {
        await login(formData);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-earth-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center mb-3">
            {isAdmin ? <ShieldCheck className="w-7 h-7 text-white" /> : <Sprout className="w-7 h-7 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAdmin ? 'Admin Portal' : 'Welcome to AgriWorld'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin ? 'Sign in to manage government schemes' : 'Sign in to your farmer account'}
          </p>
        </div>

        <div className="flex bg-primary-50 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => switchMode('farmer')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isAdmin ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            Farmer Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('admin')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdmin ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isAdmin ? (
            <div>
              <label className="label-text">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="admin"
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
          ) : (
            <div>
              <label className="label-text">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          )}

          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isAdmin ? 'Sign In as Admin' : 'Sign In'}
          </button>
        </form>

        {!isAdmin && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
