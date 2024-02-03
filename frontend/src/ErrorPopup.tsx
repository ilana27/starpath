import React, { useState } from "react";

interface PopupProps {
  message: string | null;
  onClose: () => void;
}

/**
 * This component represents the popup to be displayed on the screen in the case of an error such as 
 * if the backend isn't running properly
 * @param - the Props from the interface above are taken in as an argument 
 * @returns an HTML div representing an error popup message
 */
const Popup = ({ message, onClose }: PopupProps) => {
  const [closed, setClosed] = useState(false);

  const handleButtonClick = () => {
    console.log("Close button clicked");
    setClosed(true);
    onClose();
  };

  if (closed) {
    return null; // Don't render the popup if closed
  }

  return (
    <div className="popup-overlay" aria-label="notification message overlay">
      <div className="popup-content">
        <p className="error-message">{message}</p>
        <button className="close-button" aria-label="close button" onClick={handleButtonClick}>Close</button>
      </div>
    </div>
    );
};

export default Popup;
