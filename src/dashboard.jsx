import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.jsx';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import mainImg from './main-img.jpg';
import Reminder from './Reminder.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const reminderRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            setShowPopup(true);
          }, 1000); // 1 second delay
        } else {
          clearTimeout(timeoutRef.current);
          setShowPopup(false);
        }
      },
      { threshold: 0.5 }
    );

    if (reminderRef.current) {
      observer.observe(reminderRef.current);
    }

    return () => {
      if (reminderRef.current) observer.unobserve(reminderRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className="nav">
        <div className="nav-logo">
          <h1>SAHAYAK</h1>
        </div>

        <div className="nav-links">
          <a href="#">HOME</a>
          <a href="#">REMINDER</a>
          <a href="#">PROGRESS</a>
          <a href="#">INTENSITY</a>
        </div>
      </div>

      <div className="main" id="main">
        <div className="main-text">
          <h3>WELCOME TO</h3>
          <h1>SAHAYAK</h1>
          <h4>STILLNESS IN EVERY SHAKE</h4>
        </div>
        <div className="main-img">
          <img src={mainImg} alt="Main" />
        </div>
      </div>

      <div
        className="scroll-down"
        onClick={() =>
          document.getElementById('reminder-section')?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        ↓
      </div>

      <div ref={reminderRef} id="reminder-section" className="reminder-wrapper">
        {showPopup && (
          <div className="popup-inside">
            <h3>INTRODUCTION</h3>
            <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>
            <p>Welcome to the <b>Sahayak </b>App, an advanced platform designed to transform mealtime challenges for Parkinson’s patients into moments of confidence and ease. This app is tailored to improve independence by addressing the struggles caused by hand tremors through cutting-edge technology and personalized care.
<br />

<b>FEATURES OF THE APP:</b>
<br />
<b>1. Real-Time Tremor Intensity Tracking: </b> <br />
   The app provides live insights into tremor intensity, allowing users to monitor their condition effortlessly. The tremor tracking system uses AI-powered analysis to detect even the smallest changes in movement, ensuring accurate and timely updates.
 <br />
<b>2. Progress Monitoring: </b> <br />
   By logging tremor patterns throughout the day, the app offers users a clear view of their progress. Historical data helps identify trends, empowering users to better understand their condition and adapt their routines accordingly.
          <br />
<b>3. Medication Reminders: </b><br />
   The app ensures users stay consistent with their health regimen by sending intelligent medication alerts. This feature uses tremor predictions to suggest the best times to take medication, promoting better management of symptoms.

</p>
          </div>
        )}
        <Reminder />
      </div>
    </>
  );
};

export default Dashboard;
