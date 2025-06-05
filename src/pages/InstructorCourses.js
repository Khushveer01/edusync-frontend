import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseAPI } from '../services/api';
import Navigation from '../components/Navigation';

function InstructorCourses() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch instructor's courses
        const coursesData = await courseAPI.getInstructorCourses();
      console.log('Fetched courses:', coursesData); // Debug log
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle refresh and success message from course creation
  useEffect(() => {
    if (location.state?.refresh) {
      fetchCourses();
      if (location.state?.message) {
        setSuccessMessage(location.state.message);
        // Clear the message after 3 seconds
        const timer = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...new Set(courses.map(course => course.category))];

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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3">My Courses</h1>
                <p className="text-muted">Manage your courses and content</p>
              </div>
              <Link to="/instructor/courses/create" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Create New Course
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">Category</span>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            You haven't created any courses yet. Click "Create New Course" to get started.
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-search me-2"></i>
            No courses found matching your search criteria.
          </div>
        ) : (
          <div className="row">
            {filteredCourses.map(course => (
              <div key={course.courseId} className="col-md-4 mb-4">
                <div className="card h-100 course-card">
                  <div className="position-relative">
                    <img
                      src={course.mediaUrl || 'https://via.placeholder.com/300x200'}
                      className="card-img-top"
                      alt={course.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-muted">{course.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/instructor/courses/${course.courseId}`} className="btn btn-primary">
                        <i className="bi bi-gear me-2"></i>
                        Manage
                      </Link>
                      <Link to={`/instructor/courses/${course.courseId}/edit`} className="btn btn-outline-primary">
                        <i className="bi bi-pencil me-2"></i>
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
    </>
  );
}

export default InstructorCourses; 