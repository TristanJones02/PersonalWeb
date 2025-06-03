# Modern React Portfolio

A sleek, modern portfolio website built with React featuring a fixed sidebar navigation and keyboard shortcuts for enhanced user experience.

## Features

- 🎨 Modern, clean design with dark theme
- 🚀 Smooth scrolling between sections
- ⌨️ Keyboard shortcuts for navigation (press 1-8, G, C keys)
- 📱 Fully responsive design
- 🎯 Component-based React architecture (no JSX syntax)
- ✨ Smooth animations and hover effects
- 🔧 Easy to customize

## Sections

1. **Explore (1)** - Hero section with introduction
2. **Experience (2)** - Work experience timeline
3. **Projects (3)** - Featured projects showcase
4. **Services (4)** - Services offered (placeholder)
5. **About (5)** - About me section
6. **Feed (6)** - Content feed (placeholder)
7. **Thoughts (7)** - Blog/thoughts (placeholder)
8. **Stack (8)** - Technology stack
9. **Guest Book (G)** - Visitor messages (placeholder)
10. **Contact (C)** - Contact information

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Customization

### Personal Information

Edit the following files to customize with your information:

1. **`src/components/Sidebar.js`** - Update the `userProfile` object:
   ```javascript
   const userProfile = {
     name: 'Your Name',
     title: 'Your Title',
     avatar: '👨‍💻' // or your emoji/image
   };
   ```

2. **`src/components/MainContent.js`** - Update the hero section and other content areas with your information.

### Styling

- **Colors**: Modify CSS custom properties in the component CSS files
- **Layout**: Adjust grid layouts and spacing in the CSS files
- **Animations**: Customize transitions and hover effects

### Adding New Sections

1. Add the new section to the `sections` array in `src/App.js`
2. Create the corresponding section in `src/components/MainContent.js`
3. Update keyboard shortcuts if needed

### Project Structure

```
src/
├── App.js                 # Main app component
├── App.css               # Global styles
├── index.js              # Entry point
└── components/
    ├── Sidebar.js        # Navigation sidebar
    ├── Sidebar.css       # Sidebar styles
    ├── MainContent.js    # Main content sections
    └── MainContent.css   # Content styles
```

## Keyboard Shortcuts

- **1-8**: Navigate to numbered sections
- **G**: Jump to Guest Book
- **C**: Jump to Contact section

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using React 