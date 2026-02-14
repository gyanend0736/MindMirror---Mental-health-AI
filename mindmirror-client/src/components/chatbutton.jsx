// components/ChatButton.jsx
import React,{useRef} from 'react';
import { IoChatbubbleSharp } from "react-icons/io5";// Optional: using lucide-react for icon

const ChatButton = ({ onClick }) => {
  const iconRef = useRef(null);

  const handleMouseEnter = () => {
    iconRef.current.style.transform = 'scale(1.5) rotate(20deg)';
  };

  const handleMouseLeave = () => {
    iconRef.current.style.transform = 'scale(1) rotate(0deg)';
  };

  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999,
        backgroundColor: '#6C47FF',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        padding: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        display: 'flex',
      }}
    >
      <span
        ref={iconRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'inline-block',
          height: '24px',
          transition: 'transform 0.3s ease',
        }}
      >
        <IoChatbubbleSharp size={24} />
      </span>
    </button>
  );
};

export default ChatButton;