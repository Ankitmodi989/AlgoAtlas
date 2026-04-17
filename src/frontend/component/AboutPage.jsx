import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <div className="about-card">
        <div className="about-header">
          <div className="about-logo-icon">⚡</div>
          <h1 className="about-title">About AlgoAtlas</h1>
        </div>
        <div className="about-content">
          <p>
            Welcome to <strong>AlgoAtlas</strong>!
          </p>
          <p>
            AlgoAtlas is an interactive Data Structures and Algorithms (DSA) visualization and tracking platform designed to help students, developers, and enthusiasts master algorithmic problem solving and technical interviews.
          </p>
          <p>
            With AlgoAtlas, you can:
          </p>
          <ul>
            <li>Visualize complex algorithms step-by-step.</li>
            <li>Track your progress on various DSA topics.</li>
            <li>Maintain a specialized wishlist of algorithms you want to learn or review.</li>
          </ul>
          <p>
            Our mission is to make learning computer science fundamentals intuitive, engaging, and highly effective.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
