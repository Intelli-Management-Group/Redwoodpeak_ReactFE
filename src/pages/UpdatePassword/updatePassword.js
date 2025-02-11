import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthenticationServices from '../../Services/AuthenticationServices';
import { notifySuccess } from '../Component/ToastComponents/ToastComponents';
import { ToastContainer } from 'react-toastify';


const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token is missing');
      return;
    }

    // const verifyToken = async () => {
    //   try {
    //     const response = await fetch(`/api/verify-reset-token?token=${token}`);
    //     const data = await response.json();

    //     if (data.success) {
    //       //   setEmail(data.email); // Set email based on token
    //     } else {
    //       setError('Invalid or expired token');
    //     }
    //   } catch (err) {
    //     setError('Error verifying token');
    //   }
    // };

    // verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {

      const formdata = new FormData();
      formdata.append("token", token);
      formdata.append("email", email);
      formdata.append("password", password);

      const response = await AuthenticationServices.Update_Password_Via_Mail(formdata);
      console.log(response)

      if (response.status_code === 200) {
        console.log("Password SuccessFully Update")
        notifySuccess(`Password Updated Successfully!`);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Error updating password');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            {confirmPasswordError && <div style={{ color: 'red', fontSize: '12px' }}>{confirmPasswordError}</div>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#511515',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />

    </div>

  );
};

export default UpdatePassword;
