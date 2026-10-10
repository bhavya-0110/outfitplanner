import React from 'react';
import { 
  Sparkles, 
  Shirt, 
  Layers, 
  Heart, 
  Calendar as CalendarIcon, 
  Plus, 
  RotateCcw 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  wardrobeCount, 
  savedCount, 
  onOpenAddModal, 
  onResetData 
}) {
  const navItems = [
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt, badge: wardrobeCount },
    { id: 'creator', label: 'Outfit Studio', icon: Layers },
    { id: 'stylist', label: 'Smart Stylist', icon: Sparkles },
    { id: 'saved', label: 'Saved Looks', icon: Heart, badge: savedCount },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon }
  ];

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => setActiveTab('wardrobe')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">
            <span className="brand-emoji">🎀</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Aura</h1>
            <p className="brand-subtitle">Outfit & Wardrobe Planner</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-tabs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} className={isActive ? 'icon-active' : ''} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`tab-badge ${isActive ? 'badge-active' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button 
            className="btn btn-primary"
            onClick={onOpenAddModal}
            title="Add clothing to wardrobe"
          >
            <Plus size={18} />
            <span className="add-btn-text">Add Clothing</span>
          </button>

          <button
            className="btn-icon"
            onClick={onResetData}
            title="Reset to sample wardrobe"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
