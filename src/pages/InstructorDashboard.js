import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseAPI, assessmentAPI, studentAPI } from '../services/api';
import Navigation from '../components/Navigation';

function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch instructor's courses
        try {
          const coursesData = await courseAPI.getInstructorCourses();
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        } catch (courseError) {
          console.error('Error fetching courses:', courseError);
          setCourses([]);
        }

        // Fetch upcoming assessments
        try {
          const assessmentsData = await assessmentAPI.getInstructorAssessments();
          console.log('Fetched assessments:', assessmentsData);
          setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
        } catch (assessmentError) {
          console.error('Error fetching assessments:', assessmentError);
          setAssessments([]);
        }

        // Fetch enrolled students
        try {
          const studentsData = await studentAPI.getEnrolledStudents();
          setStudents(Array.isArray(studentsData) ? studentsData : []);
        } catch (studentError) {
          console.error('Error fetching students:', studentError);
          setStudents([]);
        }
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container py-4">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col">
            <h1 className="h3">Welcome, {user?.name}</h1>
            <p className="text-muted">Manage your courses and track student progress</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Total Courses</h5>
              <h2 className="mb-0">{courses.length}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Total Students</h5>
              <h2 className="mb-0">{students.length}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Active Assessments</h5>
              <h2 className="mb-0">{assessments.length}</h2>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Your Courses</h2>
              <Link to="/instructor/courses/create" className="btn btn-primary">
                Create New Course
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="alert alert-info">
                You haven't created any courses yet.
              </div>
            ) : (
              <div className="row">
                {courses.map(course => (
                  <div key={course._id} className="col-md-4 mb-3">
                    <div className="card course-card">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                        className="card-img-top"
                        alt={course.title}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text text-muted">{course.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Students: {course.enrolledStudents?.length || 0}
                          </small>
                          <div className="btn-group">
                            <Link to={`/instructor/courses/${course._id}/manage`} className="btn btn-primary">
                              Manage
                            </Link>
                            <Link to={`/instructor/courses/${course._id}/manage`} className="btn btn-outline-primary">
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Recent Assessments</h2>
              <Link to="/instructor/assessments/create" className="btn btn-primary">
                Create Assessment
              </Link>
            </div>
            {assessments.length === 0 ? (
              <div className="alert alert-info">
                No assessments created yet.
              </div>
            ) : (
              <div className="row">
                {assessments.map(assessment => (
                  <div key={assessment.assessmentId} className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{assessment.title}</h5>
                        <p className="card-text">
                          <small className="text-muted">
                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                          </small>
                        </p>
                        <div className="d-flex justify-content-between">
                          <Link to={`/instructor/assessments/${assessment.assessmentId}`} className="btn btn-primary">
                            View Results
                          </Link>
                          <Link to={`/instructor/assessments/${assessment.assessmentId}/edit`} className="btn btn-outline-primary">
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InstructorDashboard; 