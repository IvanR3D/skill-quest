// ===== APP STATE WITH XP & LEVELS =====
const app = {
  currentPage: "dashboard",
  skillTrees: [],
  currentTree: null,
  profile: {
    name: "User Name",
    bio: "Learning enthusiast",
    defaultColor: "#6366F1",
    notifications: "enabled",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  },
  stats: {
    totalTrees: 0,
    completedTrees: 0,
    totalSkills: 0,
    completedSkills: 0,
    currentStreak: 0,
    totalPoints: 0,
  },
  activity: [],
  achievements: [
    {
      id: "first_skill",
      name: "First Steps",
      desc: "Complete your first skill",
      unlocked: false,
    },
    {
      id: "10_skills",
      name: "Skill Seeker",
      desc: "Complete 10 skills",
      unlocked: false,
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      desc: "Maintain a 7 day streak",
      unlocked: false,
    },
    {
      id: "tree_master",
      name: "Tree Master",
      desc: "Complete an entire skill tree",
      unlocked: false,
    },
  ],
};

// ===== DOM ELEMENTS =====
const elements = {
  sidebar: document.getElementById("sidebar"),
  menuToggle: document.getElementById("menuToggle"),
  navLinks: document.querySelectorAll(".nav-link"),
  pages: document.querySelectorAll(".page"),
  addTreeBtn: document.getElementById("addTreeBtn"),
  addTreeModal: document.getElementById("addTreeModal"),
  closeAddModal: document.getElementById("closeAddModal"),
  addTreeForm: document.getElementById("addTreeForm"),
  editProfileBtn: document.getElementById("editProfileBtn"),
  editProfileModal: document.getElementById("editProfileModal"),
  closeEditModal: document.getElementById("closeEditModal"),
  editProfileForm: document.getElementById("editProfileForm"),
  toast: document.getElementById("toast"),
  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  skillTreeGrid: document.getElementById("skillTreeGrid"),
  viewerContent: document.getElementById("viewerContent"),
  colorPicker: document.getElementById("colorPicker"),
  randomColorCheckbox: document.getElementById("randomColorCheckbox"),
  soundEffectsCheckbox: document.getElementById("soundEffectsCheckbox"),
  resetBtn: document.getElementById("resetBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importData: document.getElementById("importData"),
  xpBar: document.getElementById("xpBar"),
  levelBadge: document.getElementById("levelBadge"),
  achievementPopup: document.getElementById("achievementPopup"),
  achievementIcon: document.getElementById("achievementIcon"),
  achievementTitle: document.getElementById("achievementTitle"),
  achievementDesc: document.getElementById("achievementDesc"),
};

// ===== INITIALIZE APP =====
function init() {
  loadFromLocalStorage();
  setupEventListeners();
  updateDashboard();
  renderSkillTrees();
  updateProfile();
  updateLevel();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Mobile menu toggle
  elements.menuToggle.addEventListener("click", () => {
    elements.sidebar.classList.toggle("active");
  });

  // Navigation
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      navigateToPage(page);
    });
  });

  // Add Skill Tree Modal
  elements.addTreeBtn.addEventListener("click", () => {
    elements.addTreeModal.classList.add("active");
  });

  elements.closeAddModal.addEventListener("click", () => {
    elements.addTreeModal.classList.remove("active");
  });

  elements.addTreeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addSkillTree();
  });

  // Edit Profile Modal
  elements.editProfileBtn.addEventListener("click", () => {
    document.getElementById("editName").value = app.profile.name;
    document.getElementById("editBio").value = app.profile.bio;
    elements.editProfileModal.classList.add("active");
  });

  elements.closeEditModal.addEventListener("click", () => {
    elements.editProfileModal.classList.remove("active");
  });

  elements.editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateProfileInfo();
  });

  // Search and Filter
  elements.searchInput.addEventListener("input", filterSkillTrees);
  elements.categoryFilter.addEventListener("change", filterSkillTrees);

  // Viewer Controls
  elements.resetBtn.addEventListener("click", resetCurrentTree);

  // Profile Settings
  document.getElementById("defaultColor").addEventListener("change", (e) => {
    app.profile.defaultColor = e.target.value;
    elements.colorPicker.value = e.target.value;
    saveToLocalStorage();
  });

  document.getElementById("notifications").addEventListener("change", (e) => {
    app.profile.notifications = e.target.value;
    saveToLocalStorage();
  });

  elements.exportBtn.addEventListener("click", exportData);
  elements.importData.addEventListener("change", importData);
  document
    .getElementById("clearDataBtn")
    .addEventListener("click", clearAllData);

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === elements.addTreeModal) {
      elements.addTreeModal.classList.remove("active");
    }
    if (e.target === elements.editProfileModal) {
      elements.editProfileModal.classList.remove("active");
    }
  });
}

