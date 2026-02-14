import React, { useState } from 'react';

// The Flask API endpoint
const API_URL = 'https://mindmirror-mental-health-ai-5.onrender.com/api/detect-emotion' || 'http://localhost:5000/api/detect-emotion';

// --- Local Storage Helper Functions ---

/**
 * Maps the detected emotion string to a numerical score (1-10 scale).
 * This function defines the "mood score" used for weekly analysis.
 * You should adjust these values based on your desired scale/model.
 */
const getMoodScore = (emotion) => {
    const scores = {
        'joy': 9,
        'love': 8,
        'excitement': 8,
        'surprise': 7,
        'neutral': 6,
        'calmness': 6,
        'sadness': 3,
        'anger': 2,
        'fear': 2,
        'disgust': 1,
    };
    // Default to 5 if emotion is not recognized
    return scores[emotion.toLowerCase()] || 5; 
};

/**
 * Saves the daily journal analysis to Local Storage.
 * @param {object} entryData - Contains date, moodScore, and emotion.
 */
const saveDailyEntry = (entryData) => {
    // 1. Retrieve the existing log (default to empty array if none exists)
    const existingLog = JSON.parse(localStorage.getItem('mindHealthLog') || '[]');
    
    // 2. Filter out any existing entry for today's date to prevent duplicates
    const updatedLog = existingLog.filter(e => e.date !== entryData.date);
    
    // 3. Add the new entry
    updatedLog.push(entryData);

    // 4. Save the updated log back to Local Storage
    localStorage.setItem('mindHealthLog', JSON.stringify(updatedLog));
    console.log(`Saved entry for ${entryData.date} with score ${entryData.moodScore}.`);
};

