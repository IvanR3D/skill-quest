# Skill Quest - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Core Features](#core-features)
5. [Code Explanation](#code-explanation)
6. [Development Guide](#development-guide)
7. [Data Structure](#data-structure)
8. [Extension Points](#extension-points)
9. [Troubleshooting](#troubleshooting)

## Project Overview

**Skill Quest** is a gamified skill-tracking web tool that helps users visualize and track their learning progress through skill trees from [MakerSkillTree](https://github.com/sjpiper145/MakerSkillTree).

### Key Concepts
- **Skill Trees**: Visual representations of learning paths
- **XP System**: Gamified progression with levels
- **Achievements**: Milestone rewards for learning accomplishments
- **Activity Tracking**: Record of learning sessions and progress

## Architecture

### Technology Stack
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Storage**: Browser LocalStorage
- **Styling**: CSS3 with CSS Variables for theming
- **Graphics**: SVG for skill tree visualization. Specifically SVG generated with this [generator](https://schme16.github.io/MakerSkillTree-Generator/).

### Application Structure
```
Skill Quest/
├── UI Layer (HTML/CSS)
│   ├── Navigation Sidebar
│   ├── Main Content Areas
│   └── Modal System
├── Business Logic (JavaScript)
│   ├── State Management
│   ├── XP & Level System
│   └── Skill Tree Logic
└── Data Layer
    ├── LocalStorage Adapter
    └── Data Models
```

## File Structure

The application is contained in three files:

1. **index.html** - Defines the application layout and UI components
2. **style.css** - Comprehensive styling with game-inspired design
3. **main.js** - Application functionality and state management

## Core Features

### 1. Dashboard
- Overview of learning stats
- Progress tracking across all your added skill trees
- Recent activity feed
- Badge display system

### 2. Skill Library
- Collection management of skill trees
- Search and filtering capabilities
- Tree progress visualization
- Add/delete functionality

### 3. Skill Tree Viewer
- Interactive SVG-based skill trees
- Click-to-complete skill nodes
- Customizable completion colors
- Progress reset functionality

### 4. Profile Management
- User profile customization
- Learning statistics
- Application settings
- Data import/export

### 5. Gamification System
- **XP & Levels**: Progressive leveling system
- **Achievements**: Milestone-based rewards
- **Streaks**: Consecutive day tracking
- **Visual Effects**: Particle animations and confetti

## Code Explanation

### State Management
```javascript
const app = {
  currentPage: 'dashboard',
  skillTrees: [],           // All skill trees
  currentTree: null,        // Currently viewed tree
  profile: {               // User profile data
    name: 'User Name',
    bio: 'Learning enthusiast',
    defaultColor: '#6366F1',
    level: 1,
    xp: 0,
    xpToNextLevel: 100
  },
  stats: {                 // Learning statistics
    totalTrees: 0,
    completedTrees: 0,
    totalSkills: 0,
    completedSkills: 0,
    currentStreak: 0,
    totalPoints: 0
  },
  activity: [],            // Recent activities
  achievements: []         // Achievement system
};
```

### Key Functions

#### Navigation System
```javascript
function navigateToPage(page) {
  // Update active navigation links
  elements.navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === page);
  });
  
  // Show/hide pages
  elements.pages.forEach(p => {
    p.classList.toggle('active', p.id === page);
  });
  
  // Update application state
  app.currentPage = page;
  
  // Refresh page-specific data
  if (page === 'dashboard') updateDashboard();
  if (page === 'library') renderSkillTrees();
}
```

#### XP & Level System
```javascript
function gainXP(amount) {
  app.profile.xp += amount;
  
  // Level up logic
  while (app.profile.xp >= app.profile.xpToNextLevel) {
    app.profile.xp -= app.profile.xpToNextLevel;
    app.profile.level++;
    app.profile.xpToNextLevel = Math.floor(app.profile.xpToNextLevel * 1.5);
    
    // Celebration effects
    showAchievement('Level Up!', `You are now level ${app.profile.level}!`, '🎉');
    spawnConfetti();
  }
  
  updateLevel();
  saveToLocalStorage();
}
```

#### Skill Tree Management
```javascript
function renderSkillTree(tree) {
  elements.viewerContent.innerHTML = tree.svg;
  const svg = elements.viewerContent.querySelector('svg');
  
  // Make skill nodes interactive
  const skillElements = svg.querySelectorAll('.cls-12');
  skillElements.forEach((element, index) => {
    const skill = tree.skills[index];
    
    // Add click handlers for completion toggling
    element.addEventListener('click', (e) => {
      toggleSkillCompletion(skill, element, e);
    });
  });
}
```

## Development Guide

### Setting Up for Development
1. **Clone/Download** the files
2. **Open** in a code editor (VS Code recommended)
3. **Use Live Server** extension for development

### Adding New Features

#### 1. Adding a New Page
```javascript
// 1. Add navigation item in HTML
<li class="nav-item">
  <a href="#" class="nav-link" data-page="newpage">
    <!-- Icon and text -->
    New Page
  </a>
</li>

// 2. Add page content in HTML
<div class="page" id="newpage">
  <!-- Page content -->
</div>

// 3. Add page logic in JavaScript
function renderNewPage() {
  // Page-specific rendering logic
}
```

#### 2. Creating New Skill Tree Types
```javascript
function createCustomSkillTree(name, skills) {
  return {
    id: Date.now().toString(),
    name: name,
    category: 'custom',
    skills: skills.map(skill => ({
      id: `skill-${skill.name.toLowerCase()}`,
      name: skill.name,
      completed: false,
      dependencies: skill.dependencies || []
    })),
    // Additional custom properties
    customProperty: 'value'
  };
}
```

### Code Style Guidelines
- **Variables**: Use descriptive names (`calculateTreeProgress` not `calc`)
- **Functions**: Keep functions focused and under 50 lines
- **Comments**: Document complex logic and business rules
- **CSS**: Use CSS variables for theming
- **Error Handling**: Use try-catch for storage operations

## Data Structure

### Skill Tree Model
```javascript
{
  id: "123456789",                    // Unique identifier
  name: "JavaScript Fundamentals",    // Display name
  category: "programming",           // Classification
  description: "Learn JS basics",    // Optional description
  svg: "<svg>...</svg>",            // SVG content
  skills: [                         // Array of skills
    {
      id: "skill-0",
      name: "Variables",
      completed: false,
      color: "#6366F1",            // Completion color
      element: "<path...>"          // SVG element
    }
  ],
  completed: false,                 // Tree completion status
  score: 150,                       // Total XP earned
  createdAt: "2024-01-01T00:00:00Z" // Creation timestamp
}
```

### Profile Model
```javascript
{
  name: "User Name",
  bio: "Learning enthusiast",
  defaultColor: "#6366F1",
  notifications: "enabled",
  level: 5,
  xp: 350,
  xpToNextLevel: 500
}
```

## Extension Points

### 1. Adding New Achievement Types
```javascript
function addCustomAchievement(id, name, description, condition) {
  app.achievements.push({
    id: id,
    name: name,
    desc: description,
    unlocked: false,
    condition: condition  // Function that returns boolean
  });
}

// Example: Time-based achievement
addCustomAchievement(
  'night_owl', 
  'Night Owl', 
  'Complete skills after midnight',
  function() {
    const hour = new Date().getHours();
    return hour >= 0 && hour <= 4 && app.stats.completedSkills > 0;
  }
);
```

### 2. Custom Skill Tree Layouts
```javascript
// Create radial skill tree layout
function createRadialSkillTree(centerSkill, peripheralSkills) {
  // Implementation for radial layout generation
  // Returns SVG string with properly positioned skills
}

// Create linear progression tree  
function createLinearSkillTree(skills) {
  // Implementation for linear progression layout
}
```

### 3. Integration with External APIs
```javascript
// Example: Sync with learning platform
function syncWithExternalPlatform(apiKey, platform) {
  // Implementation for external data synchronization
}

// Example: Export to calendar
function exportToCalendar(activities) {
  // Implementation for calendar integration
}
```

## Troubleshooting

### Common Issues

#### 1. LocalStorage Not Saving
**Symptoms**: Data resets on page refresh
**Solution**: Check browser storage permissions and available space
```javascript
// Debug storage
console.log('Storage available:', navigator.storage.estimate());
```

#### 2. SVG Skill Trees Not Loading
**Symptoms**: Blank viewer or missing skills
**Solution**: Ensure SVG files have `.cls-12` class for skill nodes
```javascript
// Validate SVG structure
function validateSkillTreeSVG(svgContent) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = svgContent;
  return tempDiv.querySelectorAll('.cls-12').length > 0;
}
```

#### 3. Performance Issues with Large Skill Trees
**Symptoms**: Slow rendering or unresponsive UI
**Solution**: Implement virtualization or pagination
```javascript
// Lazy load skills for large trees
function renderSkillsChunked(skills, chunkSize = 50) {
  for (let i = 0; i < skills.length; i += chunkSize) {
    setTimeout(() => {
      renderSkillChunk(skills.slice(i, i + chunkSize));
    }, 0);
  }
}
```

### Debugging Tips

1. **Enable Debug Mode**:
```javascript
const DEBUG = true;
function debugLog(...args) {
  if (DEBUG) console.log('[SkillQuest]', ...args);
}
```

2. **Check Data Integrity**:
```javascript
function validateAppState() {
  console.log('Current state:', app);
  console.log('Storage data:', localStorage.getItem('skillTreeData'));
}
```

3. **Monitor Performance**:
```javascript
// Profile critical functions
function profileFunction(fn, name) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start}ms`);
  return result;
}
```

## Future Enhancements

### Planned Features
- **Social Features**: Sharing progress, friend comparisons
- **Advanced Analytics**: Learning patterns and recommendations
- **Mobile App**: React Native or Progressive Web App
- **Cloud Sync**: Cross-device synchronization
- **Custom Themes**: User-generated color schemes and layouts

### Technical Improvements
- **Modular Architecture**: Split into separate JS modules
- **Testing Suite**: Unit and integration tests
- **TypeScript Migration**: Better type safety
- **Build Process**: Minification and optimization
