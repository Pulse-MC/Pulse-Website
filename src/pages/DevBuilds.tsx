import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, GitCommit, User, Calendar, ChevronLeft, AlertCircle, Layers } from 'lucide-react';
import Button from '../components/global/Button';
import Card from '../components/global/Card';
import { BASE_URL } from '@/config/apiconfig';

interface DevBuild {
  version: string;
  build_id: number;
  commit_hash: string;
  author: string;
  commit_message: string;
  platform: string;
  upload_timestamp: string;
}

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

export default function DevBuilds() {
  const { version, build_number } = useParams<{ version?: string; build_number?: string }>();
  const navigate = useNavigate();
  
  const [builds, setBuilds] = useState<DevBuild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVersion, setSelectedVersion] = useState<string>(version || '');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  useEffect(() => {
    if (version) {
        setSelectedVersion(version);
    } else {
        setSelectedVersion('');
    }
  }, [version]);

  useEffect(() => {
    const fetchBuilds = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${BASE_URL}/devbuilds`;
        const params = new URLSearchParams();

        if (version) params.append('version', version);
        if (build_number) params.append('build_id', build_number);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch dev builds: ${response.statusText}`);
        }

        const data = await response.json();
        const buildsData = Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
        setBuilds(buildsData);
      } catch (err) {
        console.error('Error fetching dev builds:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dev builds');
        setBuilds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, [version, build_number]);


  const availableVersions = useMemo(() => {
    const uniqueVersions = Array.from(new Set(builds.map(b => b.version)));
    return uniqueVersions.sort((a, b) => compareVersions(b, a));
  }, [builds]);

  const availablePlatforms = useMemo(() => {
    const uniquePlatforms = Array.from(new Set(builds.map(b => b.platform)));
    return uniquePlatforms.sort();
  }, [builds]);

  const processedBuilds = useMemo(() => {
    let result = [...builds];

    if (selectedVersion) {
      result = result.filter(b => b.version === selectedVersion);
    }
    if (selectedPlatform) {
      result = result.filter(b => b.platform === selectedPlatform);
    }

    result.sort((a, b) => {
      const versionDiff = compareVersions(b.version, a.version);
      if (versionDiff !== 0) return versionDiff;

      return b.build_id - a.build_id;
    });

    return result;
  }, [builds, selectedVersion, selectedPlatform]);


  const handleVersionFilter = (ver: string) => {
    
    if (ver) {
      navigate(`/devbuilds/${ver}`);
    } else {
      navigate('/devbuilds');
    }
  };

  const handlePlatformFilter = (plat: string) => {
    setSelectedPlatform(prev => prev === plat ? '' : plat);
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

          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-syne">
            Dev <span className="text-[#ff2929]">Builds</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Latest development builds of Pulse. These builds contain cutting-edge features but may be unstable.
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
                <h3 className="text-lg font-bold text-red-500">Error Loading Builds</h3>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && processedBuilds.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Dev Builds Found</h3>
            <p className="text-gray-500">
              {selectedVersion || selectedPlatform
                ? 'Try adjusting your version or platform filters'
                : 'Check back later for new development builds'}
            </p>
          </motion.div>
        )}

        <div className="grid gap-4">
          {processedBuilds.map((build, index) => (
            <motion.div
              key={`${build.version}-${build.build_id}-${build.platform}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6" glowOnHover>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-white">
                        DevBuild #{build.build_id}
                      </h3>
                      <span className="px-3 py-1 bg-[#ff2929]/20 text-[#ff2929] rounded-full text-sm font-semibold">
                        {build.version}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Layers size={12} />
                        {build.platform}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <GitCommit size={16} />
                        <span className="font-mono text-white/70">{build.commit_hash.substring(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <User size={16} />
                        <span>{build.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span>{new Date(build.upload_timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-300 leading-relaxed font-mono text-sm bg-black/30 p-3 rounded-lg border border-white/5">
                      {build.commit_message}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => window.open(`${BASE_URL}/devbuild/download/${build.build_id}`, '_blank')}
                      variant="primary"
                      size="large"
                      icon={Download}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}