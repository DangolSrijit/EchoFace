import React from "react";
import "./User.css";

function GoogleMeetPage() {
  return (
    <div className="meet-container">
      <div className="meet-left">
        <img src="https://ssl.gstatic.com/meet/logo/v2/meet-logo.svg" alt="Google Meet" className="meet-logo" />
        <h1 className="meet-title">Video calls and meetings for everyone</h1>
        <p className="meet-text">Connect, collaborate, and celebrate from anywhere with Google Meet</p>
        <div className="meet-buttons">
          <button className="meet-new-btn">New meeting</button>
          <div className="meet-join-box">
            <input type="text" placeholder="Enter a code or link" />
            <button className="meet-join-btn">Join</button>
          </div>
        </div>
        <a href="#" className="meet-link">Learn more about Google Meet</a>
      </div>

      <div className="meet-right">
        <div className="meet-circle">
          <img src="https://www.gstatic.com/meet/carousel/desktop_link_illustration_v2_2x.png" alt="Link sharing" />
        </div>
        <h2>Get a link you can share</h2>
        <p>Click <strong>New meeting</strong> to get a link you can send to people you want to meet with</p>
      </div>
    </div>
  );
}

export default GoogleMeetPage;
