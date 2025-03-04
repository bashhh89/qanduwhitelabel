import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useBlogStore } from '../utils/blog-store';

export default function BlogPage() {
  const { posts, isLoading, loadPosts } = useBlogStore();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load posts and extract categories on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Extract categories whenever posts change
  useEffect(() => {
    const allCategories = Array.from(
      new Set(posts.flatMap(post => post.categories))
    );
    setCategories(['All', ...allCategories]);
  }, [posts]);

  // Filter posts by category
  const filterPostsByCategory = (category: string) => {
    setActiveCategory(category === 'All' ? null : category);
  };

  // Get filtered and sorted posts
  const getFilteredPosts = () => {
    const publishedPosts = posts.filter(post => post.status === 'published');
    if (!activeCategory || activeCategory === 'All') {
      return publishedPosts;
    }
    return publishedPosts.filter(post => post.categories.includes(activeCategory));
  };

  const publishedPosts = getFilteredPosts();
  const featuredPosts = publishedPosts.slice(0, 1);
  const recentPosts = publishedPosts.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">QanDu Insights</h1>
            <p className="text-muted-foreground mt-2">Latest updates, guides, and industry insights</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Button variant="outline" onClick={() => filterPostsByCategory('All')}>
                {activeCategory || 'All Categories'}
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => filterPostsByCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredPosts.length > 0 && (
                <Card className="col-span-full md:col-span-2 overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={featuredPosts[0].coverImage} 
                      alt={featuredPosts[0].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(featuredPosts[0].publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{featuredPosts[0].title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {featuredPosts[0].excerpt}
                    </p>
                    <Link to={`/blog/${featuredPosts[0].id}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {post.categories.map((category, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {category}
                        </span>
                      ))}
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">Read Article</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {publishedPosts.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No Posts Found</h2>
                <p className="text-muted-foreground">
                  {activeCategory 
                    ? `No articles found in the ${activeCategory} category.` 
                    : 'No published articles available yet.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
