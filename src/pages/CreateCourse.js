import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import Navigation from '../components/Navigation';

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    duration: '',
    level: 'Beginner'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      // Format the data according to backend expectations
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        mediaUrl: formData.mediaUrl.trim() || 'https://via.placeholder.com/300x200',
        duration: formData.duration.trim(),
        level: formData.level.trim()
      };

      console.log('Sending course data:', courseData);
      
      const response = await courseAPI.createCourse(courseData);
      console.log('Course created successfully:', response);
      
      // Navigate to the instructor dashboard
      navigate('/instructor/dashboard', { 
        state: { 
          message: 'Course created successfully!',
          refresh: true 
        }
      });
    } catch (err) {
      console.error('Create course error:', err);
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title mb-4">Create New Course</h2>
                
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
                    ></textarea>
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

                  <div className="d-flex justify-content-end gap-2">
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
                          Creating...
                        </>
                      ) : (
                        'Create Course'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateCourse; 