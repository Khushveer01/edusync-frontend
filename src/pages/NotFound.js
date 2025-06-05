import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 