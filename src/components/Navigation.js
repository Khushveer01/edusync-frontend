import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isStudent = currentUser?.role?.toLowerCase() === 'student';
  const basePath = isStudent ? '/student' : '/instructor';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to={`${basePath}/dashboard`}>EduSync</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to={`${basePath}/dashboard`}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`${basePath}/courses`}>
                {isStudent ? 'My Courses' : 'Manage Courses'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`${basePath}/assessments`}>
                {isStudent ? 'My Assessments' : 'Manage Assessments'}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`${basePath}/results`}>Results</Link>
            </li>
            {!isStudent && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/instructor/courses/create">Create Course</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/instructor/assessments/create">Create Assessment</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Welcome, {currentUser?.name}</span>
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 