import React, { useState, useEffect } from 'react';
import './App.css';

// Storage helpers
import { 
  getStoredWardrobe, 
  saveStoredWardrobe, 
  getStoredOutfits, 
  saveStoredOutfits, 
  getStoredCalendar, 
  saveStoredCalendar,
  resetDemoData 
} from './utils/storage';

// Components
import Navbar from './components/Navbar';
import Wardrobe from './components/Wardrobe';
import AddClothingModal from './components/AddClothingModal';
import OutfitCreator from './components/OutfitCreator';
import SmartStylist from './components/SmartStylist';
import SavedOutfits from './components/SavedOutfits';
import OutfitCalendar from './components/OutfitCalendar';
import ItemDetailModal from './components/ItemDetailModal';

export default function App() {
  // Navigation active tab: 'wardrobe' | 'creator' | 'stylist' | 'saved' | 'calendar'
  const [activeTab, setActiveTab] = useState('wardrobe');

  // Main Persistent States
  const [wardrobe, setWardrobe] = useState(getStoredWardrobe);
  const [savedOutfits, setSavedOutfits] = useState(getStoredOutfits);
  const [calendarPlans, setCalendarPlans] = useState(getStoredCalendar);

  // Modals & Overlay state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemDetail, setItemDetail] = useState(null);

  // Sync state changes with localStorage
  useEffect(() => {
    saveStoredWardrobe(wardrobe);
  }, [wardrobe]);

  useEffect(() => {
    saveStoredOutfits(savedOutfits);
  }, [savedOutfits]);

  useEffect(() => {
    saveStoredCalendar(calendarPlans);
  }, [calendarPlans]);

  // Wardrobe Handlers
  const handleAddItem = (newItem) => {
    setWardrobe(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (id) => {
    setWardrobe(prev => prev.filter(item => item.id !== id));
  };

  // Outfit Handlers
  const handleSaveOutfit = (newOutfit) => {
    setSavedOutfits(prev => [newOutfit, ...prev]);
  };

  const handleToggleFavorite = (outfitId) => {
    setSavedOutfits(prev => 
      prev.map(outfit => 
        outfit.id === outfitId 
          ? { ...outfit, isFavorite: !outfit.isFavorite } 
          : outfit
      )
    );
  };

  const handleDeleteOutfit = (outfitId) => {
    setSavedOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
  };

  // Calendar Plan Handlers
  const handleSavePlan = (dateKey, planData) => {
    setCalendarPlans(prev => ({
      ...prev,
      [dateKey]: planData
    }));
  };

  const handleDeletePlan = (dateKey) => {
    setCalendarPlans(prev => {
      const copy = { ...prev };
      delete copy[dateKey];
      return copy;
    });
  };

  // Direct schedule shortcut from Stylist or Saved looks
  const handleScheduleOutfitShortcut = (outfit) => {
    // If it's not yet in saved outfits, save it first
    const exists = savedOutfits.find(o => o.id === outfit.id);
    if (!exists) {
      handleSaveOutfit(outfit);
    }
    // Switch to calendar tab so user can pick the exact day
    setActiveTab('calendar');
  };

  // Reset to default sample clothes & looks
  const handleReset = () => {
    if (window.confirm('Reset wardrobe, outfits, and calendar to sample demo collection?')) {
      resetDemoData();
      setWardrobe(getStoredWardrobe());
      setSavedOutfits(getStoredOutfits());
      setCalendarPlans(getStoredCalendar());
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={wardrobe.length}
        savedCount={savedOutfits.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetData={handleReset}
      />

      {/* Main Tab Content */}
      <main className="main-content">
        {activeTab === 'wardrobe' && (
          <Wardrobe
            wardrobe={wardrobe}
            onDeleteItem={handleDeleteItem}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onSelectItemDetail={(item) => setItemDetail(item)}
            onNavigateToStudio={() => setActiveTab('creator')}
          />
        )}

        {activeTab === 'creator' && (
          <OutfitCreator
            wardrobe={wardrobe}
            onSaveOutfit={handleSaveOutfit}
            onNavigateToSaved={() => setActiveTab('saved')}
          />
        )}

        {activeTab === 'stylist' && (
          <SmartStylist
            wardrobe={wardrobe}
            savedOutfits={savedOutfits}
            onSaveOutfit={handleSaveOutfit}
            onScheduleOutfit={handleScheduleOutfitShortcut}
            onNavigateToStudio={() => setActiveTab('creator')}
          />
        )}

        {activeTab === 'saved' && (
          <SavedOutfits
            savedOutfits={savedOutfits}
            wardrobe={wardrobe}
            onToggleFavorite={handleToggleFavorite}
            onDeleteOutfit={handleDeleteOutfit}
            onScheduleOutfit={handleScheduleOutfitShortcut}
            onNavigateToStudio={() => setActiveTab('creator')}
          />
        )}

        {activeTab === 'calendar' && (
          <OutfitCalendar
            calendarPlans={calendarPlans}
            savedOutfits={savedOutfits}
            wardrobe={wardrobe}
            onSavePlan={handleSavePlan}
            onDeletePlan={handleDeletePlan}
            onNavigateToStudio={() => setActiveTab('creator')}
          />
        )}
      </main>

      {/* Add Clothing Modal (Accessible anywhere) */}
      <AddClothingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Item Zoom / Detail Modal */}
      <ItemDetailModal
        item={itemDetail}
        onClose={() => setItemDetail(null)}
        onOpenStudioWithItem={() => {
          setActiveTab('creator');
        }}
      />
    </div>
  );
}
