import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseAPI } from '../services/api';
import Navigation from '../components/Navigation';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all courses
        const allCourses = await courseAPI.getAllCourses();
        setCourses(allCourses);

        // Fetch enrolled courses
        const enrolledData = await courseAPI.getEnrolledCourses();
        setEnrolledCourses(enrolledData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await courseAPI.enrollInCourse(courseId);
      // Refresh enrolled courses
      const enrolledData = await courseAPI.getEnrolledCourses();
      setEnrolledCourses(enrolledData);
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course. Please try again later.');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

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
            <h1 className="h3">Courses</h1>
            <p className="text-muted">Browse and manage your courses</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Course Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Courses ({courses.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'enrolled' ? 'active' : ''}`}
              onClick={() => setActiveTab('enrolled')}
            >
              Enrolled Courses ({enrolledCourses.length})
            </button>
          </li>
        </ul>

        {/* Course List */}
        <div className="row">
          {activeTab === 'enrolled' ? (
            enrolledCourses.length === 0 ? (
              <div className="col">
                <div className="alert alert-info">
                  You are not enrolled in any courses yet.
                </div>
              </div>
            ) : (
              enrolledCourses.map(course => (
                <div key={course._id} className="col-md-4 mb-4">
                  <div className="card h-100 course-card">
                    <img
                      src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                      className="card-img-top"
                      alt={course.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text text-muted">{course.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <Link to={`/courses/${course._id}`} className="btn btn-primary">
                          Continue Learning
                        </Link>
                        <span className="badge bg-success">Enrolled</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            courses.length === 0 ? (
              <div className="col">
                <div className="alert alert-info">
                  No courses available at the moment.
                </div>
              </div>
            ) : (
              courses.map(course => {
                const enrolled = isEnrolled(course._id);
                return (
                  <div key={course._id} className="col-md-4 mb-4">
                    <div className="card h-100 course-card">
                      <img
                        src={course.thumbnail || 'https://via.placeholder.com/300x200'}
                        className="card-img-top"
                        alt={course.title}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text text-muted">{course.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          {enrolled ? (
                            <>
                              <Link to={`/courses/${course._id}`} className="btn btn-primary">
                                Continue Learning
                              </Link>
                              <span className="badge bg-success">Enrolled</span>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEnroll(course._id)}
                                className="btn btn-primary"
                              >
                                Enroll Now
                              </button>
                              <span className="badge bg-primary">Available</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Courses; 