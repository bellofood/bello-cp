import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          router.push('/admin');
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Belloo</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/css/all.min.css" />
      </Head>

      <div className="login-container">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-md-6 col-lg-4">
              <div className="login-card">
                <div className="login-header">
                  <div className="logo-container">
                    <img src="/assets/images/logo/logo.svg" alt="Belloo" className="logo" />
                  </div>
                  <h2>Admin Login</h2>
                  <p>Sign in to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="username">
                      <i className="fas fa-user"></i>
                      Username or Email
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Enter your username or email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="fas fa-lock"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-login"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="login-footer">
                  <p className="text-muted">
                    <small>Default credentials: admin / admin123</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Montserrat', sans-serif;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-container {
          margin-bottom: 20px;
        }

        .logo {
          max-height: 60px;
          width: auto;
        }

        .login-header h2 {
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 28px;
        }

        .login-header p {
          color: #666;
          margin-bottom: 0;
          font-size: 16px;
        }

        .login-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
          font-size: 14px;
        }

        .form-group label i {
          margin-right: 8px;
          color: #667eea;
          width: 16px;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e1e5e9;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
          background-color: #fff;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .btn-login {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .alert {
          border-radius: 10px;
          margin-bottom: 20px;
          border: none;
          font-size: 14px;
        }

        .alert-danger {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border-left: 4px solid #dc3545;
        }

        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e1e5e9;
        }

        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }

        @media (max-width: 576px) {
          .login-card {
            margin: 20px;
            padding: 30px 20px;
          }
          
          .login-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}