// --- Styles (kept the same for brevity, assuming they are defined correctly) ---
const styles = {
    // ... (Your existing styles object remains here)
    journalPage: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4rem',
        background: '#ebf4ff',
        fontFamily: 'Segoe UI, sans-serif',
        minHeight: '100vh',
        gap: '40px',
    },
    // ... (All other styles)
    journalLeft: {
        maxWidth: '70%',
        flex: '1 1 auto', 
        paddingRight: '2rem', 
    },
    h2: {
        fontSize: '5rem',
        marginBottom: '0.5rem',
        color: '#333',
    },
    subText: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem', 
    },
    textarea: {
        width: '100%',
        height: '180px',
        padding: '1rem',
        fontSize: '1rem',
        border: '2px solid #ccc',
        borderRadius: '10px',
        resize: 'none',
        backgroundColor: '#fff',
        transition: 'border-color 0.3s',
        fontFamily: 'inherit',
    },
    button: {
        marginTop: '1rem',
        padding: '0.7rem 1.5rem',
        background: '#6a5acd', // Purple
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.3s',
        alignSelf: 'flex-start', 
    },
    buttonDisabled: {
        background: '#9e95e7', // Lighter purple for disabled state
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
    },
    resultContainer: {
        marginTop: '2rem',
        borderTop: '2px solid #6a5acd',
        paddingTop: '2rem',
    },
    emotionBox: {
        background: '#e3eaff',
        padding: '1rem',
        borderLeft: '4px solid #6a5acd',
        borderRadius: '6px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1.5rem',
    },
    adviceSection: {
        marginTop: '1.5rem',
    },
    adviceTitle: {
        fontSize: '1.5rem',
        color: '#333',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
    },
    adviceText: {
        backgroundColor: '#ffffff',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        lineHeight: 1.5,
        color: '#444',
    },
    recommendationGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '1.5rem',
    },
    recCard: {
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
    },
    recTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#6a5acd',
        marginBottom: '0.5rem',
    },
    recLink: {
        color: '#6a5acd',
        fontWeight: 'bold',
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '0.5rem',
    },
    recDescription: {
        fontSize: '0.9rem',
        color: '#666',
    },
    errorBox: {
        marginTop: '1rem',
        background: '#fee2e2',
        padding: '1rem',
        borderLeft: '4px solid #ef4444',
        borderRadius: '6px',
        color: '#991b1b',
        fontWeight: '500',
    },
    journalRight: {
        position: 'relative',
        width: '400px',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
    },
    illustrationCircle: {
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle at center, #ffe6c7, #ffb347)', 
        borderRadius: '50%',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [result, setResult] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (entry.trim().length < 50) {
        setError('Please write at least 50 characters for better analysis.');
        return;
    }

    setIsLoading(true);
    setError('');
    setResult(null); 

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: entry }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        const resultData = await response.json();
        setResult(resultData); 
        console.log('Full Analysis Result:', resultData); 
        
        // --- NEW: Data Logging Logic ---
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const moodScore = getMoodScore(resultData.emotion);

        const dailyEntry = {
            date: today,
            moodScore: moodScore, // Numerical score for easy averaging
            emotion: resultData.emotion, // Categorical emotion
        };

        // Save the essential data to local storage
        saveDailyEntry(dailyEntry);
        // --- END NEW LOGIC ---

    } catch (err) {
        console.error('API Call Error:', err);
        setError(`Failed to analyze mood. Ensure the Flask server is running. Details: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };
    
  // Conditional styles for button
  const isButtonDisabled = isLoading || entry.trim().length < 50;
  const buttonStyle = {
      ...styles.button,
      ...(isButtonDisabled ? styles.buttonDisabled : {})
  };

  return (
    <div style={styles.journalPage}>
      <div style={styles.journalLeft}>
        <h2 style={styles.h2}>Daily Reflection</h2>
        <p style={styles.subText}>Write your thoughts to understand your mood better</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            placeholder="What are you feeling today? (Minimum 50 characters)"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={isLoading}
            style={styles.textarea}
          />
          <button type="submit" disabled={isButtonDisabled} style={buttonStyle}>
            {isLoading ? 'Analyzing...' : 'Analyze Emotion'}
          </button>
        </form>

        {error && (
            <div style={styles.errorBox}>
                {error}
            </div>
        )}

        {/* --- Display Suggestions and Recommendations --- */}
        {result && !error && (
            <div style={styles.resultContainer}>
                {/* 1. Detected Emotion */}
                <div style={styles.emotionBox}>
                    Your Primary Emotion: <strong>{result.emotion}</strong>
                </div>

                {/* 2. General Advice */}
                <div style={styles.adviceSection}>
                    <h3 style={styles.adviceTitle}>General Advice</h3>
                    <p style={styles.adviceText}>{result.general_advice}</p>
                </div>

                {/* 3. Song and Exercise Recommendations Grid */}
                <div style={styles.recommendationGrid}>
                    {/* Song Recommendation */}
                    <div style={{...styles.recCard, borderLeft: '5px solid #ffb347'}}>
                        <h4 style={styles.recTitle}>Song Recommendation</h4>
                        <p><strong>{result.song_recommendation.title}</strong> by {result.song_recommendation.artist}</p>
                        <p style={styles.recDescription}>Need a break? This track is tailored for your current mood.</p>
                        <a href={result.song_recommendation.link} target="_blank" rel="noopener noreferrer" style={styles.recLink}>
                            Listen Now →
                        </a>
                    </div>
                    
                    {/* Exercise/Activity Recommendation */}
                    <div style={{...styles.recCard, borderLeft: '5px solid #6a5acd'}}>
                        <h4 style={styles.recTitle}>Activity Suggestion: {result.exercise_recommendation.name}</h4>
                        <p style={styles.recDescription}>{result.exercise_recommendation.description}</p>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      {/* --- Illustration (Right Side) --- */}
      <div style={styles.journalRight}>
        <div style={styles.illustrationCircle}>
          <svg width="250" height="250" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Paper (Matches the CSS dimensions and colors) */}
            <rect x="60" y="40" width="120" height="160" rx="8" fill="white" style={{ boxShadow: '2px 2px 10px rgba(0,0,0,0.15)' }} />
            
            {/* Lines (Simplified) */}
            <g stroke="#ccc" strokeWidth="2" strokeLinecap="round">
              <line x1="80" y1="75" x2="160" y2="75" />
              <line x1="80" y1="95" x2="160" y2="95" />
              <line x1="80" y1="115" x2="160" y2="115" />
              <line x1="80" y1="135" x2="160" y2="135" />
              <line x1="80" y1="155" x2="160" y2="155" />
            </g>

            {/* Pen (Matches the CSS dimensions and colors) */}
            <g transform="translate(10, 10) rotate(-20 125 125)">
              <rect x="180" y="50" width="12" height="80" rx="3" fill="#333" />
              {/* Pen Tip */}
              <path d="M186 130 L180 135 L192 135 Z" fill="#333" /> 
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Journal;