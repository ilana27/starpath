import React from "react";
import "./style.css";

export const Box = (): JSX.Element => {
  return (
    <div className="box">
      <div className="group">
        <div className="frame">
          <p className="DISCLAIMER-STARPATH">
            <span className="text-wrapper"> </span>
            <span className="span">
              [DISCLAIMER: STARPATH IS NOT A REAL COMPANY AND IS NOT RESPONSIBLE FOR ANY DAMAGES]
            </span>
          </p>
        </div>
        <div className="overlap-group-wrapper">
          <div className="overlap-group">
            <div className="div">StarPath’s Mission Statement</div>
            <p className="p">
              Mission Statement: We are StarPath! Our goal is to match those in need of mental health assistance with an
              AI professional that can help! Our AI model has taken the experience of thousands of professionals to help
              you be a better you. People have looked to the stars for centuries for advice, now you can look to us ;)
            </p>
          </div>
        </div>
        <div className="overlap-wrapper">
          <div className="overlap">
            <img className="pajamas-profile" alt="Pajamas profile" src="pajamas-profile.svg" />
            <div className="welcome-to-starpath">Welcome to StarPath!! 💫💫</div>
          </div>
        </div>
      </div>
    </div>
  );
};
