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

export const acceptUserChallenge = async (userEmail, challengeId, description, proofImage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-challenges/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
        challengeId,
        description,
        proofImage
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error accepting challenge:', error)
    throw error
  }
}

export const getUserChallenges = async (userEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-challenges/user/${userEmail}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching user challenges:', error)
    throw error
  }
}

export const checkUserChallengeStatus = async (userEmail, challengeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-challenges/check/${userEmail}/${challengeId}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error checking challenge status:', error)
    throw error
  }
}