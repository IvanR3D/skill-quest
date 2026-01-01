# 🤝 Contributing to Skill Quest

First off, thank you for considering contributing to Skill Quest! We're excited to have you join our community of developers and learners working together to create a better learning experience for everyone.

## 🎯 Our Vision

We're transforming Skill Quest from a **local progress tracking tool** into a **collaborative online learning platform**. Your contributions will help build:
- A gamified community for skill tree completion
- A shared resource database for learning materials
- Social features for learners to connect and collaborate

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Style Guidelines](#style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Feature Roadmap](#feature-roadmap)
- [Questions?](#questions)

## 📜 Code of Conduct

We are committed to fostering a welcoming and inclusive community. By participating in this project, you agree to:

1. **Be respectful** to all community members
2. **Provide constructive feedback** and accept it gracefully
3. **Focus on what's best for the community**
4. **Show empathy** towards other contributors
5. **Help newcomers** get oriented and contribute

Unacceptable behavior includes harassment, discrimination, personal attacks, and trolling. Violators may be temporarily or permanently banned from the project.

## 🚀 Getting Started

### Prerequisites
- Basic understanding of HTML, CSS, and JavaScript
- A GitHub account
- A code editor (VS Code recommended)
- A modern web browser

### Setting Up Your Development Environment

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page
   - Clone your fork locally:
     ```bash
     git clone https://github.com/ivanr3d/skill-quest.git
     cd skill-quest
     ```

2. **Set Up Remote Upstream**
   ```bash
   git remote add upstream https://github.com/ivanr3d/skill-quest.git
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

4. **Run the Application**
   - Open `index.html` directly in your browser

## 🏗️ Project Structure

```
skill-quest/
├── index.html          # Main HTML file
├── style.css           # All styles
├── main.js             # Core application logic
├── CONTRIBUTING.md     # This file
├── README.md           # Project overview
└── PROJECT_DOCS.md     # Technical documentation
```

### Key Architectural Points
- **No frameworks** - Pure vanilla JS for simplicity
- **LocalStorage-based** - No backend required (yet)
- **Modular functions** - Organized by feature area
- **CSS Variables** - For consistent theming

## ✨ Style Guidelines

### JavaScript
- **Variables**: Use descriptive names (`calculateTreeProgress` not `calc`)
- **Functions**: Keep under 50 lines, single responsibility
- **Comments**: Document complex logic and business rules
- **Formatting**: Use consistent indentation (2 spaces)
- **Error Handling**: Use try-catch for storage operations

```javascript
// Good Example
function calculateTreeProgress(tree) {
  if (!tree.skills || tree.skills.length === 0) return 0;
  const completed = tree.skills.filter(skill => skill.completed).length;
  return (completed / tree.skills.length) * 100;
}

// Bad Example
function calc(t) {
  let c = 0;
  for(let s of t.skills) if(s.completed) c++;
  return c/t.skills.length*100;
}
```

### CSS
- Use CSS custom properties (variables) for theming
- Follow BEM-like naming for complex components
- Keep selectors specific but not overly nested
- Add comments for complex layouts

```css
/* Good Example */
.stat-card {
  background-color: var(--surface);
  border-radius: var(--radius);
  padding: 2rem;
}

/* Avoid deep nesting */
.sidebar .nav-menu .nav-item .nav-link.active {
  /* Too specific! */
}
```

### HTML
- Semantic HTML5 elements
- Accessible attributes (aria-labels, alt text)
- Consistent class naming

## 🔄 Development Workflow

### 1. Find an Issue or Feature
- Check the [Issues](https://github.com/ivanr3d/skill-quest/issues) tab
- Look for labels like `good first issue`, `help wanted`, or `enhancement`
- Or propose your own feature by opening an issue first

### 2. Discuss Before Coding
- Comment on the issue to let others know you're working on it
- Ask questions if anything is unclear
- Suggest your approach for feedback

### 3. Write Your Code
- Keep changes focused and minimal
- Add comments for complex logic
- Test thoroughly in multiple browsers

### 4. Test Your Changes
```bash
# Manual Testing Checklist
- [ ] Works in Chrome/Firefox/Safari/Edge
- [ ] Mobile responsive
- [ ] No console errors
- [ ] LocalStorage operations work
- [ ] All existing features still work
```

### 5. Commit Your Changes
```bash
# Use descriptive commit messages
git commit -m "feat: add cloud sync functionality"
git commit -m "fix: resolve SVG parsing issue"
git commit -m "docs: update API documentation"

# Conventional commit prefixes:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Formatting
# refactor: Code restructuring
# test: Adding tests
# chore: Maintenance
```

### 6. Keep Your Fork Updated
```bash
git fetch upstream
git merge upstream/main
# Resolve any conflicts
```

## 📤 Pull Request Process

1. **Update Your Branch**
   ```bash
   git pull upstream main
   git push origin your-branch-name
   ```

2. **Open a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Description Template**
   ```markdown
   ## Description
   Briefly describe your changes
   
   ## Related Issue
   Fixes #123 (if applicable)
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] UI/UX improvement
   
   ## Testing Steps
   1. Open the application
   2. Navigate to...
   3. Verify that...
   
   ## Screenshots (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-reviewed my own code
   - [ ] Added comments for complex logic
   - [ ] Tested in multiple browsers
   - [ ] All tests pass (if applicable)
   ```

4. **Review Process**
   - Maintainers will review your PR
   - Address any feedback requested
   - Update your PR as needed
   - Once approved, it will be merged!

## 🗺️ Feature Roadmap - Where to Contribute

### 🔥 High Priority (Phase 2)
- **User Authentication System**
  - Sign up/login functionality
  - Social login (Google, GitHub)
  - Password reset flow

- **Cloud Sync**
  - Backend API design
  - Real-time sync between devices
  - Conflict resolution

- **Basic Social Features**
  - Public profile pages
  - Follow other users
  - Activity feed

### 🚀 Medium Priority
- **Learning Resource Database**
  - Resource submission form
  - Voting system for resources
  - Tagging system for skills

- **Enhanced Gamification**
  - Community leaderboards
  - Weekly challenges
  - Badge sharing

- **Mobile Optimization**
  - PWA implementation
  - Touch-friendly interactions
  - Offline functionality

### 💡 Low Priority (Nice-to-Have)
- **API Development**
  - RESTful API for third-party apps
  - Webhooks for integrations
  - Rate limiting and security

- **Advanced Features**
  - Learning analytics dashboard
  - Skill dependency validation
  - Export to portfolio/LinkedIn

## 🐛 Reporting Bugs

Found a bug? Please create an issue with:

1. **Clear Title**: Brief description of the issue
2. **Detailed Description**: What happened vs what you expected
3. **Steps to Reproduce**: Step-by-step instructions
4. **Environment**: Browser, OS, device
5. **Screenshots**: If applicable
6. **Console Errors**: Any error messages

Example:
```
Title: Skill completion doesn't persist after page refresh

Description:
When I mark a skill as completed and refresh the page, it reverts to incomplete.

Steps:
1. Open a skill tree
2. Click a skill node to complete it
3. Refresh the page (F5)
4. Skill is no longer completed

Browser: Chrome 98.0.4758.102
OS: Windows 10
```

## 💡 Suggesting Features

Have an idea? We'd love to hear it! When suggesting features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're solving
3. **Explain your proposed solution**
4. **Consider alternatives** you've thought about
5. **Mention any tradeoffs** or challenges

## 🧪 Testing Guidelines

### Manual Testing Checklist
Before submitting any changes, ensure:

1. **Core Features Still Work**
   - Skill completion toggling
   - XP and level progression
   - Achievement unlocking
   - LocalStorage persistence

2. **Cross-Browser Compatibility**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

3. **Responsive Design**
   - Desktop (1200px+)
   - Tablet (768px-1199px)
   - Mobile (<768px)

4. **Performance**
   - No memory leaks
   - Fast loading
   - Smooth animations

### Automated Testing (Future)
We plan to add:
- Unit tests with Jest
- Integration tests with Cypress
- Performance benchmarks

## 📚 Learning Resources

New to open source or web development? Here are some helpful resources:

- [GitHub's Open Source Guide](https://opensource.guide/)
- [First Contributions Tutorial](https://github.com/firstcontributions/first-contributions)
- [MDN Web Docs](https://developer.mozilla.org/) for HTML/CSS/JS reference
- [JavaScript.info](https://javascript.info/) for modern JS concepts

## 👥 Community Channels

- **GitHub Discussions**: For questions and ideas
- **Discord/Slack**: Coming soon!
- **Monthly Community Calls**: Virtual meetups to discuss progress

## 🏆 Recognition

We value all contributions! Contributors will be recognized by:

- **Contributor Hall of Fame** in README
- **Special badges** in GitHub profile
- **Shoutouts** in release notes
- **Opportunities** for mentorship roles

## ❓ Questions?

Don't hesitate to ask! You can:

1. Open a GitHub Discussion
2. Comment on the relevant issue
3. Email the maintainers (see README for contact)

---

**Thank you for contributing to Skill Quest! Together, we're building a better way to learn and grow.** 🌱

<div align="center">
  <sub>Made with ❤️ by Iván R. Artiles</sub>
</div>