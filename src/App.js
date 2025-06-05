import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateCourse from './pages/CreateCourse';
import CreateAssessment from './pages/CreateAssessment';
import BrowseCourses from './pages/BrowseCourses';
import CourseDetails from './pages/CourseDetails';
import TakeAssessment from './pages/TakeAssessment';
import ManageCourse from './pages/ManageCourse';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === currentUser.role.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { currentUser } = useAuth();

  // Debug logging
  console.log('Current User:', currentUser);
  console.log('User Role:', currentUser?.role);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!currentUser ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!currentUser ? <Register /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {currentUser?.role?.toLowerCase() === 'student' ? (
                <Navigate to="/student/dashboard" replace />
              ) : (
                <Navigate to="/instructor/dashboard" replace />
              )}
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/courses" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assessments" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/results" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/courses/browse" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BrowseCourses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/courses/:courseId" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assessments/:assessmentId" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <TakeAssessment />
            </ProtectedRoute>
          } 
        />

        {/* Instructor Routes */}
        <Route 
          path="/instructor/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/courses" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/assessments" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/results" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/courses/create" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CreateCourse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/courses/:courseId/manage" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <ManageCourse />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/instructor/assessments/create" 
          element={
            <ProtectedRoute allowedRoles={['instructor']}>
              <CreateAssessment />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to appropriate dashboard */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              {currentUser?.role?.toLowerCase() === 'student' ? (
                <Navigate to="/student/dashboard" replace />
              ) : (
                <Navigate to="/instructor/dashboard" replace />
              )}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App; 