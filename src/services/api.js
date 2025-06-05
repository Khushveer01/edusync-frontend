import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Course API
export const courseAPI = {
  getEnrolledCourses: async () => {
    const response = await api.get('/Courses/enrolled');
    return response.data;
  },

  getInstructorCourses: async () => {
    const response = await api.get('/Courses/instructor');
    return response.data;
  },

  getAllCourses: async () => {
    const response = await api.get('/Courses');
    return response.data;
  },

  getCourseDetails: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/api/Courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in getCourseDetails:', error);
      throw error;
    }
  },

  createCourse: async (courseData) => {
    const response = await api.post('/Courses', {
      title: courseData.title,
      description: courseData.description,
      mediaUrl: courseData.mediaUrl,
      duration: courseData.duration,
      level: courseData.level
    });
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/Courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/Courses/${courseId}`);
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/Courses/${courseId}/enroll`);
    return response.data;
  }
};

// Assessment API
export const assessmentAPI = {
  getUpcomingAssessments: async () => {
    const response = await api.get('/Assessments/upcoming');
    return response.data;
  },

  getInstructorAssessments: async () => {
    try {
      const response = await api.get('/Assessments/instructor');
      console.log('Instructor assessments response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching instructor assessments:', error.response?.data || error.message);
      return [];
    }
  },

  getCourseAssessments: async (courseId) => {
    const response = await api.get(`/Courses/${courseId}/assessments`);
    return response.data;
  },

  getStudentResults: async () => {
    const response = await api.get('/Assessments/results');
    return response.data;
  },

  createAssessment: async (courseId, assessmentData) => {
    const response = await api.post('/Assessments', {
      title: assessmentData.title,
      description: assessmentData.description,
      courseId: courseId,
      dueDate: assessmentData.dueDate,
      maxScore: assessmentData.maxScore,
      questions: assessmentData.questions
    });
    return response.data;
  },

  updateAssessment: async (assessmentId, assessmentData) => {
    const response = await api.put(`/Assessments/${assessmentId}`, assessmentData);
    return response.data;
  },

  deleteAssessment: async (assessmentId) => {
    const response = await api.delete(`/Assessments/${assessmentId}`);
    return response.data;
  }
};

// Student API
export const studentAPI = {
  getEnrolledStudents: async () => {
    try {
      const response = await api.get('/Students/enrolled');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching enrolled students:', error.response?.data || error.message);
      return [];
    }
  },

  getStudentProgress: async (studentId) => {
    const response = await api.get(`/Students/${studentId}/progress`);
    return response.data;
  },

  getCourseStudents: async (courseId) => {
    const response = await api.get(`/Courses/${courseId}/students`);
    return response.data;
  }
}; 