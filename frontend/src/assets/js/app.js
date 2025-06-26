document.addEventListener("DOMContentLoaded", function() {
    // Initialize the complete button functionality
    const completeBtn = document.querySelector('.complete-btn');
    
    if (completeBtn) {
        completeBtn.addEventListener('click', function() {
            // Get current points
            const pointsElement = document.querySelector('.points span');
            const currentPoints = parseInt(pointsElement.textContent);
            
            // Add 50 points (or whatever the challenge is worth)
            const newPoints = currentPoints + 50;
            pointsElement.textContent = newPoints + ' points';
            
            // Update progress bar
            const progressBar = document.querySelector('.progress');
            const newWidth = Math.min(100, 35 + 5); // Assuming level goes up every 100 points
            progressBar.style.width = newWidth + '%';
            
            // Disable button after completion
            this.disabled = true;
            this.textContent = 'Completed';
            this.style.backgroundColor = '#95a5a6';
            
            // Show success message
            alert('Challenge completed! You earned 50 points.');
            
            // Request a new challenge
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message bot';
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.textContent = 'Great job completing the challenge! Would you like another eco challenge?';
                
                messageDiv.appendChild(contentDiv);
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});