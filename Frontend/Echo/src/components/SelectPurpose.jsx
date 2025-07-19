import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SelectPurpose = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handlePurposeSelect = (purpose) => {
    navigate(`/pre-call-settings/${roomName}`, { state: { purpose } });
  };

  return (
    <div style={{ ...styles.pageContainer, opacity: fadeIn ? 1 : 0 }}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Select the Purpose of Your Video Call</h2>
        <p style={styles.description}>
          Choose the appropriate option below to continue to pre-call settings tailored for your session.
        </p>
        <div style={styles.buttonGroup}>
          <InteractiveButton label="Interview" onClick={() => handlePurposeSelect('interview')} />
          <InteractiveButton label="Online Exam" onClick={() => handlePurposeSelect('online_exam')} />
        </div>
      </div>
    </div>
  );
};

const InteractiveButton = ({ label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        ...styles.button,
        transform: isPressed ? 'scale(0.96)' : 'scale(1)',
        backgroundColor: isHovered ? '#185abc' : '#1a73e8',
      }}
    >
      {label}
    </button>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Google Sans', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    transition: 'opacity 0.6s ease-in-out',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    padding: '3rem 4rem',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.2rem',
    color: '#202124',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '1rem',
    color: '#5f6368',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  button: {
    padding: '0.9rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(26, 115, 232, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
  },
};

export default SelectPurpose;