// ===== NAVIGATION =====
function navigateToPage(page) {
  elements.navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === page) {
      link.classList.add("active");
    }
  });

  elements.pages.forEach((p) => {
    p.classList.remove("active");
  });
  document.getElementById(page).classList.add("active");

  app.currentPage = page;
  elements.sidebar.classList.remove("active");

  if (page === "dashboard") updateDashboard();
  if (page === "library") renderSkillTrees();
}

// ===== XP & LEVEL SYSTEM =====
function updateLevel() {
  const xpPercent = (app.profile.xp / app.profile.xpToNextLevel) * 100;
  elements.xpBar.style.width = `${Math.min(xpPercent, 100)}%`;
  elements.levelBadge.textContent = `LVL ${app.profile.level}`;
}

function gainXP(amount) {
  app.profile.xp += amount;

  // Check for level up
  while (app.profile.xp >= app.profile.xpToNextLevel) {
    app.profile.xp -= app.profile.xpToNextLevel;
    app.profile.level++;
    app.profile.xpToNextLevel = Math.floor(app.profile.xpToNextLevel * 1.5);
    showAchievement(
      "Level Up!",
      `You are now level ${app.profile.level}!`,
      "🎉"
    );
    spawnConfetti();
  }

  updateLevel();
  saveToLocalStorage();
}

// ===== BADGE & ACHIEVEMENT SYSTEM =====
function checkAchievements() {
  const newAchievements = [];

  // First skill completed
  if (
    !app.achievements.find((a) => a.id === "first_skill").unlocked &&
    app.stats.completedSkills >= 1
  ) {
    unlockAchievement("first_skill");
  }

  // 10 skills completed
  if (
    !app.achievements.find((a) => a.id === "10_skills").unlocked &&
    app.stats.completedSkills >= 10
  ) {
    unlockAchievement("10_skills");
  }

  // 7 day streak
  if (
    !app.achievements.find((a) => a.id === "streak_7").unlocked &&
    app.stats.currentStreak >= 7
  ) {
    unlockAchievement("streak_7");
  }

  // Complete a tree
  if (
    !app.achievements.find((a) => a.id === "tree_master").unlocked &&
    app.stats.completedTrees >= 1
  ) {
    unlockAchievement("tree_master");
  }
}

function unlockAchievement(id) {
  const achievement = app.achievements.find((a) => a.id === id);
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    showAchievement(achievement.name, achievement.desc, "🏆");
    gainXP(50); // Bonus XP for achievements
  }
}

function showAchievement(title, desc, icon) {
  elements.achievementIcon.textContent = icon;
  elements.achievementTitle.textContent = title;
  elements.achievementDesc.textContent = desc;
  elements.achievementPopup.classList.add("show");

  setTimeout(() => {
    elements.achievementPopup.classList.remove("show");
  }, 4000);
}

// ===== VISUAL EFFECTS =====
function spawnParticle(x, y, color) {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particle.style.background = color;
  particle.style.setProperty("--x", (Math.random() - 0.5) * 200);
  particle.style.setProperty("--y", -Math.random() * 100 - 50);
  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 1000);
}

function spawnConfetti() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }, i * 50);
  }
}

