import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Landmark, Plus } from 'lucide-react';
import { getSchemes, createScheme } from '../services/schemeService';
import { useAuth } from '../context/AuthContext';
import SchemeCard from '../components/schemes/SchemeCard';
import SchemeForm from '../components/schemes/SchemeForm';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { INDIAN_STATES } from '../utils/statesData';

const GovernmentSchemes = () => {
  const { user } = useAuth();
  const [selectedState, setSelectedState] = useState(user?.state || '');
  const [schemes, setSchemes] = useState({ central: [], state: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSchemes(selectedState);
      setSchemes(data);
    } catch {
      toast.error('Failed to load government schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    try {
      await createScheme(payload);
      toast.success('Scheme published');
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish scheme');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Government Schemes</h1>
          <p className="text-gray-500 mt-1">Discover central and state schemes designed for farmers.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="input-field sm:w-56"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">View state schemes for...</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(true)} className="btn-primary whitespace-nowrap">
              <Plus className="w-4 h-4" /> Add Scheme
            </button>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Central Government Schemes</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.central.map((s) => <SchemeCard key={s._id} scheme={s} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          State Government Schemes {selectedState && `— ${selectedState}`}
        </h2>
        {!selectedState ? (
          <EmptyState icon={Landmark} title="Select a state" description="Choose a state above to view its specific schemes." />
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : schemes.state.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.state.map((s) => <SchemeCard key={s._id} scheme={s} />)}
          </div>
        ) : (
          <EmptyState icon={Landmark} title="No state schemes yet" description={`No schemes found for ${selectedState} at the moment.`} />
        )}
      </section>

      {showForm && (
        <SchemeForm onSubmit={handleCreate} onClose={() => setShowForm(false)} submitting={submitting} />
      )}
    </div>
  );
};

export default GovernmentSchemes;
