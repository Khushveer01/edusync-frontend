import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import Navigation from '../components/Navigation';

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const courseData = await courseAPI.getCourseDetails(courseId);
        setCourse(courseData);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      await courseAPI.enrollInCourse(courseId);
      navigate('/student/dashboard');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError('Failed to enroll in course');
    }
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

  if (!course) {
    return (
      <>
        <Navigation />
        <div className="container py-4">
          <div className="alert alert-danger">
            Course not found or you don't have access to view it.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-8">
            <h1 className="h3 mb-4">{course.title}</h1>
            <div className="card mb-4">
              <img
                src={course.thumbnail || 'https://via.placeholder.com/800x400'}
                className="card-img-top"
                alt={course.title}
              />
              <div className="card-body">
                <h5 className="card-title">Course Description</h5>
                <p className="card-text">{course.description}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Course Information</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <strong>Instructor:</strong> {course.instructorName || 'Unknown'}
                  </li>
                  <li className="mb-2">
                    <strong>Duration:</strong> {course.duration || 'Not specified'}
                  </li>
                  <li className="mb-2">
                    <strong>Level:</strong> {course.level || 'Not specified'}
                  </li>
                </ul>
                <button onClick={handleEnroll} className="btn btn-primary w-100">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails; 