// ===== DASHBOARD FUNCTIONS =====
function updateDashboard() {
  calculateStats();

  // Update DOM with animation
  animateCounter(document.getElementById("totalTrees"), app.stats.totalTrees);
  animateCounter(
    document.getElementById("completedSkills"),
    app.stats.completedSkills
  );
  animateCounter(
    document.getElementById("currentStreak"),
    app.stats.currentStreak
  );
  animateCounter(document.getElementById("totalPoints"), app.stats.totalPoints);

  // Progress bars
  document.getElementById("treesProgress").style.width = `${
    (app.stats.completedTrees / Math.max(app.stats.totalTrees, 1)) * 100
  }%`;
  document.getElementById("skillsProgress").style.width = `${
    (app.stats.completedSkills / Math.max(app.stats.totalSkills, 1)) * 100
  }%`;
  document.getElementById("streakProgress").style.width = `${Math.min(
    (app.stats.currentStreak / 30) * 100,
    100
  )}%`;
  document.getElementById("pointsProgress").style.width = `${Math.min(
    (app.stats.totalPoints / 1000) * 100,
    100
  )}`;

  renderActivity();
  checkAchievements();

  // Update badges
  renderBadges();
}

function animateCounter(element, targetValue) {
  const startValue = parseInt(element.textContent) || 0;
  const duration = 500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(
      startValue + (targetValue - startValue) * progress
    );

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function calculateStats() {
  app.stats.totalTrees = app.skillTrees.length;
  app.stats.completedTrees = 0;
  app.stats.totalSkills = 0;
  app.stats.completedSkills = 0;
  app.stats.totalPoints = 0;

  app.skillTrees.forEach((tree) => {
    if (tree.completed) {
      app.stats.completedTrees++;
    }

    if (tree.skills) {
      app.stats.totalSkills += tree.skills.length;
      app.stats.completedSkills += tree.skills.filter(
        (skill) => skill.completed
      ).length;
      app.stats.totalPoints += tree.score || 0;
    }
  });

  // Calculate streak based on activity dates
  if (app.activity.length > 0) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was activity today or yesterday
    const recentActivity = app.activity.find((item) => {
      const activityDate = new Date(item.date);
      return (
        activityDate.toDateString() === today.toDateString() ||
        activityDate.toDateString() === yesterday.toDateString()
      );
    });

    if (recentActivity) {
      // Calculate consecutive days with activity
      app.stats.currentStreak = calculateConsecutiveDays();
    } else {
      app.stats.currentStreak = 0;
    }
  }
  app.stats.totalPoints =
    app.stats.completedSkills * 10 + app.stats.completedTrees * 50;

  // Update profile stats
  app.profile.xp = app.stats.totalPoints;
}

