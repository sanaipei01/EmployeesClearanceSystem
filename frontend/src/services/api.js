// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJTeXN0ZW0gQWRtaW5pc3RyYXRvciIsImlhdCI6MTc3NjM1ODE3MiwiZXhwIjoxNzc2Mzg2OTcyfQ.0lWt2Dh9NxUrXXDnrfm5ss1WDg2RLnjg2KlYSJNp6Ew;
    }
    
    const response = await fetch(${API_URL}, {
        ...options,
        headers,
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API call failed');
    }
    
    return response.json();
};

// Auth endpoints
export const login = (username, password) => {
    return apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
};

// Stats endpoint
export const getStats = () => {
    return apiCall('/stats');
};

// Employees endpoints
export const getEmployees = () => {
    return apiCall('/employees');
};

// Clearance requests endpoints
export const getRequests = () => {
    return apiCall('/requests');
};

export const getMyRequests = () => {
    return apiCall('/requests/my');
};

export const submitRequest = (requestData) => {
    return apiCall('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
    });
};

export const updateRequestStatus = (requestId, status, reviewNote) => {
    return apiCall(/requests//status, {
        method: 'PATCH',
        body: JSON.stringify({ status, review_note: reviewNote }),
    });
};

// Feedback endpoints
export const getFeedback = () => {
    return apiCall('/feedback');
};

export const submitFeedback = (feedbackData) => {
    return apiCall('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedbackData),
    });
};

export default {
    login,
    getStats,
    getEmployees,
    getRequests,
    getMyRequests,
    submitRequest,
    updateRequestStatus,
    getFeedback,
    submitFeedback,
};
