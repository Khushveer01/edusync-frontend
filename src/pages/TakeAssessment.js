import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import Navigation from '../components/Navigation';

function TakeAssessment() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const assessmentData = await assessmentAPI.getAssessmentDetails(assessmentId);
        setAssessment(assessmentData);
        // Initialize answers object
        const initialAnswers = {};
        assessmentData.questions.forEach(q => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assessmentAPI.submitAssessment(assessmentId, answers);
      navigate('/student/dashboard');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment');
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

  if (!assessment) {
    return (
      <>
        <Navigation />
        <div className="container py-4">
          <div className="alert alert-danger">
            Assessment not found or you don't have access to take it.
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
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-body">
                <h1 className="h3 mb-4">{assessment.title}</h1>
                <p className="text-muted mb-4">{assessment.description}</p>

                <form onSubmit={handleSubmit}>
                  {assessment.questions.map((question, index) => (
                    <div key={question.id} className="mb-4">
                      <h5 className="mb-3">Question {index + 1}</h5>
                      <p className="mb-3">{question.text}</p>
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          rows="3"
                          value={answers[question.id]}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Enter your answer here..."
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/student/dashboard')}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Assessment
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

export default TakeAssessment; 