function calculateConsecutiveDays() {
  if (app.activity.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create a set of dates with activity
  const activityDates = new Set();
  app.activity.forEach((item) => {
    const date = new Date(item.date);
    date.setHours(0, 0, 0, 0);
    activityDates.add(date.toDateString());
  });

  // Check consecutive days backwards from today
  let currentDate = new Date(today);
  while (activityDates.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

function renderActivity() {
  const activityList = document.getElementById("activityList");

  if (app.activity.length === 0) {
    activityList.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">No recent activity. Complete some skills to get started!</p>';
    return;
  }

  activityList.innerHTML = app.activity
    .slice(0, 5)
    .map(
      (item) => `
      <div class="activity-item">
        <div class="activity-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="activity-content">
          <p>${item.description}</p>
          <span class="activity-date">${formatDate(item.date)}</span>
        </div>
      </div>
    `
    )
    .join("");
}

function renderBadges() {
  const container = document.getElementById("badgesContainer");
  const unlockedBadges = app.achievements.filter((a) => a.unlocked);

  if (unlockedBadges.length === 0) {
    container.innerHTML =
      '<p style="color: var(--text-secondary);">Complete skills to earn badges!</p>';
    return;
  }

  container.innerHTML = unlockedBadges
    .map(
      (achievement) =>
        `<span class="badge badge-legendary">${achievement.name}</span>`
    )
    .join("");
}

function formatDate(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return "Today";
  } else if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }
}

// ===== SKILL TREE FUNCTIONS =====
function renderSkillTrees() {
  const filteredTrees = getFilteredSkillTrees();

  if (filteredTrees.length === 0) {
    elements.skillTreeGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🌳</div>
          <h3 style="margin-bottom: 1rem;">Your forest is empty!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">Add your first skill tree to begin your adventure.</p>
          <button class="btn btn-primary" onclick="document.getElementById('addTreeBtn').click()">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Skill Tree
          </button>
        </div>
      `;
    return;
  }

  elements.skillTreeGrid.innerHTML = filteredTrees
    .map((tree) => {
      const progress = calculateTreeProgress(tree);
      const rarity =
        progress === 100
          ? "legendary"
          : progress > 50
          ? "epic"
          : progress > 0
          ? "rare"
          : "common";

      return `
        <div class="skill-tree-card" data-id="${tree.id}">
          <div class="skill-tree-info">
            <h3 class="skill-tree-title">${tree.name}</h3>
            <span class="skill-tree-category">${tree.category}</span>
            <span class="badge badge-${rarity}">${rarity.toUpperCase()}</span>
            <p>${tree.description || "No description available"}</p>
            <div class="skill-tree-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <span style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem; display: block;">
                ${Math.round(progress)}% Complete • ${tree.score || 0} XP
              </span>
            </div>
            <div class="skill-tree-actions">
              <button class="btn btn-primary view-tree-btn" data-id="${
                tree.id
              }">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                View
              </button>
              <button class="btn btn-danger delete-tree-btn" data-id="${
                tree.id
              }">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // Add event listeners
  document.querySelectorAll(".view-tree-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const treeId = e.target
        .closest(".skill-tree-card")
        .getAttribute("data-id");
      viewSkillTree(treeId);
    });
  });

  document.querySelectorAll(".delete-tree-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const treeId = e.target
        .closest(".skill-tree-card")
        .getAttribute("data-id");
      deleteSkillTree(treeId);
    });
  });
}

function viewSkillTree(treeId) {
  const tree = app.skillTrees.find((t) => t.id === treeId);
  if (!tree) return;

  app.currentTree = tree;
  navigateToPage("viewer");

  elements.colorPicker.value = app.profile.defaultColor;
  renderSkillTree(tree);
}

function renderSkillTree(tree) {
  elements.viewerContent.innerHTML = tree.svg;
  const svg = elements.viewerContent.querySelector("svg");
  if (!svg) return;

  const skillElements = svg.querySelectorAll(".cls-12");

  skillElements.forEach((element, index) => {
    // Add game-like attributes
    element.style.pointerEvents = "all";
    element.style.cursor = "pointer";
    element.style.transition = "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    element.classList.add("skill-node");

    const skill = tree.skills[index];
    if (!skill) return;

    // Set initial state
    if (skill.completed) {
      element.style.fill = skill.color || app.profile.defaultColor;
      element.style.filter = "drop-shadow(0 0 8px currentColor)";
      element.classList.add("completed");
    } else {
      element.style.fill = "#FFF";
      element.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
    }

    // Add click handler
    element.addEventListener("click", (e) => {
      toggleSkillCompletion(skill, element, e);
    });
  });

  updateScoreDisplay(tree);
}

function toggleSkillCompletion(skill, element, event) {
  skill.completed = !skill.completed;

  if (skill.completed) {
    let color;
    if (elements.randomColorCheckbox.checked) {
      color = getRandomColor();
      skill.color = color;
    } else {
      color = elements.colorPicker.value;
      skill.color = color;
    }

    element.style.fill = color;
    element.style.filter = "drop-shadow(0 0 12px currentColor)";
    element.classList.add("completed");

    app.currentTree.score = (app.currentTree.score || 0) + 10;
    updateScoreDisplay(app.currentTree);

    addActivity(
      `Completed skill: ${skill.name} in ${app.currentTree.name} +10 XP`
    );
    gainXP(10);

    if (elements.soundEffectsCheckbox.checked) {
      //todo: add sound effect
      //showToast(`🔊 Sound Effect: Skill Completed!`);
    }

    // Spawn particle effect
    const rect = element.getBoundingClientRect();
    spawnParticle(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      color
    );
  } else {
    element.style.fill = "#FFF";
    element.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
    element.classList.remove("completed");
    skill.color = null;

    app.currentTree.score = Math.max(0, (app.currentTree.score || 0) - 10);
    updateScoreDisplay(app.currentTree);

    addActivity(
      `Uncompleted skill: ${skill.name} in ${app.currentTree.name} -10 XP`
    );
    gainXP(-5);
  }

  checkTreeCompletion();
  updateDashboard();
}

