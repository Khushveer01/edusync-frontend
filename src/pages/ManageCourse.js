import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, assessmentAPI } from '../services/api';
import Navigation from '../components/Navigation';

function ManageCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    duration: '',
    level: 'Beginner'
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, assessmentsData] = await Promise.all([
          courseAPI.getCourseDetails(courseId),
          assessmentAPI.getCourseAssessments(courseId)
        ]);
        
        setCourse(courseData);
        setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          mediaUrl: courseData.mediaUrl || '',
          duration: courseData.duration || '',
          level: courseData.level || 'Beginner'
        });
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const updatedCourse = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        mediaUrl: formData.mediaUrl.trim() || 'https://via.placeholder.com/300x200',
        duration: formData.duration.trim(),
        level: formData.level.trim()
      };

      await courseAPI.updateCourse(courseId, updatedCourse);
      navigate('/instructor/dashboard', { 
        state: { 
          message: 'Course updated successfully!',
          refresh: true 
        }
      });
    } catch (err) {
      console.error('Update course error:', err);
      setError(err.response?.data?.message || 'Failed to update course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        setLoading(true);
        await courseAPI.deleteCourse(courseId);
        navigate('/instructor/dashboard', { 
          state: { 
            message: 'Course deleted successfully!',
            refresh: true 
        }});
      } catch (err) {
        console.error('Delete course error:', err);
        setError('Failed to delete course. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAssessment = () => {
    navigate(`/instructor/assessments/create?courseId=${courseId}`);
  };

  if (loading && !course) {
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

  if (error && !course) {
    return (
      <>
        <Navigation />
        <div className="container py-4">
          <div className="alert alert-danger">
            {error}
          </div>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate('/instructor/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container py-4">
        <div className="row">
          {/* Course Details Form */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title mb-4">Edit Course Details</h2>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Course Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="mediaUrl" className="form-label">Media URL</label>
                    <input
                      type="url"
                      className="form-control"
                      id="mediaUrl"
                      name="mediaUrl"
                      value={formData.mediaUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <small className="text-muted">Leave empty to use default image</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration (in hours)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="level" className="form-label">Course Level</label>
                    <select
                      className="form-select"
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      Delete Course
                    </button>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/instructor/dashboard')}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Course Assessments */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0">Course Assessments</h3>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleCreateAssessment}
                  >
                    Add Assessment
                  </button>
                </div>

                {assessments.length === 0 ? (
                  <div className="alert alert-info">
                    No assessments created yet.
                  </div>
                ) : (
                  <div className="list-group">
                    {assessments.map(assessment => (
                      <div key={assessment._id} className="list-group-item">
                        <h6 className="mb-1">{assessment.title}</h6>
                        <p className="mb-1 small text-muted">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/instructor/assessments/${assessment._id}/edit`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Delete this assessment?')) {
                                assessmentAPI.deleteAssessment(assessment._id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageCourse; 