import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import Navigation from '../components/Navigation';

function BrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await courseAPI.getAllCourses();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
            <h1 className="h3">Browse Courses</h1>
            <p className="text-muted">Explore and enroll in courses to start learning</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="alert alert-info">
            No courses available at the moment. Please check back later!
          </div>
        ) : (
          <div className="row">
            {courses.map(course => (
              <div key={course._id} className="col-md-4 mb-4">
                <div className="card h-100">
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
                        Instructor: {course.instructorName || 'Unknown'}
                      </small>
                      <Link to={`/student/courses/${course._id}`} className="btn btn-primary">
                        View Course
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

export default BrowseCourses; 