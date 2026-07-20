import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search, Store } from 'lucide-react';
import { getListings, deleteListing } from '../services/marketplaceService';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/marketplace/ListingCard';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { EQUIPMENT_CATEGORIES, INDIAN_STATES } from '../utils/statesData';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', state: '', availabilityStatus: '', search: '' });

  const loadListings = async (activeFilters) => {
    setLoading(true);
    try {
      const cleaned = Object.fromEntries(Object.entries(activeFilters).filter(([, v]) => v));
      const { listings } = await getListings(cleaned);
      setListings(listings);
    } catch {
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { user } = useAuth();

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    loadListings(updated);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmed) return;

    try {
      await deleteListing(id);
      setListings((prev) => prev.filter((listing) => listing._id !== id));
      toast.success('Listing deleted successfully');
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resource Marketplace</h1>
          <p className="text-gray-500 mt-1">Rent agricultural equipment from farmers near you.</p>
        </div>
        <Link to="/marketplace/new" className="btn-primary">
          <Plus className="w-4 h-4" /> List Equipment
        </Link>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Search equipment..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <select className="input-field md:w-48" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="">All Categories</option>
          {EQUIPMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field md:w-48" value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}>
          <option value="">All States</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="input-field md:w-48"
          value={filters.availabilityStatus}
          onChange={(e) => handleFilterChange('availabilityStatus', e.target.value)}
        >
          <option value="">Any Availability</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : listings.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              isOwner={Boolean(user && listing.owner && String(user._id) === String(listing.owner._id))}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title="No listings found"
          description="Try adjusting your filters, or be the first to list your equipment."
          action={<Link to="/marketplace/new" className="btn-primary">List Equipment</Link>}
        />
      )}
    </div>
  );
};

export default Marketplace;
