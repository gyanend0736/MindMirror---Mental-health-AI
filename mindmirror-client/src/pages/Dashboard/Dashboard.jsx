import React, { useState, useEffect } from 'react';


/**
 * @param {Array<Object>} weeklyData 
 * @returns {number} 
 */
const calculateAverageMood = (weeklyData) => {
    if (weeklyData.length === 0) return 0;
    const totalScore = weeklyData.reduce((sum, entry) => sum + entry.moodScore, 0);
    return totalScore / weeklyData.length;
};

/**
 * @param {Array<Object>} weeklyData 
 * @returns {string} 
 */
const findDominantEmotion = (weeklyData) => {
    if (weeklyData.length === 0) return 'N/A';
    
    const counts = {};
    weeklyData.forEach(entry => {
        const emotion = entry.emotion || 'neutral';
        counts[emotion] = (counts[emotion] || 0) + 1;
    });

    let dominantEmotion = '';
    let maxCount = 0;
    for (const emotion in counts) {
        if (counts[emotion] > maxCount) {
            maxCount = counts[emotion];
            dominantEmotion = emotion;
        }
    }
    return dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1);
};



const Dashboard = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const [analysis, setAnalysis] = useState({
        averageScore: 0,
        dominantEmotion: 'N/A',
        daysRecorded: 0,
    });
    
    const fetchWeeklyData = () => {
        const allLogs = JSON.parse(localStorage.getItem('mindHealthLog') || '[]');
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentData = allLogs.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= sevenDaysAgo;
        });

        setWeeklyData(recentData);
        
        const avg = calculateAverageMood(recentData);
        const dominant = findDominantEmotion(recentData);
        
        setAnalysis({
            averageScore: parseFloat(avg.toFixed(1)),
            dominantEmotion: dominant,
            daysRecorded: recentData.length,
        });
    };

    
    useEffect(() => {
        fetchWeeklyData();
        
    }, []);

    
    const dashboardStyles = {
        padding: '3rem',
        background: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, sans-serif',
    };

    const cardStyles = {
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
    };
    
    
    return (
        <div style={dashboardStyles}>
            <h2>🧠 Weekly Mind Health Dashboard</h2>
            <p>Based on your last {analysis.daysRecorded} journal entries.</p>
            
            {analysis.daysRecorded === 0 ? (
                <p style={{ marginTop: '20px', color: '#6a5acd' }}>
                    Start writing in your journal to see your weekly health summary!
                </p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                    
                    <div style={{...cardStyles, borderBottom: '5px solid #6a5acd'}}>
                        <h3>Average Mood Score</h3>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#6a5acd' }}>
                            {analysis.averageScore} / 10
                        </p>
                        <p style={{ color: '#666' }}>
                            Your overall sentiment this week.
                        </p>
                    </div>

                    <div style={{...cardStyles, borderBottom: '5px solid #ffb347'}}>
                        <h3>Dominant Emotion</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffb347' }}>
                            {analysis.dominantEmotion}
                        </p>
                        <p style={{ color: '#666' }}>
                            The emotion you expressed most often.
                        </p>
                    </div>

                    <div style={{...cardStyles, borderBottom: '5px solid #8bc34a'}}>
                        <h3>Days Recorded</h3>
                        <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#8bc34a' }}>
                            {analysis.daysRecorded}
                        </p>
                        <p style={{ color: '#666' }}>
                            Entries submitted in the last 7 days.
                        </p>
                    </div>
                </div>
            )}
            
            <div style={{ marginTop: '40px' }}>
                <h3>Daily Breakdown (Last 7 Days)</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {weeklyData.map((entry, index) => (
                        <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{entry.date}</strong>
                            <span>Mood: {entry.emotion}</span>
                            <span>Score: {entry.moodScore}/10</span>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
};

export default Dashboard;