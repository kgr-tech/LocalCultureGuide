# Quick Start Guide

Get the Bangalore Local Culture Guide running in 3 minutes!

## 🚀 Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser
# Visit http://localhost:5173
```

That's it! The app is now running with sample Bangalore data.

## 🎯 Try These Features

### 1. Slang Translator
- Search for "Maga" or "MVP"
- Try partial searches like "Gu" to find "Guru"
- Browse Kannada and tech slang

### 2. Street Food Recommender
- Search for "Dosa" or "Biryani"
- Click time filters (Morning/Afternoon/Evening)
- See current time highlighted
- View spots, prices, and best times

### 3. Traffic Estimator
- Search for "Whitefield" or "Koramangala"
- Watch for peak hour warnings (8-10 AM, 5:30-7:30 PM)
- See dynamic travel time calculations

### 4. Local Culture Hub
- Browse by category (Neighborhoods, Startups, Festivals, Coffee, Living)
- Search for "Koramangala" or "Ugadi"
- Expand details for more information

## 🎨 Customize for Your City

### Step 1: Edit the Knowledge Base

Open `public/product.md` and replace Bangalore data with your city's information.

### Step 2: Follow the Format

```markdown
## Slang Translator
### Your Slang Term
- **Category**: kannada | tech | general
- **Meaning**: What it means
- **Usage**: "Example sentence"
- **Example**: Context

## Street Food Recommender
### Your Food Item
- **Description**: What it is
- **Spots**: Location 1, Location 2, Location 3
- **Price Range**: $X-Y or ₹X-Y
- **Best Times**: Morning, Afternoon, Evening
- **Category**: Food type
- **Tags**: Tag1, Tag2, Tag3
```

### Step 3: Reload

Just refresh your browser - no code changes needed!

## 📱 Test Responsive Design

- Resize your browser window
- Try on mobile (use browser dev tools)
- Test dark mode (system preference)

## 🧪 Run Tests (Optional)

```bash
npm test
```

## 🏗️ Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 💡 Tips

1. **Search is fuzzy** - Misspellings and partial matches work
2. **Time-aware** - Food and traffic adapt to current time
3. **Keyboard friendly** - Tab through everything
4. **Dark mode** - Automatically follows system preference
5. **Mobile optimized** - Works great on all devices

## 🆘 Troubleshooting

### Port already in use?
```bash
# Vite will automatically try the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

### Module not found?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Data not loading?
- Check that `public/product.md` exists
- Check browser console for errors
- Verify markdown format matches examples

## 🎓 Next Steps

1. Customize `product.md` with your city's data
2. Adjust colors in `src/styles/global.css`
3. Add your own modules (copy existing ones as templates)
4. Deploy to Vercel, Netlify, or GitHub Pages

## 📚 Learn More

- See `README.md` for full documentation
- Check `src/components/` for component examples
- Review `src/services/` for business logic
- Explore `src/styles/` for design system

---

Happy coding! 🎉
