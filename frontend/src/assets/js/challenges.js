// Daily Challenge Management
class DailyChallengeManager {
    constructor() {
        this.challenge = null;
        this.timerInterval = null;
        this.apiBaseUrl = 'http://127.0.0.1:5000/api';
        this.init();
    }

    async init() {
        await this.loadDailyChallenge();
        this.setupEventListeners();
    }

    async loadDailyChallenge() {
        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiBaseUrl}/daily-challenge`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.challenge = await response.json();
            console.log('Loaded AI-generated challenge:', this.challenge);
            this.displayChallenge();
            this.startCountdown();
            
        } catch (error) {
            console.error('Error loading daily challenge:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }

    displayChallenge() {
        if (!this.challenge) return;

        // Update challenge content with AI-generated data
        const titleElement = document.getElementById('challenge-title');
        const descriptionElement = document.getElementById('challenge-description');
        const pointsElement = document.getElementById('challenge-points');
        const difficultyElement = document.getElementById('challenge-difficulty');
        const categoryElement = document.getElementById('challenge-category');
        const impactElement = document.getElementById('challenge-impact');

        if (titleElement) titleElement.textContent = this.challenge.title;
        if (descriptionElement) descriptionElement.textContent = this.challenge.description;
        if (pointsElement) pointsElement.textContent = `+${this.challenge.points || 50} points`;
        if (difficultyElement) difficultyElement.textContent = this.challenge.difficulty || 'Medium';
        if (categoryElement) categoryElement.textContent = this.challenge.category || 'sustainability';
        if (impactElement) impactElement.textContent = this.challenge.impact || 'Helps protect the environment';

        // Update icon based on category
        const iconElement = document.querySelector('#challenge-icon i');
        if (iconElement) {
            const categoryIcons = {
                'water': 'fas fa-tint',
                'energy': 'fas fa-bolt',
                'waste': 'fas fa-recycle',
                'transport': 'fas fa-bicycle',
                'food': 'fas fa-leaf',
                'lifestyle': 'fas fa-heart',
                'default': 'fas fa-globe'
            };
            
            const iconClass = categoryIcons[this.challenge.category] || categoryIcons.default;
            iconElement.className = iconClass;
        }

        // Show challenge content
        const contentElement = document.getElementById('challenge-content');
        if (contentElement) {
            contentElement.style.display = 'block';
        }
    }

    startCountdown() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer-value');
        if (!timerElement) return;

        if (this.challenge && this.challenge.time_remaining) {
            let totalSeconds = this.challenge.time_remaining.total_seconds;
            
            if (totalSeconds <= 0) {
                // Challenge expired, load new AI-generated challenge
                console.log('Challenge expired, loading new AI challenge...');
                this.loadDailyChallenge();
                return;
            }

            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = timerDisplay;
            
            // Decrease the time for next update
            this.challenge.time_remaining.total_seconds = totalSeconds - 1;
        } else {
            // Fallback timer calculation
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeLeft = tomorrow.getTime() - now.getTime();
            
            if (timeLeft <= 0) {
                this.loadDailyChallenge();
                return;
            }

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            const timerDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timerElement.textContent = timerDisplay;
        }
    }

    setupEventListeners() {
        const completeBtn = document.getElementById('complete-btn');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                this.completeChallenge();
            });
        }
    }

    completeChallenge() {
        const completeBtn = document.getElementById('complete-btn');
        if (!completeBtn) return;
        
        completeBtn.textContent = 'Completed!';
        completeBtn.disabled = true;
        completeBtn.classList.add('completed');
        
        // Add points animation with dynamic points
        this.showPointsAnimation();
        
        // Store completion in localStorage
        const today = new Date().toDateString();
        localStorage.setItem(`challenge_completed_${today}`, 'true');
        
        setTimeout(() => {
            completeBtn.textContent = 'Challenge Completed ✓';
        }, 2000);
    }

    showPointsAnimation() {
        const pointsElement = document.getElementById('challenge-points');
        if (!pointsElement) return;
        
        // Use dynamic points from challenge
        const points = this.challenge?.points || 50;
        
        // Create floating points animation
        const floatingPoints = document.createElement('div');
        floatingPoints.className = 'floating-points';
        floatingPoints.textContent = `+${points}`;
        floatingPoints.style.cssText = `
            position: absolute;
            color: #2ecc71;
            font-weight: bold;
            font-size: 1.5rem;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
        `;
        
        // Add CSS animation if not already present
        if (!document.getElementById('floating-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'floating-animation-styles';
            style.textContent = `
                @keyframes floatUp {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        pointsElement.parentNode.appendChild(floatingPoints);
        
        setTimeout(() => {
            if (floatingPoints.parentNode) {
                floatingPoints.remove();
            }
        }, 2000);
    }

    showLoading(show) {
        const loadingElement = document.getElementById('challenge-loading');
        const contentElement = document.getElementById('challenge-content');
        
        if (loadingElement && contentElement) {
            if (show) {
                loadingElement.style.display = 'flex';
                contentElement.style.display = 'none';
            } else {
                loadingElement.style.display = 'none';
                contentElement.style.display = 'block';
            }
        }
    }

    showError() {
        const challengeCard = document.getElementById('challenge-card');
        if (challengeCard) {
            challengeCard.innerHTML = `
                <div class="challenge-error" style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3>Unable to Load AI Challenge</h3>
                    <p>Please check your connection and try again.</p>
                    <button onclick="location.reload()" class="retry-btn" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">Retry</button>
                </div>
            `;
        }
    }

    // Method to generate a new challenge (for testing)
    async generateNewChallenge() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBaseUrl}/generate-new-challenge`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.challenge = await response.json();
            console.log('Generated new AI challenge:', this.challenge);
            this.displayChallenge();
            this.startCountdown();
            
        } catch (error) {
            console.error('Error generating new challenge:', error);
            this.showError();
        } finally {
            this.showLoading(false);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('challenge-card')) {
        window.dailyChallengeManager = new DailyChallengeManager();
    }
});

// Check completion status
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toDateString();
    const completed = localStorage.getItem(`challenge_completed_${today}`);
    
    if (completed) {
        setTimeout(() => {
            const completeBtn = document.getElementById('complete-btn');
            if (completeBtn) {
                completeBtn.textContent = 'Challenge Completed ✓';
                completeBtn.disabled = true;
                completeBtn.classList.add('completed');
            }
        }, 1000);
    }
});

// Global function for testing
function generateNewChallenge() {
    if (window.dailyChallengeManager) {
        window.dailyChallengeManager.generateNewChallenge();
    }
}