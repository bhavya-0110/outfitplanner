import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Heart, 
  Calendar, 
  Check, 
  Shuffle, 
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';

const OCCASION_STYLES = [
  {
    id: 'college',
    title: 'College & Campus',
    emoji: '🎓',
    tagline: 'Effortless, comfortable, and lecture-ready silhouettes.',
    colorTheme: '#EBF4EC'
  },
  {
    id: 'casual',
    title: 'Casual Outings & Brunch',
    emoji: '☕',
    tagline: 'Chic cafe dates, weekend strolling, and relaxed vibes.',
    colorTheme: '#FFF6E5'
  },
  {
    id: 'party',
    title: 'Party & Evening Glam',
    emoji: '✨',
    tagline: 'Statement looks, shimmering accents, and night-out glamour.',
    colorTheme: '#FDF0F4'
  }
];

export default function SmartStylist({ 
  wardrobe, 
  savedOutfits, 
  onSaveOutfit, 
  onScheduleOutfit, 
  onNavigateToStudio 
}) {
  const [selectedOccasion, setSelectedOccasion] = useState('college');
  const [generationSeed, setGenerationSeed] = useState(1);
  const [savedAlert, setSavedAlert] = useState(null);

  // Group items
  const tops = wardrobe.filter(i => i.category === 'tops');
  const bottoms = wardrobe.filter(i => i.category === 'bottoms');
  const dresses = wardrobe.filter(i => i.category === 'dresses');
  const shoes = wardrobe.filter(i => i.category === 'shoes');
  const accessories = wardrobe.filter(i => i.category === 'accessories');

  // Filter items matching the occasion
  const getItemsForOccasion = (list, occ) => {
    const matched = list.filter(item => item.occasions && item.occasions.includes(occ));
    return matched.length > 0 ? matched : list;
  };

  // Generate suggested looks for current occasion
  const suggestions = useMemo(() => {
    const occasionTops = getItemsForOccasion(tops, selectedOccasion);
    const occasionBottoms = getItemsForOccasion(bottoms, selectedOccasion);
    const occasionDresses = getItemsForOccasion(dresses, selectedOccasion);
    const occasionShoes = getItemsForOccasion(shoes, selectedOccasion);
    const occasionAccessories = getItemsForOccasion(accessories, selectedOccasion);

    const generated = [];

    // Helper pick pseudo-random
    const pick = (arr, offset = 0) => {
      if (!arr || arr.length === 0) return null;
      const index = (generationSeed + offset) % arr.length;
      return arr[index];
    };

    if (selectedOccasion === 'college') {
      // Look 1: Clean smart separates
      const top1 = pick(occasionTops, 0);
      const bot1 = pick(occasionBottoms, 0);
      const shoe1 = occasionShoes.find(s => s.name.toLowerCase().includes('sneaker') || s.name.toLowerCase().includes('flat')) || pick(occasionShoes, 0);
      const acc1 = occasionAccessories.find(a => a.name.toLowerCase().includes('tote') || a.name.toLowerCase().includes('chain')) || pick(occasionAccessories, 0);

      if (top1 && bot1) {
        generated.push({
          id: `sug-col-1-${generationSeed}`,
          title: "The Campus Intellectual",
          occasion: 'college',
          items: { top: top1.id, bottom: bot1.id, shoes: shoe1?.id, accessory: acc1?.id },
          stylistNote: `Tailored ${bot1.name} creates structured poise, tempered by the comfort of ${top1.name}. Finished with ${shoe1?.name || 'casual footwear'} for easy walking across campus.`
        });
      }

      // Look 2: Relaxed knit or casual look
      const top2 = pick(occasionTops, 1) || top1;
      const bot2 = pick(occasionBottoms, 1) || bot1;
      const shoe2 = pick(occasionShoes, 1) || shoe1;
      const acc2 = pick(occasionAccessories, 1) || acc1;

      if (top2 && bot2 && top2.id !== top1?.id) {
        generated.push({
          id: `sug-col-2-${generationSeed}`,
          title: "Library Loft Aesthetic",
          occasion: 'college',
          items: { top: top2.id, bottom: bot2.id, shoes: shoe2?.id, accessory: acc2?.id },
          stylistNote: `Soft layers featuring ${top2.name} and ${bot2.name}. An understated, study-session ready ensemble with quiet luxury undertones.`
        });
      }
    } else if (selectedOccasion === 'casual') {
      // Look 1: Brunch / Cafe
      const dress1 = pick(occasionDresses, 0);
      const shoe1 = pick(occasionShoes, 0);
      const acc1 = pick(occasionAccessories, 0);

      if (dress1) {
        generated.push({
          id: `sug-cas-1-${generationSeed}`,
          title: "Sunday Matcha & Sunshine",
          occasion: 'casual',
          items: { dress: dress1.id, shoes: shoe1?.id, accessory: acc1?.id },
          stylistNote: `Flowing silhouette with ${dress1.name}. Accessorized with ${acc1?.name || 'a chic mini bag'} for an effortlessly photogenic brunch mood.`
        });
      }

      // Look 2: Casual Separates
      const top1 = pick(occasionTops, 1);
      const bot1 = pick(occasionBottoms, 0);
      const shoe2 = pick(occasionShoes, 2) || shoe1;
      const acc2 = pick(occasionAccessories, 1) || acc1;

      if (top1 && bot1) {
        generated.push({
          id: `sug-cas-2-${generationSeed}`,
          title: "Pastel City Stroll",
          occasion: 'casual',
          items: { top: top1.id, bottom: bot1.id, shoes: shoe2?.id, accessory: acc2?.id },
          stylistNote: `Pairing ${top1.name} with ${bot1.name} strikes the ideal balance between laid-back ease and curated elegance.`
        });
      }
    } else if (selectedOccasion === 'party') {
      // Look 1: Statement Dress
      const partyDress = occasionDresses.find(d => d.occasions.includes('party')) || pick(occasionDresses, 0);
      const partyShoe = occasionShoes.find(s => s.name.toLowerCase().includes('heel') || s.occasions.includes('party')) || pick(occasionShoes, 0);
      const partyAcc = occasionAccessories.find(a => a.occasions.includes('party')) || pick(occasionAccessories, 0);

      if (partyDress) {
        generated.push({
          id: `sug-pty-1-${generationSeed}`,
          title: "Starlight Cocktail Glamour",
          occasion: 'party',
          items: { dress: partyDress.id, shoes: partyShoe?.id, accessory: partyAcc?.id },
          stylistNote: `Showstopping ${partyDress.name} elevated with ${partyShoe?.name || 'statement heels'} and gleaming ${partyAcc?.name || 'jewelry'} for evening magic.`
        });
      }

      // Look 2: Elevated Separates
      const top1 = occasionTops.find(t => t.occasions.includes('party')) || pick(occasionTops, 0);
      const bot1 = occasionBottoms.find(b => b.occasions.includes('party')) || pick(occasionBottoms, 0);

      if (top1 && bot1) {
        generated.push({
          id: `sug-pty-2-${generationSeed}`,
          title: "Modern VIP Chic",
          occasion: 'party',
          items: { top: top1.id, bottom: bot1.id, shoes: partyShoe?.id, accessory: partyAcc?.id },
          stylistNote: `High-contrast glamour: pairing ${top1.name} with sleek ${bot1.name} creates an alluring, high-fashion statement.`
        });
      }
    }

    return generated;
  }, [tops, bottoms, dresses, shoes, accessories, selectedOccasion, generationSeed]);

  // Helper to resolve items in suggestion
  const resolveItem = (id) => wardrobe.find(i => i.id === id);

  // Quick save suggested outfit
  const handleSaveSuggestion = (sug) => {
    const newOutfit = {
      id: `outfit-${Date.now()}`,
      name: sug.title,
      occasion: sug.occasion,
      isFavorite: true,
      createdAt: new Date().toISOString().split('T')[0],
      items: sug.items,
      stylistNote: sug.stylistNote
    };

    onSaveOutfit(newOutfit);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    setSavedAlert(sug.title);
    setTimeout(() => setSavedAlert(null), 3500);
  };

  return (
    <div className="stylist-section">
      {/* Header */}
      <div className="stylist-hero">
        <div className="hero-text-content">
          <span className="hero-subhead">AI PERSONAL STYLIST</span>
          <h2 className="serif-font hero-title">Smart Outfit Suggestions</h2>
          <p className="hero-description">
            Never wonder what to wear again. Let your digital stylist generate bespoke looks from your closet for college, casual outings, or tonight's party.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setGenerationSeed(prev => prev + 1)}
        >
          <Shuffle size={17} />
          <span>Shuffle Stylist Suggestions</span>
        </button>
      </div>

      {savedAlert && (
        <div className="success-banner">
          <BookmarkCheck size={18} />
          <span>Saved "{savedAlert}" directly to your lookbook!</span>
        </div>
      )}

      {/* Occasion Selection Cards */}
      <div className="stylist-occasion-cards">
        {OCCASION_STYLES.map(occ => {
          const isSelected = selectedOccasion === occ.id;
          return (
            <div 
              key={occ.id}
              className={`occasion-card ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedOccasion(occ.id)}
            >
              <div className="occ-card-top">
                <span className="occ-card-emoji">{occ.emoji}</span>
                {isSelected && <span className="active-stylist-tag">Styling Now</span>}
              </div>
              <h3 className="serif-font occ-card-title">{occ.title}</h3>
              <p className="occ-card-tagline">{occ.tagline}</p>
            </div>
          );
        })}
      </div>

      {/* Suggestions Results */}
      <div className="suggestions-container">
        <div className="suggestions-header">
          <h3 className="serif-font suggestions-title">
            Curated Outfits for {OCCASION_STYLES.find(o => o.id === selectedOccasion)?.title}
          </h3>
          <span className="suggestions-count">{suggestions.length} looks curated</span>
        </div>

        {suggestions.length > 0 ? (
          <div className="suggestions-grid">
            {suggestions.map((sug) => {
              const top = sug.items.top ? resolveItem(sug.items.top) : null;
              const bottom = sug.items.bottom ? resolveItem(sug.items.bottom) : null;
              const dress = sug.items.dress ? resolveItem(sug.items.dress) : null;
              const shoe = sug.items.shoes ? resolveItem(sug.items.shoes) : null;
              const acc = sug.items.accessory ? resolveItem(sug.items.accessory) : null;

              const pieces = [top, bottom, dress, shoe, acc].filter(Boolean);

              return (
                <div key={sug.id} className="suggestion-card">
                  <div className="suggestion-header-row">
                    <div>
                      <span className={`badge-occasion ${sug.occasion}`}>
                        {sug.occasion}
                      </span>
                      <h4 className="serif-font suggestion-name">{sug.title}</h4>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSaveSuggestion(sug)}
                    >
                      <Heart size={14} />
                      <span>Save Look</span>
                    </button>
                  </div>

                  {/* Collage Preview */}
                  <div className="suggestion-pieces-row">
                    {pieces.map((piece, idx) => (
                      <div key={idx} className="suggestion-piece-thumb">
                        <img src={piece.image} alt={piece.name} className="piece-img" />
                        <span className="piece-cat-label">{piece.category}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stylist Note */}
                  <div className="suggestion-stylist-note">
                    <span className="stylist-badge">
                      <Sparkles size={13} /> Stylist Note
                    </span>
                    <p className="note-text">{sug.stylistNote}</p>
                  </div>

                  {/* Actions */}
                  <div className="suggestion-footer-actions">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSaveSuggestion(sug)}
                    >
                      <BookmarkCheck size={14} /> Add to Favorites
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onScheduleOutfit(sug)}
                    >
                      <Calendar size={14} /> Plan on Calendar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-wardrobe-state">
            <p className="empty-desc">
              Not enough clothing pieces in your wardrobe to create an outfit for this occasion.
              Add tops, bottoms, or dresses tagged for "{selectedOccasion}" to get personalized suggestions!
            </p>
            <button className="btn btn-primary" onClick={onNavigateToStudio}>
              Build Manually in Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
