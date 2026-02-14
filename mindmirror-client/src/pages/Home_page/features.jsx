import React from 'react'
import './home_page.css'; 
const Features = () => {
  return (
    <>
         <h2>Core Features</h2>

          <div className="features-layout">
           
            <div className="features-column left-features">
              <div className="feature-item">
                <h4>📝 Smart Journaling</h4>
                <p>Write freely and let AI analyze your mood and patterns.</p>
              </div>
              <div className="feature-item">
                <h4>🎧 Mood-Based Music</h4>
                <p>Get music suggestions tailored to your emotional state.</p>
              </div>
            </div>

            
            <div className="features-column right-features">
              <div className="feature-item">
                <h4>📊 Emotion Tracking</h4>
                <p>Visualize how your emotions evolve over time.</p>
              </div>
              <div className="feature-item">
                <h4>🤖 AI Mental Coach</h4>
                <p>Chat with an AI companion that listens and supports.</p>
              </div>
            </div>
          </div>
          </>
  )
}

export default Features