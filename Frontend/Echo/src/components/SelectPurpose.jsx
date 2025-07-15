import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SelectPurpose = () => {
  const navigate = useNavigate();
  const { roomName } = useParams();

  const handlePurposeSelect = (purpose) => {
    navigate(`/pre-call-settings/${roomName}`, { state: { purpose } });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f141f',
        color: '#00fff7',
        fontFamily: "'Share Tech Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <h2 style={{ fontSize: '2rem', textShadow: '0 0 10px #00fff7' }}>
        Select Purpose of Video Call
      </h2>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <button
          onClick={() => handlePurposeSelect('interview')}
          style={buttonStyle}
        >
          Interview
        </button>
        <button
          onClick={() => handlePurposeSelect('online_exam')}
          style={{ ...buttonStyle, backgroundColor: '#b12d25', boxShadow: '0 0 15px #b12d25' }}
        >
          Online Exam
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '14px 28px',
  fontSize: '1.2rem',
  fontWeight: '700',
  borderRadius: '12px',
  cursor: 'pointer',
  backgroundColor: '#00fff7',
  color: '#010a14',
  border: 'none',
  boxShadow: '0 0 15px #00fff7',
  transition: 'box-shadow 0.3s ease',
};

export default SelectPurpose;
