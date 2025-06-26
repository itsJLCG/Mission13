import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust the base URL as needed

export const fetchChallenges = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/challenges`);
        return response.data;
    } catch (error) {
        console.error('Error fetching challenges:', error);
        throw error;
    }
};

export const sendMessageToChatbot = async (message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, { message });
        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
        throw error;
    }
};