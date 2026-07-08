import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ScanLine, Trash2 } from 'lucide-react';
import { getScanHistory, deleteScan } from '../services/diseaseScanService';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { IMAGE_BASE_URL } from '../services/api';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { scans } = await getScanHistory();
      setScans(scans);
    } catch {
      toast.error('Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteScan(id);
      setScans((prev) => prev.filter((s) => s._id !== id));
      toast.success('Scan deleted');
    } catch {
      toast.error('Failed to delete scan');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/disease-scanner" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Scanner
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Scan History</h1>
        <p className="text-gray-500 mt-1">All your previous disease scans in one place.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : scans.length ? (
        <div className="space-y-4">
          {scans.map((scan) => (
            <div key={scan._id} className="card p-4 flex gap-4">
              <img
                src={`${IMAGE_BASE_URL}${scan.image}`}
                alt={scan.disease}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0 cursor-pointer"
                onClick={() => setExpandedId(expandedId === scan._id ? null : scan._id)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{scan.disease}</h3>
                    <p className="text-sm text-gray-500">{scan.confidence.toFixed(2)}% confidence</p>
                  </div>
                  <button onClick={() => handleDelete(scan._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{new Date(scan.scanDate || scan.createdAt).toLocaleString()}</p>

                {expandedId === scan._id && (
                  <div className="mt-3 space-y-2">
                    {scan.treatment?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Treatment:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {scan.treatment.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {scan.pesticideRecommendations?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Recommended Pesticides:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {scan.pesticideRecommendations.map((p, i) => <li key={i}>{p.name}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ScanLine}
          title="No scans yet"
          description="Scan your first plant leaf to see results here."
          action={<Link to="/disease-scanner" className="btn-primary">Scan a Plant</Link>}
        />
      )}
    </div>
  );
};

export default ScanHistory;
