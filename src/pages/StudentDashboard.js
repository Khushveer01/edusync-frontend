import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseAPI, assessmentAPI } from '../services/api';
import Navigation from '../components/Navigation';

function StudentDashboard() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch enrolled courses
        const coursesData = await courseAPI.getEnrolledCourses();
        setCourses(coursesData);

        // Fetch upcoming assessments
        const assessmentsData = await assessmentAPI.getUpcomingAssessments();
        setAssessments(assessmentsData);
        
        // Fetch assessment results
        const resultsData = await assessmentAPI.getStudentResults();
        setResults(resultsData);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setError('Failed to load dashboard data. Please try again later.');
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
            <h1 className="h3">Welcome, {currentUser?.name}</h1>
            <p className="text-muted">Track your learning progress and upcoming assessments</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Enrolled Courses</h5>
              <h2 className="mb-0">{courses.length}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Upcoming Assessments</h5>
              <h2 className="mb-0">{assessments.length}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-stats">
              <h5>Completed Assessments</h5>
              <h2 className="mb-0">{results.length}</h2>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="row mb-4">
          <div className="col">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 mb-0">Your Courses</h2>
              <Link to="/student/courses/browse" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
            {courses.length === 0 ? (
              <div className="alert alert-info">
                You haven't enrolled in any courses yet. Browse available courses to get started!
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
                        <div className="progress mb-3" style={{ height: '5px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ width: `${course.progress || 0}%` }}
                            aria-valuenow={course.progress || 0} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Progress: {course.progress || 0}%</small>
                          <Link to={`/student/courses/${course._id}`} className="btn btn-primary">
                            Continue Learning
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

        {/* Upcoming Assessments */}
        <div className="row mb-4">
          <div className="col">
            <h2 className="h4 mb-3">Upcoming Assessments</h2>
            {assessments.length === 0 ? (
              <div className="alert alert-info">
                No upcoming assessments. Focus on your current courses!
              </div>
            ) : (
              <div className="list-group">
                {assessments.map(assessment => (
                  <div key={assessment._id} className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{assessment.title}</h5>
                        <p className="mb-1 text-muted">
                          <i className="bi bi-book me-2"></i>
                          {assessment.courseName}
                        </p>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">
                          <i className="bi bi-clock me-1"></i>
                            Due: {new Date(assessment.dueDate).toLocaleDateString()}
                          </small>
                        <Link to={`/student/assessments/${assessment._id}`} className="btn btn-sm btn-primary mt-2">
                          Start Assessment
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assessment Results */}
        <div className="row mb-4">
          <div className="col">
            <h2 className="h4 mb-3">Your Results</h2>
            {results.length === 0 ? (
              <div className="alert alert-info">
                No assessment results yet. Complete some assessments to see your results!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Assessment</th>
                      <th>Course</th>
                      <th>Score</th>
                      <th>Completed</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(result => (
                      <tr key={result._id}>
                        <td>{result.assessmentTitle}</td>
                        <td>{result.courseName}</td>
                        <td>{result.score}%</td>
                        <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${result.score >= 70 ? 'bg-success' : 'bg-warning'}`}>
                            {result.score >= 70 ? 'Passed' : 'Needs Improvement'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentDashboard; 