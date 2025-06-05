import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI, assessmentAPI } from '../services/api';
import Navigation from '../components/Navigation';

function CreateAssessment() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    duration: 30, // in minutes
    totalMarks: 100,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctOption: 0,
        marks: 10
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseAPI.getInstructorCourses();
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setFormData(prev => ({ ...prev, courseId: coursesData[0].courseId }));
        }
      } catch (err) {
        console.error('Fetch courses error:', err);
        setError('Failed to load courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options[optionIndex] = value;
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctOption: 0,
          marks: 10
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Format the data according to backend expectations
      const assessmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        maxScore: formData.questions.reduce((sum, q) => sum + q.marks, 0),
        questions: JSON.stringify(formData.questions.map(q => ({
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correctOption: q.correctOption,
          marks: q.marks
        })))
      };

      console.log('Sending assessment data:', assessmentData);
      
      const response = await assessmentAPI.createAssessment(formData.courseId, assessmentData);
      console.log('Assessment created successfully:', response);
      
      // Navigate to the instructor dashboard
      navigate('/instructor/dashboard', { 
        state: { 
          message: 'Assessment created successfully!',
          refresh: true 
        }
      });
    } catch (err) {
      console.error('Create assessment error:', err);
      setError(err.response?.data?.message || 'Failed to create assessment. Please try again.');
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
                <h2 className="card-title mb-4">Create New Assessment</h2>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="courseId" className="form-label">Select Course</label>
                    <select
                      className="form-select"
                      id="courseId"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      required
                    >
                      {courses.map(course => (
                        <option key={course.courseId} value={course.courseId}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Assessment Title</label>
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
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="dueDate" className="form-label">Due Date</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="duration" className="form-label">Duration (minutes)</label>
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
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 mb-0">Questions</h3>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={addQuestion}
                      >
                        Add Question
                      </button>
                    </div>

                    {formData.questions.map((question, qIndex) => (
                      <div key={qIndex} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h4 className="h6 mb-0">Question {qIndex + 1}</h4>
                            {formData.questions.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeQuestion(qIndex)}
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Question Text</label>
                            <input
                              type="text"
                              className="form-control"
                              value={question.question}
                              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Options</label>
                            {question.options.map((option, oIndex) => (
                              <div key={`${qIndex}-${oIndex}`} className="input-group mb-2">
                                <div className="input-group-text">
                                  <input
                                    type="radio"
                                    name={`correctOption-${qIndex}`}
                                    checked={question.correctOption === oIndex}
                                    onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                                    required
                                  />
                                </div>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={option}
                                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                  placeholder={`Option ${oIndex + 1}`}
                                  required
                                />
                              </div>
                            ))}
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Marks</label>
                            <input
                              type="number"
                              className="form-control"
                              value={question.marks}
                              onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))}
                              min="1"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
                        'Create Assessment'
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

export default CreateAssessment; 