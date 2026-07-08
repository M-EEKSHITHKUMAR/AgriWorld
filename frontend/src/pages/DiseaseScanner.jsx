import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Upload, Loader2, ScanLine, History, RotateCcw } from 'lucide-react';
import { scanDisease } from '../services/diseaseScanService';
import PredictionCard from '../components/scanner/PredictionCard';

const DiseaseScanner = () => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleScan = async () => {
    if (!file) {
      toast.error('Please upload a leaf image first');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { scan } = await scanDisease(file);
      setResult(scan);
      toast.success('Scan complete!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to analyze the image. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Plant Disease Scanner</h1>
          <p className="text-gray-500 mt-1">Upload a leaf photo to detect disease and get treatment advice.</p>
        </div>
        <Link to="/disease-scanner/history" className="btn-secondary">
          <History className="w-4 h-4" /> Scan History
        </Link>
      </div>

      {!result && (
        <div className="card p-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-primary-200 rounded-xl2 flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-primary-50/50 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-64 rounded-xl object-contain" />
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                  <Upload className="w-7 h-7 text-primary-500" />
                </div>
                <p className="text-gray-600 font-medium">Drag & drop a leaf image, or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">JPG, PNG or WEBP — up to 5MB</p>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={handleScan} disabled={!file || loading} className="btn-primary flex-1">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" /> Scan for Disease
                </>
              )}
            </button>
            {preview && !loading && (
              <button onClick={reset} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <div className="space-y-4">
            <PredictionCard scan={result} />
            <button onClick={reset} className="btn-secondary w-full">
              <RotateCcw className="w-4 h-4" /> Scan Another Leaf
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseaseScanner;
