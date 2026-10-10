import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Sparkles, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'tops', label: 'Tops', icon: '👚' },
  { id: 'bottoms', label: 'Bottoms', icon: '👖' },
  { id: 'dresses', label: 'Dresses', icon: '👗' },
  { id: 'shoes', label: 'Shoes', icon: '👠' },
  { id: 'accessories', label: 'Accessories', icon: '👜' }
];

const OCCASIONS = [
  { id: 'college', label: 'College', emoji: '🎓' },
  { id: 'casual', label: 'Casual Outing', emoji: '☕' },
  { id: 'party', label: 'Party', emoji: '✨' }
];

const PRESET_IMAGES = [
  {
    name: 'Pink Cardigan',
    category: 'tops',
    url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Cream Pleated Pants',
    category: 'bottoms',
    url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Silk Slip Dress',
    category: 'dresses',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Chic Heels',
    category: 'shoes',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pearl Mini Bag',
    category: 'accessories',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AddClothingModal({ isOpen, onClose, onAddItem }) {
  const [photoMode, setPhotoMode] = useState('upload'); // 'upload' or 'url'
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tops');
  const [image, setImage] = useState('');
  const [occasions, setOccasions] = useState(['college']);
  const [color, setColor] = useState('Blush Pink');
  const [season, setSeason] = useState('All-Year');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle local file upload (converts to base64 for easy localStorage storage)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (.jpg, .png, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Could not read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const toggleOccasion = (id) => {
    if (occasions.includes(id)) {
      if (occasions.length > 1) {
        setOccasions(occasions.filter(o => o !== id));
      }
    } else {
      setOccasions([...occasions, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for this clothing piece.');
      return;
    }
    if (!image.trim()) {
      setError('Please add or upload a photo of the clothing item.');
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      color: color.trim() || 'Custom',
      occasions,
      season,
      image,
      notes: notes.trim()
    };

    onAddItem(newItem);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setImage('');
    setCategory('tops');
    setOccasions(['college']);
    setColor('Blush Pink');
    setSeason('All-Year');
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-sparkle">✨</span>
            <h2 className="serif-font modal-title">Add to Digital Wardrobe</h2>
          </div>
          <button className="btn-icon" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-banner">{error}</div>}

            {/* Photo Selection Tabs */}
            <div className="form-group">
              <label className="form-label">Clothing Photo</label>
              <div className="photo-mode-tabs">
                <button
                  type="button"
                  className={`photo-tab-btn ${photoMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setPhotoMode('upload')}
                >
                  <Upload size={15} />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  className={`photo-tab-btn ${photoMode === 'url' ? 'active' : ''}`}
                  onClick={() => setPhotoMode('url')}
                >
                  <LinkIcon size={15} />
                  <span>Image URL</span>
                </button>
              </div>

              {photoMode === 'upload' ? (
                <div className="file-upload-dropzone">
                  <input
                    type="file"
                    id="clothing-file-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input-hidden"
                  />
                  <label htmlFor="clothing-file-input" className="file-dropzone-label">
                    <Upload size={28} className="upload-icon" />
                    <span className="upload-text">Click to browse clothing photo</span>
                    <span className="upload-subtext">Supports PNG, JPG, WEBP from your phone or PC</span>
                  </label>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <div className="preset-suggestions">
                    <span className="preset-label">Quick sample photos:</span>
                    <div className="preset-badges">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="preset-badge-btn"
                          onClick={() => {
                            setImage(preset.url);
                            setCategory(preset.category);
                            if (!name) setName(preset.name);
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Preview */}
              {image && (
                <div className="image-preview-container">
                  <div className="preview-label">Photo Preview:</div>
                  <div className="preview-card">
                    <img src={image} alt="Preview" className="preview-img" />
                    <button 
                      type="button" 
                      className="preview-clear-btn"
                      onClick={() => setImage('')}
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Item Name */}
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cream Cashmere Cardigan, Blush Satin Skirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <div className="category-select-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-select-btn ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-name">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions Tags */}
            <div className="form-group">
              <label className="form-label">Suitable Occasions (Select any)</label>
              <div className="occasion-toggles">
                {OCCASIONS.map((occ) => {
                  const isSelected = occasions.includes(occ.id);
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      className={`occasion-toggle-btn ${occ.id} ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleOccasion(occ.id)}
                    >
                      <span>{occ.emoji}</span>
                      <span>{occ.label}</span>
                      {isSelected && <Check size={14} className="check-icon" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color & Season Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Color / Shade</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Blush Pink, Off-White, Gold"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Season</label>
                <select
                  className="form-select"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  <option value="All-Year">All-Year</option>
                  <option value="Spring / Summer">Spring / Summer</option>
                  <option value="Autumn / Winter">Autumn / Winter</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Styling Notes (Optional)</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="How to wear it, pairing ideas, or fabric care..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Sparkles size={16} />
              Save to Wardrobe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
