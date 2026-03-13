import React, { useEffect, useState } from 'react';
import './Toast.css';

interface Props {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
  duration?: number;
}

const Toast: React.FC<Props> = ({ message, type, onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-visible' : 'toast-hidden'}`} role="alert">
      <span className="toast-icon" aria-hidden>{icons[type]}</span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
};

export default Toast;
