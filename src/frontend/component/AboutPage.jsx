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

          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '14px', color: '#6366f1', marginBottom: '1.2rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}>Built By</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>👨‍💻</span> <span style={{ fontWeight: 500, fontSize: '15px' }}>Abhay Pratap Singh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>👨‍💻</span> <span style={{ fontWeight: 500, fontSize: '15px' }}>Anubhav Mittal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>👨‍💻</span> <span style={{ fontWeight: 500, fontSize: '15px' }}>Ankit Modi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>👨‍💻</span> <span style={{ fontWeight: 500, fontSize: '15px' }}>Arnav Srivastava</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
