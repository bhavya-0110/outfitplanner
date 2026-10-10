import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Eye, 
  Filter, 
  Sparkles,
  Tag
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Pieces', icon: '✨' },
  { id: 'tops', label: 'Tops', icon: '👚' },
  { id: 'bottoms', label: 'Bottoms', icon: '👖' },
  { id: 'dresses', label: 'Dresses', icon: '👗' },
  { id: 'shoes', label: 'Shoes', icon: '👠' },
  { id: 'accessories', label: 'Accessories', icon: '👜' }
];

export default function Wardrobe({ 
  wardrobe, 
  onDeleteItem, 
  onOpenAddModal, 
  onSelectItemDetail,
  onNavigateToStudio
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for each category
  const counts = useMemo(() => {
    const map = { all: wardrobe.length };
    ['tops', 'bottoms', 'dresses', 'shoes', 'accessories'].forEach(cat => {
      map[cat] = wardrobe.filter(item => item.category === cat).length;
    });
    return map;
  }, [wardrobe]);

  // Filtered wardrobe
  const filteredItems = useMemo(() => {
    return wardrobe.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Occasion filter
      if (selectedOccasion !== 'all' && !item.occasions.includes(selectedOccasion)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesColor = item.color?.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        if (!matchesName && !matchesColor && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [wardrobe, selectedCategory, selectedOccasion, searchQuery]);

  return (
    <div className="wardrobe-section">
      {/* Hero Banner */}
      <div className="wardrobe-hero">
        <div className="hero-text-content">
          <span className="hero-subhead">DIGITAL CLOSET & INVENTORY</span>
          <h2 className="serif-font hero-title">My Fashion Wardrobe</h2>
          <p className="hero-description">
            Organize and style your wardrobe with ease. Curate your signature tops, bottoms, dresses, shoes, and accessories.
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={18} />
            <span>Add New Item</span>
          </button>
          <button className="btn btn-secondary" onClick={onNavigateToStudio}>
            <Sparkles size={18} />
            <span>Open Outfit Studio</span>
          </button>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="category-tabs-container">
        <div className="category-tabs-scroll">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`cat-pill-tab ${selectedCategory === tab.id ? 'active' : ''}`}
            >
              <span className="cat-pill-icon">{tab.icon}</span>
              <span className="cat-pill-label">{tab.label}</span>
              <span className="cat-pill-count">{counts[tab.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="wardrobe-filters-bar">
        {/* Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, color, style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Occasion Filter */}
        <div className="occasion-filter-group">
          <span className="filter-label">Occasion:</span>
          <div className="occasion-filter-pills">
            {[
              { id: 'all', label: 'All' },
              { id: 'college', label: '🎓 College' },
              { id: 'casual', label: '☕ Casual' },
              { id: 'party', label: '✨ Party' }
            ].map(occ => (
              <button
                key={occ.id}
                onClick={() => setSelectedOccasion(occ.id)}
                className={`occ-filter-btn ${selectedOccasion === occ.id ? 'active' : ''}`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items Count and Status */}
      <div className="wardrobe-status-row">
        <p className="status-text">
          Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'piece' : 'pieces'}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {selectedOccasion !== 'all' && ` for ${selectedOccasion}`}
        </p>
      </div>

      {/* Wardrobe Grid */}
      {filteredItems.length > 0 ? (
        <div className="wardrobe-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="clothing-card">
              <div className="clothing-card-image-wrap">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="clothing-card-img" 
                  loading="lazy"
                />
                <span className="badge-category card-cat-badge">
                  {item.category}
                </span>
                {item.color && (
                  <span className="color-swatch-tag" title={item.color}>
                    {item.color}
                  </span>
                )}
                {/* Overlay actions on hover */}
                <div className="card-hover-actions">
                  <button 
                    className="card-action-btn view-btn"
                    onClick={() => onSelectItemDetail(item)}
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    className="card-action-btn delete-btn"
                    onClick={() => {
                      if (window.confirm(`Remove "${item.name}" from your wardrobe?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="clothing-card-body">
                <h4 className="clothing-card-title" title={item.name}>
                  {item.name}
                </h4>

                <div className="clothing-card-tags">
                  {item.occasions.map(occ => (
                    <span key={occ} className={`badge-occasion ${occ}`}>
                      {occ === 'college' && '🎓'}
                      {occ === 'casual' && '☕'}
                      {occ === 'party' && '✨'} {occ}
                    </span>
                  ))}
                </div>

                {item.notes && (
                  <p className="clothing-card-note">{item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-wardrobe-state">
          <div className="empty-icon-wrap">👗</div>
          <h3 className="serif-font empty-title">No clothing items found</h3>
          <p className="empty-desc">
            {searchQuery || selectedOccasion !== 'all' || selectedCategory !== 'all'
              ? 'Try adjusting your search terms or filters to see your clothes.'
              : 'Your wardrobe is currently empty. Start by adding your favorite tops, bottoms, dresses, or shoes!'}
          </p>
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} /> Add Clothing Item
          </button>
        </div>
      )}
    </div>
  );
}
