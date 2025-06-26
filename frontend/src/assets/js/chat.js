document.addEventListener("DOMContentLoaded", function() {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    // Add initial welcome message
    appendMessage('bot', 'Hello! I\'m your Eco AI Assistant. Ready to help you with sustainable challenges for climate action! Ask me for a daily eco challenge or any sustainability tips.');

    // Send message when button is clicked
    sendButton.addEventListener("click", sendMessage);

    // Send message when Enter key is pressed
    userInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        appendMessage('user', message);
        
        // Clear input field
        userInput.value = '';

        // Show loading indicator
        const loadingId = showLoading();

        // Send message to backend
        fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Remove loading indicator
            hideLoading(loadingId);
            
            // Add bot response to chat
            appendMessage('bot', data.response);
        })
        .catch(error => {
            // Remove loading indicator
            hideLoading(loadingId);
            
            // Show error message
            appendMessage('error', 'Sorry, there was an error communicating with the eco assistant.');
            console.error('Error:', error);
        });
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = '<div class="message-content">Thinking...</div>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return Date.now(); // Return a unique ID for this loading indicator
    }

    function hideLoading(id) {
        const loadingElements = document.querySelectorAll('.loading');
        if (loadingElements.length > 0) {
            loadingElements[loadingElements.length - 1].remove();
        }
    }
});