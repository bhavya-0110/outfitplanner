import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  Heart, 
  Plus, 
  Check, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const SUGGESTED_NAMES = [
  "Campus Effortless Chic",
  "Rose Latte Brunch",
  "Golden Hour Party Glam",
  "Minimalist Library Stroll",
  "Sweetheart Weekend Getaway",
  "Presentation Day Power Look"
];

export default function OutfitCreator({ 
  wardrobe, 
  onSaveOutfit, 
  onNavigateToSaved 
}) {
  const [styleMode, setStyleMode] = useState('separates'); // 'separates' (top+bottom) or 'dress'
  const [selectedTopId, setSelectedTopId] = useState(null);
  const [selectedBottomId, setSelectedBottomId] = useState(null);
  const [selectedDressId, setSelectedDressId] = useState(null);
  const [selectedShoesId, setSelectedShoesId] = useState(null);
  const [selectedAccId, setSelectedAccId] = useState(null);

  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('college');
  const [stylistNote, setStylistNote] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSlotPicker, setActiveSlotPicker] = useState(null); // 'tops', 'bottoms', 'dresses', 'shoes', 'accessories'
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Categorized items
  const tops = wardrobe.filter(i => i.category === 'tops');
  const bottoms = wardrobe.filter(i => i.category === 'bottoms');
  const dresses = wardrobe.filter(i => i.category === 'dresses');
  const shoes = wardrobe.filter(i => i.category === 'shoes');
  const accessories = wardrobe.filter(i => i.category === 'accessories');

  // Resolved selected items
  const currentTop = tops.find(i => i.id === selectedTopId);
  const currentBottom = bottoms.find(i => i.id === selectedBottomId);
  const currentDress = dresses.find(i => i.id === selectedDressId);
  const currentShoes = shoes.find(i => i.id === selectedShoesId);
  const currentAcc = accessories.find(i => i.id === selectedAccId);

  // Cycle prev / next item in a category
  const cycleItem = (category, currentId, direction) => {
    let list = [];
    if (category === 'tops') list = tops;
    if (category === 'bottoms') list = bottoms;
    if (category === 'dresses') list = dresses;
    if (category === 'shoes') list = shoes;
    if (category === 'accessories') list = accessories;

    if (list.length === 0) return;

    const currentIndex = list.findIndex(i => i.id === currentId);
    let nextIndex = 0;
    if (currentIndex === -1) {
      nextIndex = 0;
    } else {
      nextIndex = direction === 'next' 
        ? (currentIndex + 1) % list.length 
        : (currentIndex - 1 + list.length) % list.length;
    }

    const nextItem = list[nextIndex];
    if (category === 'tops') setSelectedTopId(nextItem.id);
    if (category === 'bottoms') setSelectedBottomId(nextItem.id);
    if (category === 'dresses') setSelectedDressId(nextItem.id);
    if (category === 'shoes') setSelectedShoesId(nextItem.id);
    if (category === 'accessories') setSelectedAccId(nextItem.id);
  };

  // Randomize / Shuffle outfit
  const handleShuffle = () => {
    if (styleMode === 'separates') {
      if (tops.length > 0) setSelectedTopId(tops[Math.floor(Math.random() * tops.length)].id);
      if (bottoms.length > 0) setSelectedBottomId(bottoms[Math.floor(Math.random() * bottoms.length)].id);
    } else {
      if (dresses.length > 0) setSelectedDressId(dresses[Math.floor(Math.random() * dresses.length)].id);
    }
    if (shoes.length > 0) setSelectedShoesId(shoes[Math.floor(Math.random() * shoes.length)].id);
    if (accessories.length > 0) setSelectedAccId(accessories[Math.floor(Math.random() * accessories.length)].id);
  };

  // Clear canvas
  const handleClear = () => {
    setSelectedTopId(null);
    setSelectedBottomId(null);
    setSelectedDressId(null);
    setSelectedShoesId(null);
    setSelectedAccId(null);
    setOutfitName('');
    setStylistNote('');
  };

  // Save outfit handler
  const handleSave = (e) => {
    e.preventDefault();

    // Check if essential slots are filled
    const hasMainClothing = styleMode === 'separates' 
      ? (selectedTopId && selectedBottomId) 
      : selectedDressId;

    if (!hasMainClothing) {
      alert(styleMode === 'separates' 
        ? 'Please select both a Top and Bottom for this outfit!' 
        : 'Please select a Dress for this outfit!');
      return;
    }

    const name = outfitName.trim() || `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Ensemble`;

    const outfitItems = {};
    if (styleMode === 'separates') {
      outfitItems.top = selectedTopId;
      outfitItems.bottom = selectedBottomId;
    } else {
      outfitItems.dress = selectedDressId;
    }
    if (selectedShoesId) outfitItems.shoes = selectedShoesId;
    if (selectedAccId) outfitItems.accessory = selectedAccId;

    const newOutfit = {
      id: `outfit-${Date.now()}`,
      name,
      occasion,
      isFavorite,
      createdAt: new Date().toISOString().split('T')[0],
      items: outfitItems,
      stylistNote: stylistNote.trim() || `Styled with love for ${occasion} occasions.`
    };

    onSaveOutfit(newOutfit);

    // Trigger joyful celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF758F', '#F4A6B8', '#FFF0F3', '#D6A46A']
      });
    } catch {
      // safe fallback
    }

    setSaveSuccessMsg(`"${name}" saved to your lookbook!`);
    setTimeout(() => setSaveSuccessMsg(''), 4500);
  };

  // Render clothing slot box
  const renderSlot = (categoryKey, title, currentItem, list) => {
    return (
      <div className="outfit-canvas-slot">
        <div className="slot-header">
          <span className="slot-title">{title}</span>
          {currentItem && (
            <div className="slot-cycle-nav">
              <button 
                type="button"
                className="cycle-arrow-btn" 
                onClick={() => cycleItem(categoryKey, currentItem.id, 'prev')}
                title="Previous item"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                type="button"
                className="cycle-arrow-btn" 
                onClick={() => cycleItem(categoryKey, currentItem.id, 'next')}
                title="Next item"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {currentItem ? (
          <div className="slot-card-filled">
            <img src={currentItem.image} alt={currentItem.name} className="slot-img" />
            <div className="slot-overlay">
              <div className="slot-item-info">
                <span className="slot-item-name">{currentItem.name}</span>
                <span className="slot-item-color">{currentItem.color}</span>
              </div>
              <div className="slot-actions">
                <button 
                  type="button"
                  className="slot-btn change-btn"
                  onClick={() => setActiveSlotPicker(categoryKey)}
                >
                  Change
                </button>
                <button 
                  type="button"
                  className="slot-btn remove-btn"
                  onClick={() => {
                    if (categoryKey === 'tops') setSelectedTopId(null);
                    if (categoryKey === 'bottoms') setSelectedBottomId(null);
                    if (categoryKey === 'dresses') setSelectedDressId(null);
                    if (categoryKey === 'shoes') setSelectedShoesId(null);
                    if (categoryKey === 'accessories') setSelectedAccId(null);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="slot-card-empty"
            onClick={() => setActiveSlotPicker(categoryKey)}
          >
            <div className="empty-slot-plus">
              <Plus size={20} />
            </div>
            <span className="empty-slot-text">Select {title}</span>
            <span className="empty-slot-sub">{list.length} available</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="creator-section">
      {/* Top Banner */}
      <div className="creator-header">
        <div>
          <span className="hero-subhead">MIX & MATCH STUDIO</span>
          <h2 className="serif-font hero-title">Create Outfit Combinations</h2>
          <p className="hero-description">
            Experiment with layers, silhouettes, and accessories to build your perfect aesthetic.
          </p>
        </div>

        <div className="creator-header-tools">
          <button type="button" className="btn btn-secondary" onClick={handleShuffle}>
            <Shuffle size={16} /> Shuffle Look
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="success-banner">
          <span>💖 {saveSuccessMsg}</span>
          <button 
            type="button" 
            className="btn btn-outline-pink view-saved-shortcut-btn"
            onClick={onNavigateToSaved}
          >
            View in Saved Looks <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Style Mode Switcher (Separates vs Dress) */}
      <div className="style-mode-switcher-container">
        <span className="style-mode-label">Outfit Style:</span>
        <div className="style-mode-pills">
          <button
            type="button"
            className={`mode-pill ${styleMode === 'separates' ? 'active' : ''}`}
            onClick={() => setStyleMode('separates')}
          >
            👚 + 👖 Separates (Top & Bottom)
          </button>
          <button
            type="button"
            className={`mode-pill ${styleMode === 'dress' ? 'active' : ''}`}
            onClick={() => setStyleMode('dress')}
          >
            👗 One-Piece (Dress Look)
          </button>
        </div>
      </div>

      <div className="creator-layout-grid">
        {/* Left: Interactive Outfit Canvas / Lookbook Board */}
        <div className="outfit-canvas-board">
          <div className="board-decor-tag">LOOKBOOK CANVAS</div>
          
          <div className="slots-grid">
            {styleMode === 'separates' ? (
              <>
                {renderSlot('tops', 'Top / Blouse', currentTop, tops)}
                {renderSlot('bottoms', 'Bottom / Skirt / Pants', currentBottom, bottoms)}
              </>
            ) : (
              <div className="full-width-slot">
                {renderSlot('dresses', 'Dress', currentDress, dresses)}
              </div>
            )}
            {renderSlot('shoes', 'Footwear', currentShoes, shoes)}
            {renderSlot('accessories', 'Bag & Accessory', currentAcc, accessories)}
          </div>
        </div>

        {/* Right: Outfit Details & Save Form */}
        <div className="outfit-details-sidebar">
          <div className="sidebar-card">
            <h3 className="serif-font sidebar-title">Outfit Details</h3>
            <p className="sidebar-subtitle">Name and tag your combination for easy planning.</p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Outfit Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sunset Glow Monday, Campus Preppy"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                />
                <div className="suggested-names-list">
                  <span className="suggested-names-title">Ideas:</span>
                  {SUGGESTED_NAMES.slice(0, 3).map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      className="name-chip-btn"
                      onClick={() => setOutfitName(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Occasion</label>
                <div className="occasion-radio-group">
                  {[
                    { id: 'college', label: 'College', icon: '🎓' },
                    { id: 'casual', label: 'Casual Outing', icon: '☕' },
                    { id: 'party', label: 'Party', icon: '✨' }
                  ].map(occ => (
                    <label 
                      key={occ.id} 
                      className={`occasion-radio-card ${occasion === occ.id ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="outfit-occasion"
                        value={occ.id}
                        checked={occasion === occ.id}
                        onChange={() => setOccasion(occ.id)}
                        className="hidden-radio"
                      />
                      <span className="occ-icon">{occ.icon}</span>
                      <span className="occ-name">{occ.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Styling Notes</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Why this look works: e.g. tuck the shirt in, wear hair up with pearl earrings..."
                  value={stylistNote}
                  onChange={(e) => setStylistNote(e.target.value)}
                />
              </div>

              <div className="favorite-toggle-row">
                <label className="favorite-toggle-label">
                  <input
                    type="checkbox"
                    checked={isFavorite}
                    onChange={(e) => setIsFavorite(e.target.checked)}
                    className="favorite-checkbox"
                  />
                  <Heart 
                    size={18} 
                    className={isFavorite ? 'heart-filled' : 'heart-outline'} 
                  />
                  <span>Mark as Favourite Outfit</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Sparkles size={18} />
                Save Outfit Combination
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Wardrobe Drawer / Slot Picker Modal */}
      {activeSlotPicker && (
        <div className="modal-overlay" onClick={() => setActiveSlotPicker(null)}>
          <div className="modal-content slot-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="serif-font modal-title">
                Choose {activeSlotPicker.charAt(0).toUpperCase() + activeSlotPicker.slice(1)}
              </h3>
              <button className="btn-icon" onClick={() => setActiveSlotPicker(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="slot-picker-grid">
                {wardrobe
                  .filter(i => i.category === activeSlotPicker)
                  .map(item => (
                    <div 
                      key={item.id} 
                      className="picker-item-card"
                      onClick={() => {
                        if (activeSlotPicker === 'tops') setSelectedTopId(item.id);
                        if (activeSlotPicker === 'bottoms') setSelectedBottomId(item.id);
                        if (activeSlotPicker === 'dresses') setSelectedDressId(item.id);
                        if (activeSlotPicker === 'shoes') setSelectedShoesId(item.id);
                        if (activeSlotPicker === 'accessories') setSelectedAccId(item.id);
                        setActiveSlotPicker(null);
                      }}
                    >
                      <img src={item.image} alt={item.name} className="picker-img" />
                      <div className="picker-info">
                        <h5 className="picker-title">{item.name}</h5>
                        <span className="picker-color">{item.color}</span>
                      </div>
                    </div>
                  ))}
              </div>
              {wardrobe.filter(i => i.category === activeSlotPicker).length === 0 && (
                <p className="no-items-text">
                  You don't have any items in this category yet. Add some to your wardrobe first!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
