import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Calendar, 
  Trash2, 
  Sparkles, 
  Filter, 
  Layers, 
  ChevronRight,
  Share2
} from 'lucide-react';

export default function SavedOutfits({ 
  savedOutfits, 
  wardrobe, 
  onToggleFavorite, 
  onDeleteOutfit, 
  onScheduleOutfit, 
  onNavigateToStudio 
}) {
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [filterOccasion, setFilterOccasion] = useState('all');

  // Helper to resolve an item by its ID from the wardrobe
  const getItem = (id) => wardrobe.find(i => i.id === id);

  // Filtered outfits
  const filtered = useMemo(() => {
    return savedOutfits.filter(outfit => {
      if (filterFavoritesOnly && !outfit.isFavorite) return false;
      if (filterOccasion !== 'all' && outfit.occasion !== filterOccasion) return false;
      return true;
    });
  }, [savedOutfits, filterFavoritesOnly, filterOccasion]);

  const favoritesCount = savedOutfits.filter(o => o.isFavorite).length;

  return (
    <div className="saved-section">
      {/* Hero */}
      <div className="saved-hero">
        <div className="hero-text-content">
          <span className="hero-subhead">SAVED LOOKBOOK</span>
          <h2 className="serif-font hero-title">My Curated Outfits</h2>
          <p className="hero-description">
            Your personal catalog of styling combinations. Bookmark your favorites and assign them directly to your calendar.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onNavigateToStudio}>
          <Layers size={18} />
          <span>Create New Outfit</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="saved-filter-bar">
        {/* Toggle Favorites */}
        <div className="filter-pill-group">
          <button
            className={`filter-btn ${!filterFavoritesOnly ? 'active' : ''}`}
            onClick={() => setFilterFavoritesOnly(false)}
          >
            All Outfits ({savedOutfits.length})
          </button>
          <button
            className={`filter-btn ${filterFavoritesOnly ? 'active' : ''}`}
            onClick={() => setFilterFavoritesOnly(true)}
          >
            <Heart size={14} className="heart-filled inline-heart" />
            Favourites ({favoritesCount})
          </button>
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
                onClick={() => setFilterOccasion(occ.id)}
                className={`occ-filter-btn ${filterOccasion === occ.id ? 'active' : ''}`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      {filtered.length > 0 ? (
        <div className="saved-outfits-grid">
          {filtered.map(outfit => {
            const top = outfit.items?.top ? getItem(outfit.items.top) : null;
            const bottom = outfit.items?.bottom ? getItem(outfit.items.bottom) : null;
            const dress = outfit.items?.dress ? getItem(outfit.items.dress) : null;
            const shoes = outfit.items?.shoes ? getItem(outfit.items.shoes) : null;
            const accessory = outfit.items?.accessory ? getItem(outfit.items.accessory) : null;

            const pieces = [top, bottom, dress, shoes, accessory].filter(Boolean);

            return (
              <div key={outfit.id} className="saved-outfit-card">
                {/* Card Header */}
                <div className="outfit-card-top-bar">
                  <div className="outfit-badges-row">
                    <span className={`badge-occasion ${outfit.occasion}`}>
                      {outfit.occasion === 'college' && '🎓'}
                      {outfit.occasion === 'casual' && '☕'}
                      {outfit.occasion === 'party' && '✨'} {outfit.occasion}
                    </span>
                    {outfit.createdAt && (
                      <span className="outfit-date-tag">
                        {outfit.createdAt}
                      </span>
                    )}
                  </div>

                  {/* Heart Favorite Toggle */}
                  <button
                    className={`btn-icon heart-fav-btn ${outfit.isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(outfit.id)}
                    title={outfit.isFavorite ? "Remove from favourites" : "Add to favourites"}
                  >
                    <Heart 
                      size={18} 
                      className={outfit.isFavorite ? 'heart-filled' : 'heart-empty'} 
                    />
                  </button>
                </div>

                {/* Outfit Collage Display */}
                <div className="outfit-collage-container">
                  <div className={`outfit-collage-grid ${dress ? 'one-piece-layout' : 'separates-layout'}`}>
                    {pieces.map((piece, i) => (
                      <div key={i} className="collage-slot">
                        <img 
                          src={piece.image} 
                          alt={piece.name} 
                          className="collage-item-img"
                        />
                        <span className="collage-label">{piece.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body info */}
                <div className="outfit-card-info">
                  <h3 className="serif-font outfit-card-name">{outfit.name}</h3>
                  {outfit.stylistNote && (
                    <p className="outfit-card-notes">{outfit.stylistNote}</p>
                  )}

                  {/* Piece Names Summary */}
                  <div className="outfit-pieces-summary">
                    {pieces.map((p, idx) => (
                      <span key={idx} className="summary-pill">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="outfit-card-footer">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onScheduleOutfit(outfit)}
                    title="Assign to a calendar date"
                  >
                    <Calendar size={14} /> Plan on Calendar
                  </button>

                  <button
                    className="btn-icon delete-outfit-btn"
                    onClick={() => {
                      if (window.confirm(`Delete "${outfit.name}" from your saved outfits?`)) {
                        onDeleteOutfit(outfit.id);
                      }
                    }}
                    title="Delete outfit"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-wardrobe-state">
          <div className="empty-icon-wrap">💖</div>
          <h3 className="serif-font empty-title">
            {filterFavoritesOnly ? 'No favourite outfits yet' : 'No saved outfits found'}
          </h3>
          <p className="empty-desc">
            {filterFavoritesOnly
              ? 'Click the heart icon on any outfit card to mark it as your favorite.'
              : 'Create your first outfit in the studio or generate one with the smart stylist!'}
          </p>
          <button className="btn btn-primary" onClick={onNavigateToStudio}>
            Create an Outfit Now
          </button>
        </div>
      )}
    </div>
  );
}
