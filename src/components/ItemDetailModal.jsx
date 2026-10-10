import React from 'react';
import { X, Sparkles, Tag, Calendar, Layers } from 'lucide-react';

export default function ItemDetailModal({ item, onClose, onOpenStudioWithItem }) {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content item-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="badge-category">{item.category}</span>
            <h3 className="serif-font modal-title">{item.name}</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body item-detail-body">
          <div className="item-detail-image-box">
            <img src={item.image} alt={item.name} className="item-detail-image" />
          </div>

          <div className="item-detail-info">
            <div className="detail-prop-group">
              <span className="detail-prop-label">Color / Shade</span>
              <span className="detail-prop-value">{item.color || 'Standard'}</span>
            </div>

            <div className="detail-prop-group">
              <span className="detail-prop-label">Season</span>
              <span className="detail-prop-value">{item.season || 'All-Year'}</span>
            </div>

            <div className="detail-prop-group">
              <span className="detail-prop-label">Suitable For</span>
              <div className="detail-occasions-row">
                {item.occasions.map(occ => (
                  <span key={occ} className={`badge-occasion ${occ}`}>
                    {occ === 'college' && '🎓'}
                    {occ === 'casual' && '☕'}
                    {occ === 'party' && '✨'} {occ}
                  </span>
                ))}
              </div>
            </div>

            {item.notes && (
              <div className="detail-prop-group">
                <span className="detail-prop-label">Stylist Notes</span>
                <p className="detail-notes-text">{item.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              if (onOpenStudioWithItem) onOpenStudioWithItem(item);
            }}
          >
            <Sparkles size={16} /> Style in Studio
          </button>
        </div>
      </div>
    </div>
  );
}
