import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  BookOpen,
  ArrowRight,
  Cpu,
  Atom,
  Shield,
  Layers,
  Dna,
  Sparkles,
  Plus
} from 'lucide-react';
import Card3DTilt from '../components/3d/Card3DTilt';
import api from '../services/api';

const ICON_MAP = {
  Cpu: Cpu,
  Atom: Atom,
  Shield: Shield,
  Layers: Layers,
  Dna: Dna,
  Sparkles: Sparkles,
  BookOpen: BookOpen,
  FolderTree: FolderTree
};

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/books/categories');
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
          Knowledge Domains
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
          Faculties & Research Categories
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thematic classifications and volume allocation
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-xs text-slate-400 font-mono">Loading knowledge faculties...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || BookOpen;
            return (
              <Card3DTilt key={cat._id || cat.code} className="h-full">
                <div className="h-full glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <Icon size={24} />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-400">
                        {cat.code || 'CAT'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="text-xs font-mono text-slate-400">
                      <span className="text-cyan-300 font-bold text-sm">{cat.bookCount || 0}</span> Volumes
                    </div>

                    <Link
                      to={`/books?category=${encodeURIComponent(cat.name)}`}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Card3DTilt>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
