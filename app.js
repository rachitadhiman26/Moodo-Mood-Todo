// Enhanced Productivity Hub Application
class ProductivityApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.taskCounter = 0;
        this.currentView = 'dashboard';
        this.isDarkMode = true; // Default to dark mode
        this.focusableElements = [];
        this.lastFocusedElement = null;
        
        // Progress tracking
        this.settings = {
            dailyTaskGoal: 10,
            weeklyTaskGoal: 50,
            dailyFocusGoal: 480 // minutes
        };
        
        // Enhanced mood tracking with entries
        this.moodEntries = [];
        this.dailyMood = {
            mood: null,
            energy: 5,
            contextTags: [],
            notes: '',
            date: new Date().toDateString()
        };
        
        // Mood configuration
        this.moodConfig = {
            1: { label: 'Very Sad', emoji: '😢', color: '#d46a6a' },
            2: { label: 'Okay', emoji: '😐', color: '#d89a5a' },
            3: { label: 'Good', emoji: '😊', color: '#d4c65a' },
            4: { label: 'Great', emoji: '😄', color: '#6aaa64' },
            5: { label: 'Excellent', emoji: '😍', color: '#5a9fd4' }
        };
        
        // Time tracking
        this.activeTimers = new Map();
        this.timeTracking = {
            todayFocus: 0, // minutes
            todayCompleted: 0,
            weeklyCompleted: 0,
            streak: 0,
            moodStreak: 0 // consecutive days of mood logging
        };
        
        // Calendar
        this.currentCalendarDate = new Date();
        this.selectedDate = new Date();
        
        this.init();
    }
    
    init() {
        console.log('Initializing ProductivityApp...');
        try {
            this.initTheme();
            this.loadData();
            this.bindEvents();
            this.updateDateTime();
            this.render();
            this.updateProgressRings();
            this.renderCalendar();
            this.setupKeyboardNavigation();
            this.renderMoodSection();
            this.updateMoodAnalytics();
            
            // Update every minute for timers
            setInterval(() => this.updateTimers(), 1000);
            setInterval(() => this.updateDateTime(), 60000);
            
            this.announceToScreenReader('Productivity app loaded successfully');
            console.log('ProductivityApp initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    // Event Binding
    bindEvents() {
        console.log('Binding events...');
        try {
            // Basic task events
            const taskInput = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const taskForm = document.querySelector('.task-input-form');
            const filterButtons = document.querySelectorAll('.filter-btn');
            const taskList = document.getElementById('taskList');
            
            if (taskForm) {
                taskForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleAddTask();
                });
                console.log('Form submit listener attached');
            }
            
            if (addBtn) {
                addBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleAddTask();
                });
                console.log('Add button listener attached');
            }
            
            if (taskInput) {
                taskInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.handleAddTask();
                    }
                });
                console.log('Task input listener attached');
            }
            
            filterButtons.forEach((btn, index) => {
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        this.setFilter(e.target.dataset.filter);
                    });
                    
                    // Keyboard navigation for tabs
                    btn.addEventListener('keydown', (e) => {
                        this.handleTabKeydown(e, index, filterButtons);
                    });
                }
            });
            console.log(`Filter buttons listeners attached (${filterButtons.length})`);
            
            if (taskList) {
                taskList.addEventListener('click', (e) => this.handleTaskClick(e));
                // Keyboard support for task list
                taskList.addEventListener('keydown', (e) => this.handleTaskListKeydown(e));
                console.log('Task list listeners attached');
            }
            
            // Theme and view toggle
            const themeToggle = document.getElementById('themeToggle');
            const viewToggle = document.getElementById('viewToggle');
            
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
                themeToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleTheme();
                    }
                });
                console.log('Theme toggle listeners attached');
            }
            
            if (viewToggle) {
                viewToggle.addEventListener('click', () => this.toggleView());
                viewToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleView();
                    }
                });
                console.log('View toggle listeners attached');
            }
            
            // Enhanced mood tracking events
            this.bindMoodEvents();
            this.bindMoodSubmitEvents();
            
            // Calendar events
            this.bindCalendarEvents();
            
            // Modal events
            this.bindModalEvents();
            
            console.log('All event listeners bound successfully');
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }
    
    bindMoodEvents() {
        console.log('Binding enhanced mood events...');
        
        // Enhanced mood selection with data attributes
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach((btn, index) => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    const button = e.currentTarget;
                    const mood = parseInt(button.dataset.mood);
                    const label = button.dataset.label;
                    const emoji = button.dataset.emoji;
                    const color = button.dataset.color;
                    
                    this.setMoodEnhanced(mood, label, emoji, color);
                });
                
                // Enhanced keyboard navigation
                btn.addEventListener('keydown', (e) => {
                    this.handleRadioKeydown(e, index, moodButtons);
                });
            }
        });
        
        // Energy slider with enhanced feedback
        const energySlider = document.getElementById('energySlider');
        if (energySlider) {
            energySlider.addEventListener('input', (e) => {
                this.setEnergyEnhanced(parseInt(e.target.value));
            });
            
            energySlider.addEventListener('change', (e) => {
                this.announceToScreenReader(`Energy level set to ${e.target.value} out of 10`);
            });
        }
        
        // Enhanced context tags
        const tagButtons = document.querySelectorAll('.tag-btn');
        tagButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    const context = e.currentTarget.dataset.context;
                    this.toggleContextEnhanced(context);
                });
                
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const context = e.currentTarget.dataset.context;
                        this.toggleContextEnhanced(context);
                    }
                });
            }
        });
        
        // Enhanced daily notes
        const dailyNotes = document.getElementById('dailyNotes');
        if (dailyNotes) {
            dailyNotes.addEventListener('input', (e) => {
                this.dailyMood.notes = e.target.value;
            });
        }
        
        console.log('Enhanced mood events bound successfully');
    }
    
    bindMoodSubmitEvents() {
        // Log mood button
        const logMoodBtn = document.getElementById('logMoodBtn');
        if (logMoodBtn) {
            logMoodBtn.addEventListener('click', () => {
                this.logMoodEntry();
            });
        }
        
        // Edit today's mood button
        const editTodayBtn = document.getElementById('editTodayMoodBtn');
        if (editTodayBtn) {
            editTodayBtn.addEventListener('click', () => {
                this.editTodaysMood();
            });
        }
    }
    
    bindCalendarEvents() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        prevBtn.addEventListener('click', () => {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
            this.renderCalendar();
        });
    }
    
    bindModalEvents() {
        const modal = document.getElementById('editModal');
        const saveBtn = document.getElementById('saveEditBtn');
        const cancelBtn = document.getElementById('cancelEditBtn');
        const editInput = document.getElementById('editInput');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEdit());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
        
        if (editInput) {
            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveEdit();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.cancelEdit();
                }
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cancelEdit();
                }
            });
            
            // Trap focus in modal
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.trapModalFocus(e, modal);
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.cancelEdit();
                }
            });
        }
    }
    
    // UI Controls
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transitioning');
        
        // Update theme attribute
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        
        // Update theme toggle ARIA state
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.isDarkMode.toString());
            const screenReaderText = themeToggle.querySelector('.sr-only');
            if (screenReaderText) {
                screenReaderText.textContent = this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
            }
        }
        
        // Update theme icon with animation
        this.updateThemeIcon();
        
        // Announce theme change
        this.announceToScreenReader(`Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        this.saveData();
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        const newIcon = this.isDarkMode ? '☀️' : '🌙';
        
        // Add rotation animation during icon change
        themeIcon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            themeIcon.textContent = newIcon;
            themeIcon.style.transform = 'rotate(0deg)';
        }, 150);
    }
    
    toggleView() {
        this.currentView = this.currentView === 'dashboard' ? 'calendar' : 'dashboard';
        
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        
        document.getElementById(this.currentView + 'View').classList.add('active');
        
        const viewIcon = document.querySelector('.view-icon');
        viewIcon.textContent = this.currentView === 'dashboard' ? '📅' : '📊';
        
        if (this.currentView === 'calendar') {
            this.renderCalendar();
        }
    }
    
    // Enhanced Mood and Energy Tracking
    setMoodEnhanced(mood, label, emoji, color) {
        this.dailyMood.mood = mood;
        this.dailyMood.moodLabel = label;
        this.dailyMood.moodEmoji = emoji;
        this.dailyMood.moodColor = color;
        
        // Update UI and ARIA states
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.setAttribute('aria-checked', 'false');
        });
        
        const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
            selectedBtn.setAttribute('aria-checked', 'true');
            
            // Add celebration animation
            selectedBtn.style.animation = 'none';
            setTimeout(() => {
                selectedBtn.style.animation = 'moodSelected 0.4s ease-out';
            }, 10);
        }
        
        // Announce mood change
        this.announceToScreenReader(`Mood set to ${label}`);
    }
    
    setEnergyEnhanced(energy) {
        this.dailyMood.energy = energy;
        const energyValue = document.getElementById('energyValue');
        if (energyValue) {
            energyValue.textContent = energy;
            
            // Visual feedback based on energy level
            energyValue.style.color = this.getEnergyColor(energy);
        }
    }
    
    getEnergyColor(energy) {
        if (energy <= 3) return '#d46a6a'; // Low energy - red
        if (energy <= 6) return '#d89a5a'; // Medium energy - orange
        return '#6aaa64'; // High energy - green
    }
    
    toggleContextEnhanced(context) {
        const index = this.dailyMood.contextTags.indexOf(context);
        const btn = document.querySelector(`[data-context="${context}"]`);
        
        if (btn) {
            if (index === -1) {
                this.dailyMood.contextTags.push(context);
                btn.classList.add('selected');
                btn.setAttribute('aria-pressed', 'true');
                
                // Add selection animation
                btn.style.animation = 'celebrationBounce 0.3s ease-out';
                setTimeout(() => {
                    btn.style.animation = '';
                }, 300);
                
                this.announceToScreenReader(`${context} focus tag selected`);
            } else {
                this.dailyMood.contextTags.splice(index, 1);
                btn.classList.remove('selected');
                btn.setAttribute('aria-pressed', 'false');
                this.announceToScreenReader(`${context} focus tag deselected`);
            }
        }
    }
    
    // Mood Entry Management
    logMoodEntry() {
        // Validate mood entry
        if (!this.dailyMood.mood) {
            this.showMoodError('Please select your mood first!');
            return;
        }
        
        const today = new Date().toDateString();
        const now = new Date();
        
        // Create mood entry
        const moodEntry = {
            id: Date.now(),
            date: today,
            mood: this.dailyMood.mood,
            moodLabel: this.dailyMood.moodLabel,
            moodEmoji: this.dailyMood.moodEmoji,
            moodColor: this.dailyMood.moodColor,
            energy: this.dailyMood.energy,
            contextTags: [...this.dailyMood.contextTags],
            notes: this.dailyMood.notes.trim(),
            timestamp: now.toISOString(),
            timeLogged: now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })
        };
        
        // Check if entry for today already exists
        const existingIndex = this.moodEntries.findIndex(entry => entry.date === today);
        if (existingIndex >= 0) {
            // Update existing entry
            this.moodEntries[existingIndex] = moodEntry;
        } else {
            // Add new entry
            this.moodEntries.unshift(moodEntry);
            this.timeTracking.moodStreak++;
        }
        
        // Keep only last 30 entries
        this.moodEntries = this.moodEntries.slice(0, 30);
        
        this.saveData();
        this.showMoodSuccess();
        this.renderMoodSection();
        this.updateProgressRings();
        this.updateMoodAnalytics();
        
        // Announce success
        this.announceToScreenReader('Mood logged successfully!');
    }
    
    renderMoodSection() {
        const today = new Date().toDateString();
        const todayEntry = this.moodEntries.find(entry => entry.date === today);
        
        if (todayEntry) {
            this.showTodayMoodSummary(todayEntry);
        } else {
            this.showMoodLogger();
        }
        
        this.renderRecentMoods();
    }
    
    showTodayMoodSummary(entry) {
        const loggerContainer = document.getElementById('moodLoggerContainer');
        const summaryContainer = document.getElementById('todayMoodSummary');
        
        if (loggerContainer) loggerContainer.style.display = 'none';
        if (summaryContainer) {
            summaryContainer.style.display = 'block';
            
            // Update summary content
            const emojiEl = document.getElementById('summaryMoodEmoji');
            const labelEl = document.getElementById('summaryMoodLabel');
            const energyEl = document.getElementById('summaryEnergyLevel');
            const timeEl = document.getElementById('summaryTime');
            const tagsEl = document.getElementById('summaryContextTags');
            const notesEl = document.getElementById('summaryNotes');
            
            if (emojiEl) emojiEl.textContent = entry.moodEmoji;
            if (labelEl) labelEl.textContent = entry.moodLabel;
            if (energyEl) energyEl.textContent = `Energy: ${entry.energy}/10`;
            if (timeEl) timeEl.textContent = `Logged at ${entry.timeLogged}`;
            
            // Render context tags
            if (tagsEl) {
                tagsEl.innerHTML = entry.contextTags.map(tag => 
                    `<span class="summary-tag">
                        <span class="tag-emoji">${this.getTagEmoji(tag)}</span>
                        ${tag}
                    </span>`
                ).join('');
            }
            
            // Render notes
            if (notesEl) {
                if (entry.notes) {
                    notesEl.textContent = `"${entry.notes}"`;
                    notesEl.style.display = 'block';
                } else {
                    notesEl.style.display = 'none';
                }
            }
        }
    }
    
    showMoodLogger() {
        const loggerContainer = document.getElementById('moodLoggerContainer');
        const summaryContainer = document.getElementById('todayMoodSummary');
        
        if (loggerContainer) loggerContainer.style.display = 'block';
        if (summaryContainer) summaryContainer.style.display = 'none';
    }
    
    editTodaysMood() {
        this.showMoodLogger();
        this.announceToScreenReader('Edit mode activated. Update your mood and log again.');
    }
    
    renderRecentMoods() {
        const timeline = document.getElementById('recentMoodsTimeline');
        if (!timeline) return;
        
        const recentEntries = this.moodEntries.slice(0, 7); // Last 7 entries
        
        if (recentEntries.length === 0) {
            timeline.innerHTML = '<div class="empty-state"><p>No mood entries yet.</p></div>';
            return;
        }
        
        timeline.innerHTML = recentEntries.map(entry => 
            this.createMoodEntryHTML(entry)
        ).join('');
    }
    
    createMoodEntryHTML(entry) {
        const date = new Date(entry.timestamp);
        const isToday = date.toDateString() === new Date().toDateString();
        const dateLabel = isToday ? 'Today' : date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="mood-entry" data-entry-id="${entry.id}">
                <div class="mood-entry-header">
                    <span class="entry-emoji">${entry.moodEmoji}</span>
                    <div class="entry-info">
                        <h4 class="entry-mood">${entry.moodLabel}</h4>
                        <p class="entry-date">${dateLabel} at ${entry.timeLogged}</p>
                    </div>
                    <div class="entry-energy">⚡ ${entry.energy}/10</div>
                </div>
                ${entry.contextTags.length > 0 ? `
                    <div class="entry-tags">
                        ${entry.contextTags.map(tag => 
                            `<span class="entry-tag">${this.getTagEmoji(tag)} ${tag}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                ${entry.notes ? `
                    <div class="entry-notes">"${entry.notes}"</div>
                ` : ''}
            </div>
        `;
    }
    
    getTagEmoji(tag) {
        const tagEmojis = {
            'Work': '🏢',
            'Personal': '👤', 
            'Health': '❤️',
            'Learning': '📚',
            'Social': '👥',
            'Family': '👨‍👩‍👧'
        };
        return tagEmojis[tag] || '🏷️';
    }
    
    updateMoodAnalytics() {
        if (this.moodEntries.length === 0) return;
        
        // Calculate average mood for the week
        const weekEntries = this.moodEntries.slice(0, 7);
        const avgMood = weekEntries.length > 0 
            ? (weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length).toFixed(1)
            : 0;
        
        // Find most common mood
        const moodCounts = {};
        weekEntries.forEach(entry => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });
        
        const mostCommonMoodValue = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b, '3'
        );
        const mostCommonMood = this.moodConfig[mostCommonMoodValue]?.emoji || '😊';
        
        // Calculate average energy
        const avgEnergy = weekEntries.length > 0 
            ? (weekEntries.reduce((sum, entry) => sum + entry.energy, 0) / weekEntries.length).toFixed(1)
            : 0;
        
        // Update UI
        this.updateElementText('avgMoodWeek', avgMood);
        this.updateElementText('commonMood', mostCommonMood);
        this.updateElementText('moodStreak', this.timeTracking.moodStreak);
        this.updateElementText('avgEnergy', avgEnergy);
    }
    
    updateElementText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }
    
    showMoodError(message) {
        const logMoodBtn = document.getElementById('logMoodBtn');
        if (logMoodBtn) {
            logMoodBtn.style.background = 'var(--color-error)';
            logMoodBtn.textContent = message;
            
            setTimeout(() => {
                logMoodBtn.style.background = '';
                logMoodBtn.innerHTML = '<span class="btn-icon">💭</span><span>Log My Mood</span>';
            }, 2000);
        }
        
        this.announceToScreenReader(message);
    }
    
    showMoodSuccess() {
        const logMoodBtn = document.getElementById('logMoodBtn');
        if (logMoodBtn) {
            logMoodBtn.style.background = 'var(--color-success)';
            logMoodBtn.innerHTML = '<span class="btn-icon">✅</span><span>Mood Logged!</span>';
            logMoodBtn.style.animation = 'celebrationBounce 0.6s ease-out';
            
            setTimeout(() => {
                logMoodBtn.style.background = '';
                logMoodBtn.style.animation = '';
                logMoodBtn.innerHTML = '<span class="btn-icon">💭</span><span>Log My Mood</span>';
            }, 2000);
        }
    }
    
    // Date and Time
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
        
        const hour = now.getHours();
        let greeting = 'Good morning';
        if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
        else if (hour >= 17) greeting = 'Good evening';
        
        document.getElementById('greeting').textContent = `${greeting}! Ready to be productive?`;
    }
    
    // Task Management
    handleAddTask() {
        console.log('Adding task...');
        const taskInput = document.getElementById('taskInput');
        const priority = document.getElementById('taskPriority')?.value || 'Medium';
        const category = document.getElementById('taskCategory')?.value || 'Personal';
        const estimatedTime = document.getElementById('estimatedTime')?.value;
        const text = taskInput?.value.trim() || '';
        
        if (text === '') {
            this.showInputError();
            return;
        }
        
        this.addTask(text, priority, category, parseInt(estimatedTime) || 0);
        
        // Clear form
        if (taskInput) taskInput.value = '';
        const estimatedTimeEl = document.getElementById('estimatedTime');
        if (estimatedTimeEl) estimatedTimeEl.value = '';
        
        // Focus management and announcement
        if (taskInput) taskInput.focus();
        this.announceToScreenReader(`Task "${text}" added successfully`);
        
        console.log('Task added:', text);
    }
    
    addTask(text, priority = 'Medium', category = 'Personal', estimatedMinutes = 0) {
        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            priority: priority,
            category: category,
            estimatedMinutes: estimatedMinutes,
            actualMinutes: 0,
            timerSessions: [],
            createdAt: new Date().toISOString(),
            dueDate: null
        };
        
        this.tasks.unshift(task);
        this.saveData();
        this.render();
        this.updateProgressRings();
        this.updateAnalytics();
    }
    
    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        
        if (task && taskElement) {
            // Stop timer if running
            if (this.activeTimers.has(taskId)) {
                this.stopTimer(taskId);
            }
            
            taskElement.classList.add('removing');
            
            setTimeout(() => {
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.saveData();
                this.render();
                this.updateProgressRings();
                this.updateAnalytics();
                
                // Announce deletion
                this.announceToScreenReader(`Task "${task.text}" deleted`);
            }, 400);
        }
    }
    
    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            // Stop timer if running
            if (this.activeTimers.has(taskId)) {
                this.stopTimer(taskId);
            }
            
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            if (task.completed) {
                this.timeTracking.todayCompleted++;
                this.timeTracking.weeklyCompleted++;
                
                // Show completion animation
                this.showCompletionAnimation(taskId);
                
                // Announce completion
                this.announceToScreenReader(`Task "${task.text}" marked as complete`);
            } else {
                this.timeTracking.todayCompleted = Math.max(0, this.timeTracking.todayCompleted - 1);
                this.timeTracking.weeklyCompleted = Math.max(0, this.timeTracking.weeklyCompleted - 1);
                
                // Announce incompletion
                this.announceToScreenReader(`Task "${task.text}" marked as incomplete`);
            }
            
            this.saveData();
            this.render();
            this.updateProgressRings();
            this.updateAnalytics();
        }
    }
    
    showCompletionAnimation(taskId) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            // Enhanced completion animation with glow effect
            taskElement.style.animation = 'none';
            taskElement.style.filter = 'brightness(1.2)';
            
            setTimeout(() => {
                taskElement.style.animation = 'completionPulse 0.8s ease-out';
                taskElement.style.filter = '';
            }, 10);
        }
    }
    
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            const modal = document.getElementById('editModal');
            const editInput = document.getElementById('editInput');
            const editPriority = document.getElementById('editPriority');
            const editCategory = document.getElementById('editCategory');
            
            // Store the currently focused element
            this.lastFocusedElement = document.activeElement;
            
            if (editInput) editInput.value = task.text;
            if (editPriority) editPriority.value = task.priority;
            if (editCategory) editCategory.value = task.category;
            
            if (modal) {
                modal.style.display = 'flex';
                // Focus management for modal
                setTimeout(() => {
                    if (editInput) {
                        editInput.focus();
                        editInput.select();
                    }
                }, 100);
                
                this.announceToScreenReader('Edit task dialog opened');
            }
        }
    }
    
    saveEdit() {
        const editInput = document.getElementById('editInput');
        const editPriority = document.getElementById('editPriority');
        const editCategory = document.getElementById('editCategory');
        const newText = editInput?.value.trim() || '';
        
        if (newText === '') {
            this.showEditError();
            return;
        }
        
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            const oldText = task.text;
            task.text = newText;
            task.priority = editPriority?.value || task.priority;
            task.category = editCategory?.value || task.category;
            task.editedAt = new Date().toISOString();
            this.saveData();
            this.render();
            
            this.announceToScreenReader(`Task updated from "${oldText}" to "${newText}"`);
        }
        
        this.cancelEdit();
    }
    
    cancelEdit() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        this.editingTaskId = null;
        
        // Restore focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
        
        this.announceToScreenReader('Edit dialog closed');
    }
    
    clearCompleted() {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) return;
        
        completedTasks.forEach(task => {
            const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
            if (taskElement) {
                taskElement.classList.add('removing');
            }
        });
        
        setTimeout(() => {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveData();
            this.render();
            this.updateProgressRings();
            this.updateAnalytics();
        }, 400);
    }
    
    // Time Tracking
    startTimer(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Stop other timers
        this.activeTimers.forEach((timer, id) => {
            if (id !== taskId) {
                this.stopTimer(id);
            }
        });
        
        const startTime = Date.now();
        this.activeTimers.set(taskId, {
            startTime,
            sessionStart: startTime
        });
        
        this.updateTimerDisplay(taskId);
    }
    
    stopTimer(taskId) {
        const timer = this.activeTimers.get(taskId);
        if (!timer) return;
        
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const sessionMinutes = Math.round((Date.now() - timer.sessionStart) / 60000);
        task.actualMinutes += sessionMinutes;
        task.timerSessions.push({
            start: timer.sessionStart,
            end: Date.now(),
            minutes: sessionMinutes
        });
        
        this.timeTracking.todayFocus += sessionMinutes;
        this.activeTimers.delete(taskId);
        
        this.saveData();
        this.updateTimerDisplay(taskId);
        this.updateProgressRings();
        this.updateAnalytics();
    }
    
    toggleTimer(taskId) {
        if (this.activeTimers.has(taskId)) {
            this.stopTimer(taskId);
        } else {
            this.startTimer(taskId);
        }
    }
    
    updateTimers() {
        this.activeTimers.forEach((timer, taskId) => {
            this.updateTimerDisplay(taskId);
        });
    }
    
    updateTimerDisplay(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        const timerElement = document.querySelector(`[data-task-id="${taskId}"] .timer-display`);
        const timerBtn = document.querySelector(`[data-task-id="${taskId}"] .timer-btn`);
        
        if (!timerElement || !timerBtn) return;
        
        const timer = this.activeTimers.get(taskId);
        let displayTime = task.actualMinutes;
        
        if (timer) {
            const currentSession = Math.round((Date.now() - timer.sessionStart) / 60000);
            displayTime += currentSession;
            timerBtn.classList.add('running');
            timerBtn.textContent = '⏸';
        } else {
            timerBtn.classList.remove('running');
            timerBtn.textContent = '▶';
        }
        
        const hours = Math.floor(displayTime / 60);
        const minutes = displayTime % 60;
        timerElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    
    // Event Handlers
    handleTaskClick(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;
        
        const taskId = taskItem.dataset.taskId;
        
        if (e.target.classList.contains('task-checkbox')) {
            this.toggleComplete(taskId);
        } else if (e.target.classList.contains('timer-btn') || e.target.closest('.timer-btn')) {
            this.toggleTimer(taskId);
        } else if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
            this.editTask(taskId);
        } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            this.deleteTask(taskId);
        }
    }
    
    // Filtering
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button and ARIA states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }
        
        this.render();
        
        // Announce filter change
        const filterLabels = {
            all: 'all tasks',
            active: 'active tasks only',
            completed: 'completed tasks only'
        };
        this.announceToScreenReader(`Showing ${filterLabels[filter] || filter}`);
    }
    
    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }
    
    // Rendering
    render() {
        this.renderTasks();
        this.updateCounter();
        this.updateStats();
        this.toggleClearButton();
        this.toggleEmptyState();
    }
    
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();
        
        if (!taskList) {
            console.warn('Task list element not found');
            return;
        }
        
        taskList.innerHTML = '';
        taskList.setAttribute('role', 'list');
        taskList.setAttribute('aria-label', `${filteredTasks.length} ${this.currentFilter} tasks`);
        
        filteredTasks.forEach((task, index) => {
            const taskElement = this.createTaskElement(task);
            taskElement.setAttribute('aria-posinset', index + 1);
            taskElement.setAttribute('aria-setsize', filteredTasks.length);
            taskList.appendChild(taskElement);
        });
        
        // Update timer displays
        setTimeout(() => {
            filteredTasks.forEach(task => {
                this.updateTimerDisplay(task.id);
            });
        }, 50);
        
        console.log(`Rendered ${filteredTasks.length} tasks`);
    }
    
    createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.taskId = task.id;
        taskItem.setAttribute('role', 'listitem');
        
        const priorityClass = task.priority.toLowerCase();
        const estimatedTime = task.estimatedMinutes > 0 ? `~${task.estimatedMinutes}m` : '';
        
        taskItem.innerHTML = `
            <button class="task-checkbox ${task.completed ? 'checked' : ''}" 
                    role="checkbox" 
                    aria-checked="${task.completed}" 
                    aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}"
                    title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}"></button>
            <div class="task-content">
                <div class="task-text" aria-label="Task: ${this.escapeHtml(task.text)}">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-priority ${priorityClass}" aria-label="Priority: ${task.priority}">${task.priority}</span>
                    <span class="task-category" aria-label="Category: ${task.category}">${task.category}</span>
                    ${estimatedTime ? `<span class="estimated-time" aria-label="Estimated time: ${estimatedTime}">${estimatedTime}</span>` : ''}
                </div>
            </div>
            <div class="task-timer">
                <div class="timer-display" aria-label="Time spent">0:00</div>
                <button class="timer-btn" 
                        aria-label="${this.activeTimers.has(task.id) ? 'Stop timer' : 'Start timer'}" 
                        title="Start/Stop timer">▶</button>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn" 
                        aria-label="Edit task: ${this.escapeHtml(task.text)}" 
                        title="Edit task">✎</button>
                <button class="action-btn delete-btn" 
                        aria-label="Delete task: ${this.escapeHtml(task.text)}" 
                        title="Delete task">✕</button>
            </div>
        `;
        
        return taskItem;
    }
    
    // Progress Visualization
    updateProgressRings() {
        // Daily tasks ring
        const dailyCompleted = this.timeTracking.todayCompleted;
        const dailyGoal = this.settings.dailyTaskGoal;
        this.updateProgressRing('tasksRing', 'tasksValue', dailyCompleted, dailyGoal);
        
        // Weekly tasks ring
        const weeklyCompleted = this.timeTracking.weeklyCompleted;
        const weeklyGoal = this.settings.weeklyTaskGoal;
        this.updateProgressRing('weeklyRing', 'weeklyValue', weeklyCompleted, weeklyGoal);
        
        // Mood streak ring
        const moodStreak = this.timeTracking.moodStreak;
        const moodGoal = 7; // 7-day goal
        this.updateProgressRing('moodRing', 'moodValue', moodStreak, moodGoal, 'd');
    }
    
    updateProgressRing(ringId, valueId, current, max, unit = '') {
        const ring = document.getElementById(ringId);
        const valueEl = document.getElementById(valueId);
        const container = ring?.closest('.progress-ring-container');
        
        if (!ring || !valueEl) return;
        
        const progress = Math.min(current / max, 1);
        const circumference = 314; // 2 * π * 50 (radius)
        const strokeDashoffset = circumference - (progress * circumference);
        
        // Animate the ring with easing
        ring.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
        ring.style.strokeDashoffset = strokeDashoffset;
        
        // Update the value with counting animation
        this.animateNumber(valueEl, parseFloat(valueEl.textContent) || 0, current, unit);
        
        // Enhanced completion effect with glow
        if (progress >= 1) {
            container?.classList.add('completed');
            // Trigger completion celebration
            if (!ring.dataset.celebratedCompletion) {
                ring.dataset.celebratedCompletion = 'true';
                this.celebrateRingCompletion(ringId);
            }
        } else {
            container?.classList.remove('completed');
            delete ring.dataset.celebratedCompletion;
        }
    }
    
    animateNumber(element, from, to, unit) {
        const duration = 800;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * easeOut;
            
            element.textContent = (unit === 'h' ? current.toFixed(1) : Math.round(current)) + unit;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    celebrateRingCompletion(ringId) {
        const container = document.getElementById(ringId)?.closest('.progress-ring-container');
        if (container) {
            container.style.animation = 'celebrationBounce 0.6s ease-out';
            
            setTimeout(() => {
                container.style.animation = '';
            }, 600);
        }
    }
    
    updateAnalytics() {
        // Today completed
        document.getElementById('todayCompleted').textContent = this.timeTracking.todayCompleted;
        
        // Time spent
        const hours = Math.floor(this.timeTracking.todayFocus / 60);
        const minutes = this.timeTracking.todayFocus % 60;
        document.getElementById('timeSpent').textContent = `${hours}h ${minutes}m`;
        
        // Streak
        document.getElementById('streak').textContent = this.timeTracking.streak;
        
        // Weekly rate
        const weeklyRate = Math.round((this.timeTracking.weeklyCompleted / this.settings.weeklyTaskGoal) * 100);
        document.getElementById('weeklyRate').textContent = `${weeklyRate}%`;
    }
    
    updateStats() {
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        
        totalTasks.textContent = `Total: ${total}`;
        completedTasks.textContent = `Completed: ${completed}`;
    }
    
    toggleClearButton() {
        const clearBtn = document.getElementById('clearCompletedBtn');
        const hasCompleted = this.tasks.some(task => task.completed);
        
        clearBtn.style.display = hasCompleted ? 'block' : 'none';
    }
    
    toggleEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
            taskList.style.display = 'none';
            
            // Update empty state message based on filter
            const message = this.getEmptyStateMessage();
            emptyState.querySelector('p').textContent = message;
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'block';
        }
    }
    
    getEmptyStateMessage() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.length === 0 
                    ? 'No tasks yet. Add your first task!' 
                    : 'No active tasks. Great job! 🎉';
            case 'completed':
                return 'No completed tasks yet. Start working! 💪';
            default:
                return 'No tasks yet. Add your first task to get started! ✨';
        }
    }
    
    // Calendar
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const calendarTitle = document.getElementById('calendarTitle');
        
        if (!calendarGrid || !calendarTitle) return;
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        const monthName = new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }).format(this.currentCalendarDate);
        
        calendarTitle.textContent = monthName;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers with proper accessibility
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const headerRow = document.createElement('div');
        headerRow.setAttribute('role', 'row');
        headerRow.style.display = 'contents';
        
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.setAttribute('role', 'columnheader');
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.color = 'var(--color-text-secondary)';
            dayHeader.style.padding = 'var(--space-8)';
            dayHeader.style.textAlign = 'center';
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('button');
            emptyDay.className = 'calendar-day other-month';
            const prevMonthDay = new Date(year, month, -startingDay + i + 1);
            emptyDay.textContent = prevMonthDay.getDate();
            emptyDay.setAttribute('role', 'gridcell');
            emptyDay.setAttribute('tabindex', '-1');
            emptyDay.setAttribute('aria-label', `${prevMonthDay.toDateString()}, previous month`);
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day';
            dayButton.textContent = day;
            dayButton.setAttribute('role', 'gridcell');
            dayButton.setAttribute('tabindex', day === 1 ? '0' : '-1');
            
            const currentDate = new Date(year, month, day);
            const dayTasks = this.getTasksForDate(currentDate);
            
            let ariaLabel = currentDate.toDateString();
            
            // Check if it's today
            if (currentDate.toDateString() === today.toDateString()) {
                dayButton.classList.add('today');
                ariaLabel += ', today';
            }
            
            // Check if there are tasks on this day
            if (dayTasks.length > 0) {
                dayButton.classList.add('has-tasks');
                ariaLabel += `, ${dayTasks.length} task${dayTasks.length > 1 ? 's' : ''}`;
            }
            
            dayButton.setAttribute('aria-label', ariaLabel);
            
            dayButton.addEventListener('click', () => {
                this.selectDate(currentDate);
            });
            
            calendarGrid.appendChild(dayButton);
        }
        
        // Fill remaining cells
        const totalCells = calendarGrid.children.length;
        const remainingCells = 42 - totalCells; // 6 rows × 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const nextMonthDay = document.createElement('button');
            nextMonthDay.className = 'calendar-day other-month';
            nextMonthDay.textContent = i;
            nextMonthDay.setAttribute('role', 'gridcell');
            nextMonthDay.setAttribute('tabindex', '-1');
            const nextDate = new Date(year, month + 1, i);
            nextMonthDay.setAttribute('aria-label', `${nextDate.toDateString()}, next month`);
            calendarGrid.appendChild(nextMonthDay);
        }
    }
    
    selectDate(date) {
        this.selectedDate = new Date(date);
        const tasks = this.getTasksForDate(date);
        
        // Update selected date title
        const options = { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('selectedDateTitle').textContent = 
            date.toDateString() === new Date().toDateString() 
                ? "Today's Tasks" 
                : date.toLocaleDateString('en-US', options);
        
        // Render tasks for selected date
        const taskList = document.getElementById('calendarTaskList');
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<p>No tasks for this date</p>';
            taskList.appendChild(emptyState);
        } else {
            tasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    }
    
    getTasksForDate(date) {
        const dateStr = date.toDateString();
        return this.tasks.filter(task => {
            const taskDate = new Date(task.createdAt);
            return taskDate.toDateString() === dateStr;
        });
    }
    
    // Storage
    saveData() {
        try {
            // In a sandboxed environment, we'll use in-memory storage
            window.productivityAppData = {
                tasks: this.tasks,
                moodEntries: this.moodEntries,
                dailyMood: this.dailyMood,
                timeTracking: this.timeTracking,
                settings: this.settings,
                isDarkMode: this.isDarkMode,
                currentView: this.currentView
            };
            console.log('Data saved to memory');
        } catch (error) {
            console.warn('Storage not available, using in-memory storage:', error);
        }
    }
    
    loadData() {
        try {
            const data = window.productivityAppData;
            if (data) {
                this.tasks = data.tasks || [];
                this.moodEntries = data.moodEntries || [];
                this.dailyMood = data.dailyMood || this.dailyMood;
                this.timeTracking = data.timeTracking || this.timeTracking;
                this.settings = data.settings || this.settings;
                this.isDarkMode = data.isDarkMode !== undefined ? data.isDarkMode : true;
                this.currentView = data.currentView || 'dashboard';
                
                console.log('Data loaded:', { 
                    tasks: this.tasks.length, 
                    moodEntries: this.moodEntries.length,
                    isDarkMode: this.isDarkMode 
                });
            } else {
                console.log('No saved data found, using defaults');
                this.isDarkMode = true; // Default to dark mode
            }
            
            // Apply theme
            document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
            this.initTheme();
            
            // Restore UI states
            setTimeout(() => {
                this.restoreUIState();
                this.renderMoodSection();
                this.updateMoodAnalytics();
            }, 100);
            
        } catch (error) {
            console.warn('Storage not available, starting fresh:', error);
            // Ensure dark mode is default even when no storage
            this.isDarkMode = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            this.initTheme();
        }
    }
    
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', this.isDarkMode.toString());
            const screenReaderText = themeToggle.querySelector('.sr-only');
            if (screenReaderText) {
                screenReaderText.textContent = this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
            }
        }
        this.updateThemeIcon();
    }
    
    restoreUIState() {
        // Check if today's mood is already logged
        const today = new Date().toDateString();
        const todayEntry = this.moodEntries.find(entry => entry.date === today);
        
        if (todayEntry) {
            // Restore from today's entry
            this.dailyMood = {
                mood: todayEntry.mood,
                moodLabel: todayEntry.moodLabel,
                moodEmoji: todayEntry.moodEmoji,
                moodColor: todayEntry.moodColor,
                energy: todayEntry.energy,
                contextTags: [...todayEntry.contextTags],
                notes: todayEntry.notes,
                date: today
            };
        }
        
        // Restore mood UI
        if (this.dailyMood.mood) {
            this.setMoodUIFromData();
        }
        
        // Restore context tags UI
        this.updateContextTagsUI();
        
        // Restore energy slider
        const energySlider = document.getElementById('energySlider');
        const energyValue = document.getElementById('energyValue');
        if (energySlider && energyValue) {
            energySlider.value = this.dailyMood.energy;
            energyValue.textContent = this.dailyMood.energy;
            energyValue.style.color = this.getEnergyColor(this.dailyMood.energy);
        }
        
        // Restore notes
        const dailyNotes = document.getElementById('dailyNotes');
        if (dailyNotes) {
            dailyNotes.value = this.dailyMood.notes;
        }
    }
    
    setMoodUIFromData() {
        if (this.dailyMood.mood) {
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.setAttribute('aria-checked', 'false');
            });
            
            const moodBtn = document.querySelector(`[data-mood="${this.dailyMood.mood}"]`);
            if (moodBtn) {
                moodBtn.classList.add('selected');
                moodBtn.setAttribute('aria-checked', 'true');
            }
        }
    }
    
    setMoodUI() {
        if (this.dailyMood.mood) {
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            const moodBtn = document.querySelector(`[data-mood="${this.dailyMood.mood}"]`);
            if (moodBtn) {
                moodBtn.classList.add('selected');
                const moodEmojis = ['', '😢', '😐', '😊', '😄', '😍'];
                document.getElementById('selectedMood').textContent = `Feeling ${moodEmojis[this.dailyMood.mood]}`;
            }
        }
    }
    
    updateContextTagsUI() {
        document.querySelectorAll('.tag-btn').forEach(btn => {
            const context = btn.dataset.context;
            if (this.dailyMood.contextTags.includes(context)) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
    
    // Accessibility and Keyboard Navigation
    setupKeyboardNavigation() {
        // Setup arrow key navigation for calendar
        const calendar = document.getElementById('calendarGrid');
        if (calendar) {
            calendar.addEventListener('keydown', (e) => this.handleCalendarKeydown(e));
        }
    }
    
    handleTabKeydown(e, currentIndex, buttons) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            
            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            
            if (buttons[newIndex]) {
                buttons[newIndex].focus();
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.target.click();
        }
    }
    
    handleRadioKeydown(e, currentIndex, buttons) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            
            let newIndex;
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
            } else {
                newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
            }
            
            if (buttons[newIndex]) {
                buttons[newIndex].focus();
                buttons[newIndex].click(); // Auto-select on focus for radio
            }
        }
    }
    
    handleTaskListKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const taskItem = e.target.closest('.task-item');
            if (taskItem && e.target.classList.contains('task-checkbox')) {
                e.preventDefault();
                const taskId = taskItem.dataset.taskId;
                this.toggleComplete(taskId);
            }
        }
    }
    
    handleCalendarKeydown(e) {
        const focusedDay = document.activeElement;
        if (!focusedDay.classList.contains('calendar-day')) return;
        
        let newFocus = null;
        
        switch (e.key) {
            case 'ArrowLeft':
                newFocus = focusedDay.previousElementSibling;
                break;
            case 'ArrowRight':
                newFocus = focusedDay.nextElementSibling;
                break;
            case 'ArrowUp':
                const upIndex = Array.from(focusedDay.parentNode.children).indexOf(focusedDay) - 7;
                newFocus = focusedDay.parentNode.children[upIndex];
                break;
            case 'ArrowDown':
                const downIndex = Array.from(focusedDay.parentNode.children).indexOf(focusedDay) + 7;
                newFocus = focusedDay.parentNode.children[downIndex];
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                focusedDay.click();
                return;
        }
        
        if (newFocus && newFocus.classList.contains('calendar-day')) {
            e.preventDefault();
            newFocus.focus();
        }
    }
    
    trapModalFocus(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
    
    announceToScreenReader(message) {
        const announcements = document.getElementById('srAnnouncements');
        if (announcements) {
            announcements.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }
    
    // Utility functions
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    showInputError() {
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            taskInput.style.borderColor = 'var(--color-error)';
            taskInput.setAttribute('aria-invalid', 'true');
            const originalPlaceholder = taskInput.placeholder;
            taskInput.placeholder = 'Please enter a task!';
            
            // Focus the input
            taskInput.focus();
            
            // Announce error
            this.announceToScreenReader('Please enter a task description');
            
            setTimeout(() => {
                taskInput.style.borderColor = '';
                taskInput.removeAttribute('aria-invalid');
                taskInput.placeholder = originalPlaceholder || 'What needs to be done?';
            }, 2000);
        }
    }
    
    showEditError() {
        const editInput = document.getElementById('editInput');
        if (editInput) {
            editInput.style.borderColor = 'var(--color-error)';
            editInput.setAttribute('aria-invalid', 'true');
            
            // Focus the input
            editInput.focus();
            editInput.select();
            
            // Announce error
            this.announceToScreenReader('Please enter task text');
            
            setTimeout(() => {
                editInput.style.borderColor = '';
                editInput.removeAttribute('aria-invalid');
            }, 2000);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ProductivityApp...');
    try {
        window.productivityApp = new ProductivityApp();
        console.log('ProductivityApp instance created successfully');
    } catch (error) {
        console.error('Failed to initialize ProductivityApp:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to initialize the application. Please refresh the page.';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error, #f44336);
            color: white;
            padding: 16px;
            border-radius: 8px;
            z-index: 1000;
            font-family: var(--font-family-base, sans-serif);
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
});