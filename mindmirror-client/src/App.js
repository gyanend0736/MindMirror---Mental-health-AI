import React,{useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Journal from './pages/journal';
import Dashboard from './pages/Dashboard/Dashboard';
import ChatButton from './components/chatbutton'; 
import Home from './pages/Home_page/Home'; 
import ChatWindow from './components/chatwindow'; 
import './App.css'; 

function App() {
  const [isChatOpen, setChatOpen] = useState(false); 

  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  return (
    <Router>
      <div className="whole-screen">
        <Header />
        <main className="here">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />

        <ChatButton onClick={toggleChat} /> 

        {isChatOpen && (
          <ChatWindow 
            onClose={toggleChat} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;