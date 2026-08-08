import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, User, X, CheckCircle, ArrowRight } from 'lucide-react';
import { BlogArticle } from '../types';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { WaterQualityChecker } from '../components/WaterQualityChecker';

interface FishCareProps {
  articles: BlogArticle[];
}

export const FishCare: React.FC<FishCareProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [readProgress, setReadProgress] = useState<number>(0);

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  useEffect(() => {
    if (!activeArticle) {
      setReadProgress(0);
      return;
    }
    const handleScroll = () => {
      const modal = document.getElementById('article-modal-content');
      if (modal) {
        const total = modal.scrollHeight - modal.clientHeight;
        if (total > 0) {
          setReadProgress((modal.scrollTop / total) * 100);
        }
      }
    };

    const modal = document.getElementById('article-modal-content');
    if (modal) {
      modal.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (modal) modal.removeEventListener('scroll', handleScroll);
    };
  }, [activeArticle]);

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* HEADER BANNER */}
      <section className="py-12 text-center bg-card/20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Bio-Care Knowledge Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Fish Care & Guides
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Expert guides, water parameter benchmarks, and best practices for raising high-yield Clarias batrachus.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* INTERACTIVE WATER QUALITY CHECKER */}
        <WaterQualityChecker />

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'glass text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ARTICLES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="glass-card rounded-3xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold backdrop-blur-md">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> {article.read_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" /> {article.published_date}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveArticle(null)}
          />

          <div className="relative w-full max-w-3xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-scale-in">
            {/* Reading Progress Indicator */}
            <div
              className="h-1 bg-primary transition-all duration-150"
              style={{ width: `${readProgress}%` }}
            />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-card/50">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <BookOpen className="w-4 h-4" /> {activeArticle.category}
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div id="article-modal-content" className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src={activeArticle.image_url}
                  alt={activeArticle.title}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {activeArticle.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-primary" /> {activeArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> {activeArticle.read_time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {activeArticle.published_date}
                  </span>
                </div>
              </div>

              {/* Formatted Article Content */}
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-muted-foreground space-y-4 pt-4 border-t border-border/40 whitespace-pre-line">
                {activeArticle.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border/40 bg-card/50 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
