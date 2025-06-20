import React, { useState } from 'react';
import axios from 'axios';
import './loginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (action === 'Login') {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });
        console.log(res.data);
        alert('Login Successful!');
        navigate('/Home'); // ✅ Go to Home after login
      } else if (action === 'Signup') {
        const res = await axios.post('http://localhost:5000/api/auth/signup', {
          username,
          email,
          password,
        });
        console.log(res.data);
        alert('Signup Successful! Please login now.');
        setAction('Login');
      } else if (action === 'ForgotPassword') {
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
          email,
        });
        console.log(res.data);
        alert('Password reset link sent to your email (simulated)');
      }
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className='login-signup-container'>
      <div className='login-signup-form'>
        <h2>{action === 'Login' ? 'Login' : action === 'Signup' ? 'Sign Up' : 'Forgot Password'}</h2>

        <form onSubmit={handleSubmit}>
          {action === 'Signup' && (
            <div className='input-group'>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className='input-group'>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {action !== 'ForgotPassword' && (
            <div className='input-group'>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit">
            {action === 'Login' ? 'Login' : action === 'Signup' ? 'Sign Up' : 'Send Reset Link'}
          </button>
        </form>

        {action !== 'ForgotPassword' && (
          <p className='switch-form'>
            {action === 'Login'
              ? "Don't have an account?"
              : "Already have an account?"}
            <span onClick={() => setAction(action === 'Login' ? 'Signup' : 'Login')}>
              {action === 'Login' ? ' Sign Up' : ' Login'}
            </span>
          </p>
        )}

        {action !== 'ForgotPassword' && (
          <div className='forgot-password'>
            <p onClick={() => setAction('ForgotPassword')}>
              Forgot Password? <span>Click here!</span>
            </p>
          </div>
        )}

        {action === 'ForgotPassword' && (
          <div className='back-to-login'>
            <p onClick={() => setAction('Login')}>
              Remembered password? <span>Back to Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
