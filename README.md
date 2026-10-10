# 🎀 Aura — Digital Wardrobe & Outfit Planner

A modern fashion web application built with **React and CSS**, designed with an editorial **pink, cream, and white aesthetic**.

---

## ✨ Features

1. **Digital Wardrobe**:
   - Add clothes by uploading images directly from your computer or pasting image links.
   - Categorize by **Tops**, **Bottoms**, **Dresses**, **Shoes**, and **Accessories**.
   - Tag with occasions (*College*, *Casual Outing*, *Party*), colors, and season.
   - Filter by categories, occasions, and search by keywords.

2. **Mix & Match Outfit Studio**:
   - Interactive visual collage canvas.
   - Switch between **Separates** (Top + Bottom + Shoes + Bag) or **One-Piece** (Dress + Shoes + Bag).
   - Cycle through clothes with one-click arrows or open the drawer to select.
   - Confetti celebration upon saving your looks!

3. **Smart Stylist (Suggestions Engine)**:
   - Curates outfits tailored for:
     - 🎓 **College & Campus** (Practical, comfortable, lecture-ready)
     - ☕ **Casual Outings & Brunch** (Chic, photo-ready, relaxed)
     - ✨ **Party & Night Out** (Statement glam, sparkles, heels)
   - Includes stylist rationale notes explaining why the silhouettes and colors pair well.

4. **Saved & Favourite Looks**:
   - Lookbook grid of all saved combinations with composite photo previews.
   - Heart icon to favorite/unfavorite outfits with a dedicated "Favourites Only" filter.
   - One-click scheduling onto the calendar.

5. **Outfit Calendar Planner**:
   - Monthly interactive calendar with day-by-day views.
   - Assign outfits to specific calendar dates and add notes (e.g. *"Final Presentation"*, *"Dinner Date"*).
   - "Upcoming Schedule" sidebar for your week ahead.

6. **Automatic Persistence**:
   - All wardrobe pieces, custom outfits, and calendar schedules are safely preserved in browser `localStorage`.
   - Includes a sample wardrobe so the app looks alive immediately.

---

## 🚀 How to Run the App

### 1. Open Terminal in the project folder
```powershell
cd c:\Users\devab\Downloads\outfitplanner
```

### 2. Run the development server
```powershell
npm run dev
```

### 3. Open in your browser
Go to [http://localhost:5173/](http://localhost:5173/) in your web browser (Chrome, Edge, Safari, Firefox).

---

## 📁 Project Structure

```
outfitplanner/
├── index.html                   # HTML entry point with Google Fonts (Cormorant Garamond & Plus Jakarta Sans)
├── package.json                 # Project dependencies (React 19, Lucide-react, canvas-confetti, Vite)
├── src/
│   ├── main.jsx                 # Mounts the React application
│   ├── App.jsx                  # Main application state and tab router
│   ├── App.css                  # Custom CSS styling (Pink, Cream & White theme)
│   ├── index.css                # Base design tokens and CSS variables
│   ├── data/
│   │   └── sampleWardrobe.js    # Curated aesthetic sample clothes & outfits
│   ├── utils/
│   │   └── storage.js           # LocalStorage helpers for wardrobe, outfits & calendar
│   └── components/
│       ├── Navbar.jsx           # Header with navigation tabs & quick counts
│       ├── Wardrobe.jsx         # Closet catalog with category tabs & filters
│       ├── AddClothingModal.jsx # Image upload / URL modal
│       ├── OutfitCreator.jsx    # Visual canvas & outfit mixer
│       ├── SmartStylist.jsx     # AI/Smart suggestions for College, Casual, Party
│       ├── SavedOutfits.jsx     # Lookbook with favorites & filters
│       ├── OutfitCalendar.jsx   # Interactive monthly planning calendar
│       └── ItemDetailModal.jsx  # Clothing inspector modal
```
