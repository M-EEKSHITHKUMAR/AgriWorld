import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Upload, ArrowLeft } from 'lucide-react';
import { createListing } from '../services/marketplaceService';
import { EQUIPMENT_CATEGORIES, INDIAN_STATES } from '../utils/statesData';

const MarketplaceCreate = () => {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { priceUnit: 'Day', availabilityStatus: 'Available' } });

  const { onChange: registerImagesOnChange, ...imagesField } = register('images');

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    registerImagesOnChange(e);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'images') {
          Array.from(value || []).forEach((file) => formData.append('images', file));
        } else {
          formData.append(key, value);
        }
      });
      await createListing(formData);
      toast.success('Listing published!');
      navigate('/marketplace');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">List Your Equipment</h1>
        <p className="text-gray-500 mt-1">Rent out your agricultural equipment to nearby farmers.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
        <div>
          <label className="label-text">Equipment Images</label>
          <label className="flex flex-wrap gap-3 items-center cursor-pointer">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-20 h-20 rounded-xl object-cover border border-primary-100" />
            ))}
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-primary-200 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary-400" />
            </div>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} {...imagesField} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Equipment Name</label>
            <input className="input-field" {...register('equipmentName', { required: 'Required' })} />
            {errors.equipmentName && <p className="text-red-500 text-xs mt-1">{errors.equipmentName.message}</p>}
          </div>
          <div>
            <label className="label-text">Category</label>
            <select className="input-field" {...register('category', { required: 'Required' })}>
              <option value="">Select category</option>
              {EQUIPMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea rows={3} className="input-field" {...register('description', { required: 'Required' })} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">Rental Price (₹)</label>
            <input type="number" className="input-field" {...register('rentalPrice', { required: 'Required', min: 1 })} />
            {errors.rentalPrice && <p className="text-red-500 text-xs mt-1">{errors.rentalPrice.message}</p>}
          </div>
          <div>
            <label className="label-text">Price Unit</label>
            <select className="input-field" {...register('priceUnit')}>
              <option value="Hour">Per Hour</option>
              <option value="Day">Per Day</option>
            </select>
          </div>
          <div>
            <label className="label-text">Availability</label>
            <select className="input-field" {...register('availabilityStatus')}>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label-text">State</label>
            <select className="input-field" {...register('state', { required: 'Required' })}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
          </div>
          <div>
            <label className="label-text">District</label>
            <input className="input-field" {...register('district', { required: 'Required' })} />
            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
          </div>
          <div>
            <label className="label-text">Village</label>
            <input className="input-field" {...register('village', { required: 'Required' })} />
            {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Contact Number</label>
            <input className="input-field" {...register('contactNumber', { required: 'Required' })} />
            {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>}
          </div>
          <div>
            <label className="label-text">WhatsApp Number (Optional)</label>
            <input className="input-field" {...register('whatsappNumber')} />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default MarketplaceCreate;
