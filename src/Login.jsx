import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase.jsx';
import { useNavigate } from 'react-router-dom';
import logo from './logo1.png';
import bgImg from './bg.png';
import newbgImg from './newbg.png';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 390);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 390);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${isSmallScreen ? newbgImg : bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >
      <div className="overlay"></div>
      <form onSubmit={handleLogin}>
        <img src={logo} alt="Sahayak Logo" className="logo" />
        <h2>Welcome to Sahayak</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
        <p onClick={handleSignupRedirect}>
          Don't have an account? <span>Sign up</span>
        </p>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