function getRandomColor() {
  const colors = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#EAB308",
    "#84CC16",
    "#10B981",
    "#14B8A6",
    "#06B6D4",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function checkTreeCompletion() {
  if (!app.currentTree || !app.currentTree.skills) return;

  const allCompleted = app.currentTree.skills.every((skill) => skill.completed);
  const wasCompleted = app.currentTree.completed;

  app.currentTree.completed = allCompleted;

  if (allCompleted && !wasCompleted) {
    showAchievement(
      "Tree Master!",
      `You completed ${app.currentTree.name}!`,
      "🌳"
    );
    gainXP(50);
    spawnConfetti();
  }
}

function resetCurrentTree() {
  if (!app.currentTree) return;

  app.currentTree.skills.forEach((skill) => {
    skill.completed = false;
    skill.color = null;
  });

  app.currentTree.completed = false;
  app.currentTree.score = 0;

  renderSkillTree(app.currentTree);
  updateDashboard();
  showToast("Progress reset", "warning");
}

function deleteSkillTree(treeId) {
  if (!confirm("Are you sure you want to delete this skill tree?")) return;

  const treeIndex = app.skillTrees.findIndex((t) => t.id === treeId);
  if (treeIndex === -1) return;

  const treeName = app.skillTrees[treeIndex].name;
  app.skillTrees.splice(treeIndex, 1);

  saveToLocalStorage();
  renderSkillTrees();
  updateDashboard();

  showToast("Skill tree deleted");
  addActivity(`Deleted skill tree: ${treeName}`);
}

// ===== DATA MANAGEMENT =====
function clearAllData() {
  if (!confirm("⚠️ WARNING: This will delete ALL your progress. Are you sure?"))
    return;

  localStorage.removeItem("skillTreeData");
  location.reload();
}

function getFilteredSkillTrees() {
  let filtered = [...app.skillTrees];

  // Filter by search term
  const searchTerm = elements.searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(
      (tree) =>
        tree.name.toLowerCase().includes(searchTerm) ||
        (tree.description &&
          tree.description.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by category
  const category = elements.categoryFilter.value;
  if (category !== "all") {
    filtered = filtered.filter((tree) => tree.category === category);
  }

  return filtered;
}

function filterSkillTrees() {
  renderSkillTrees();
}

function calculateTreeProgress(tree) {
  if (!tree.skills || tree.skills.length === 0) return 0;

  const completedSkills = tree.skills.filter((skill) => skill.completed).length;
  return (completedSkills / tree.skills.length) * 100;
}

function addSkillTree() {
  const name = document.getElementById("treeName").value;
  const category = document.getElementById("treeCategory").value;
  const description = document.getElementById("treeDescription").value;
  const fileInput = document.getElementById("treeFile");

  if (!fileInput.files.length) {
    showToast("Please select an SVG file");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const svgContent = e.target.result;
    const skills = extractSkillsFromSVG(svgContent);

    const newTree = {
      id: Date.now().toString(),
      name,
      category,
      description,
      svg: svgContent,
      skills,
      completed: false,
      score: 0,
      createdAt: new Date().toISOString(),
    };

    app.skillTrees.push(newTree);
    saveToLocalStorage();

    // Add activity
    addActivity(`Added new skill tree: ${name}`);

    // Reset form and close modal
    elements.addTreeForm.reset();
    elements.addTreeModal.classList.remove("active");

    // Update UI
    renderSkillTrees();
    showToast("Skill tree added successfully!");
  };

  reader.readAsText(file);
}

function extractSkillsFromSVG(svgContent) {
  // Create a temporary DOM element to parse the SVG
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = svgContent;

  // Find all elements with class .cls-12
  const skillElements = tempDiv.querySelectorAll(".cls-12");

  // Convert to skill objects
  const skills = Array.from(skillElements).map((element, index) => {
    // Generate a unique ID for each skill
    const id = `skill-${index}`;

    // Try to extract a name from the element
    let name = id;
    if (element.id) {
      name = element.id;
    } else if (element.getAttribute("data-name")) {
      name = element.getAttribute("data-name");
    }

    return {
      id,
      name,
      completed: false,
      element: element.outerHTML,
      color: null, // Store custom color for each skill
    };
  });

  return skills;
}

function updateScoreDisplay(tree) {
  const svg = elements.viewerContent.querySelector("svg");
  if (!svg) return;

  // Find the score element
  const scoreElement = svg.querySelector("#score text.cls-23");
  if (scoreElement) {
    scoreElement.textContent = `Total Score: ${tree.score || 0}`;
  }
}

// Profile Functions
function updateProfile() {
  document.getElementById("profileName").textContent = app.profile.name;
  document.getElementById("profileBio").textContent = app.profile.bio;
  document.getElementById("defaultColor").value = app.profile.defaultColor;
  document.getElementById("notifications").value = app.profile.notifications;

  // Update profile stats
  document.getElementById("profileTotalTrees").textContent =
    app.stats.totalTrees;
  document.getElementById("profileCompletedTrees").textContent =
    app.stats.completedTrees;
  document.getElementById("profileTotalSkills").textContent =
    app.stats.totalSkills;
  document.getElementById("profileCompletedSkills").textContent =
    app.stats.completedSkills;
  document.getElementById("profileTotalPoints").textContent =
    app.stats.totalPoints;
}

function updateProfileInfo() {
  app.profile.name = document.getElementById("editName").value;
  app.profile.bio = document.getElementById("editBio").value;

  saveToLocalStorage();
  updateProfile();

  elements.editProfileModal.classList.remove("active");
  showToast("Profile updated!");
}

// Load and save functions remain unchanged
function saveToLocalStorage() {
  const data = {
    skillTrees: app.skillTrees,
    profile: app.profile,
    activity: app.activity,
    achievements: app.achievements,
  };
  localStorage.setItem("skillTreeData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("skillTreeData");
  if (!data) return;

  try {
    const parsedData = JSON.parse(data);
    app.skillTrees = parsedData.skillTrees || [];
    app.profile = { ...app.profile, ...parsedData.profile };
    app.activity = parsedData.activity || [];
    app.achievements = parsedData.achievements || app.achievements;
  } catch (e) {
    console.error("Error loading data:", e);
  }
}

function exportData() {
  const data = {
    skillTrees: app.skillTrees,
    profile: app.profile,
    activity: app.activity,
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `skill-tree-data-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showToast("Data exported successfully!");
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);

      // Merge with existing data
      if (data.skillTrees) {
        // Add new trees that don't already exist
        data.skillTrees.forEach((tree) => {
          if (!app.skillTrees.find((t) => t.id === tree.id)) {
            app.skillTrees.push(tree);
          }
        });
      }

      if (data.profile) {
        app.profile = { ...app.profile, ...data.profile };
      }

      if (data.activity) {
        app.activity = [...app.activity, ...data.activity];
      }

      saveToLocalStorage();
      updateDashboard();
      renderSkillTrees();
      updateProfile();

      showToast("Data imported successfully!");
    } catch (error) {
      showToast("Error importing data. Please check the file format.");
      console.error("Import error:", error);
    }
  };

  reader.readAsText(file);
  e.target.value = ""; // Reset the input
}

// Activity Functions
function addActivity(description) {
  app.activity.unshift({
    description,
    date: new Date().toISOString(),
  });

  // Keep only the last 50 activities
  if (app.activity.length > 50) {
    app.activity = app.activity.slice(0, 50);
  }

  saveToLocalStorage();
}

// Toast Notification
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", init);