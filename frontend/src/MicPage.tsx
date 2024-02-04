import React from "react";
import "./stylizeMicPage.css";

export const Box = (): JSX.Element => {
  return (
    <div className="box">
      <div className="mask-group">
        <div className="main-star-console">
          <div className="overlap-group">
            <img
              className="element"
              alt="Element"
              src="526-5261040-recording-symbol-iphone-microphone-icon-hd-png-download-removebg-preview-1.png"
            />
            <p className="text-wrapper">Please use the microphone to express your thoughts!!!</p>
            <img className="screenshot" alt="Screenshot" src="screenshot-2024-02-03-at-5-02-1.png" />
            <img className="img" alt="Screenshot" src="screenshot-2024-02-03-at-4-45-1.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

