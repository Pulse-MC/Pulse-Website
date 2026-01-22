import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Package, Calendar, ChevronLeft, AlertCircle, ChevronDown, ChevronUp, Layers, FileDigit } from 'lucide-react';
import Button from '../components/global/Button';
import Card from '../components/global/Card';
import { BASE_URL } from '@/config/apiconfig';

interface Release {
  version: string;
  platform: string;
  build_id: number;
  changelog: string;
  filename: string;
  file_size: number;
  upload_timestamp: string;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const compareVersions = (v1: string, v2: string) => {
  const parts1 = v1.split('.').map((p) => parseInt(p, 10) || 0);
  const parts2 = v2.split('.').map((p) => parseInt(p, 10) || 0);
  
  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  
  return 0;
};

export default function Releases() {
  const { version, build_number } = useParams<{ version?: string; build_number?: string }>();
  const navigate = useNavigate();
  
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVersion, setSelectedVersion] = useState<string>(version || '');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [expandedReleases, setExpandedReleases] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (version) setSelectedVersion(version);
    else setSelectedVersion('');
  }, [version]);

  useEffect(() => {
    const fetchReleases = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${BASE_URL}/releases`;
        const params = new URLSearchParams();

        if (version) params.append('version', version);
        if (build_number) params.append('build_id', build_number);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch releases: ${response.statusText}`);
        }

        const data = await response.json();
        const releasesData = Array.isArray(data.data) ? data.data : (data ? [data] : []);
        setReleases(releasesData);
      } catch (err) {
        console.error('Error fetching releases:', err);
        setError(err instanceof Error ? err.message : 'Failed to load releases');
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [version, build_number]);

  const availableVersions = useMemo(() => {
    const uniqueVersions = Array.from(new Set(releases.map(r => r.version)));
    return uniqueVersions.sort((a, b) => compareVersions(b, a));
  }, [releases]);

  const availablePlatforms = useMemo(() => {
    const uniquePlatforms = Array.from(new Set(releases.map(r => r.platform)));
    return uniquePlatforms.sort();
  }, [releases]);

  const processedReleases = useMemo(() => {
    let result = [...releases];

    if (selectedVersion) {
      result = result.filter(r => r.version === selectedVersion);
    }
    if (selectedPlatform) {
      result = result.filter(r => r.platform === selectedPlatform);
    }

    result.sort((a, b) => {
      const versionDiff = compareVersions(b.version, a.version);
      if (versionDiff !== 0) return versionDiff;

      return b.build_id - a.build_id;
    });

    return result;
  }, [releases, selectedVersion, selectedPlatform]);

  const handleVersionFilter = (ver: string) => {
    if (ver) {
      navigate(`/releases/${ver}`);
    } else {
      navigate('/releases');
    }
  };

  const handlePlatformFilter = (plat: string) => {
    setSelectedPlatform(prev => prev === plat ? '' : plat);
  };

  const toggleChangelog = (buildId: number) => {
    setExpandedReleases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(buildId)) {
        newSet.delete(buildId);
      } else {
        newSet.add(buildId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff2929] transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Stable <span className="text-[#ff2929]">Releases</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Official stable releases of Pulse. Production-ready builds with full support and documentation.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 mb-8"
        >
          {availableVersions.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Versions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleVersionFilter('')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    !selectedVersion
                      ? 'bg-[#ff2929] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  All Versions
                </button>
                {availableVersions.map((ver) => (
                  <button
                    key={ver}
                    onClick={() => handleVersionFilter(ver)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedVersion === ver
                        ? 'bg-[#ff2929] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {ver}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availablePlatforms.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers size={14} /> Platforms
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedPlatform('')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      !selectedPlatform
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    All Platforms
                </button>
                {availablePlatforms.map((plat) => (
                  <button
                    key={plat}
                    onClick={() => handlePlatformFilter(plat)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedPlatform === plat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-[#ff2929]/20 border-t-[#ff2929] rounded-full"
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-500">Error Loading Releases</h3>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && processedReleases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Releases Found</h3>
            <p className="text-gray-500">
              {selectedVersion
                ? `No releases available for version ${selectedVersion}`
                : 'Check back later for new releases'}
            </p>
          </motion.div>
        )}

        <div className="grid gap-4">
          {processedReleases.map((release, index) => {
            const isExpanded = expandedReleases.has(release.build_id);

            return (
              <motion.div
                key={`${release.version}-${release.build_id}-${release.platform}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6" glowOnHover>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">
                          Release {release.version}
                        </h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                          Stable
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Layers size={12} />
                            {release.platform}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm mb-4 text-gray-400">
                        <div className="flex items-center gap-2">
                            <Package size={16} />
                            <span>Build #{release.build_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(release.upload_timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileDigit size={16} />
                          <span>{formatBytes(release.file_size)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleChangelog(release.build_id)}
                        className="flex items-center gap-2 text-[#ff2929] hover:text-[#ff4444] transition-colors font-semibold mb-3 focus:outline-none"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        {isExpanded ? 'Hide' : 'Show'} Changelog
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-white/5 rounded-xl p-4 mt-2">
                              <h4 className="text-lg font-bold text-white mb-3">What's New</h4>
                              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                                {release.changelog}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => window.open(`${BASE_URL}/release/download/${release.build_id}`, '_blank')}
                        variant="primary"
                        size="large"
                        icon={Download}
                      >
                        Download
                      </Button>
                      <div className="mt-2 text-center">
                          <span className="text-xs text-gray-500 truncate max-w-[140px] inline-block" title={release.filename}>
                            {release.filename}
                          </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}