import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// import BrainCanvas from '../components/BrainCanvas';
import "./home_page.css"; // Assuming you have a CSS file for styles
import TriangleBrain from "../../components/TriangleBrain";
import About from "./About";
import Features from "./features";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const mainRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {},
        },
      })
      .to(sceneRef.current, {
        x: "50vw",
        y: "100vh",
        ease: "none",
      })
      .to(sceneRef.current, {
        x: "25vw",
        y: "200vh",
        // scale: 1.25,
        ease: "none",
      });
  }, []);

  return (
    <>
      <div ref={mainRef}>
        <div className="home-page">
          <div style={{ width: "50%", height: "100vh" }} ref={sceneRef}>
            <Canvas camera={{ position: [0, 0, 6] }}>
              <TriangleBrain /> 
            </Canvas>
          </div>
          <div className="right-side-home">
            <h2 className="">Welcome to MindMirror 🧠</h2>
            <p className="">Your AI-powered mental wellness companion.</p>

            <Link to="/journal">
              <button className="">Start Journaling</button>
            </Link>
          </div>
        </div>
        <div className="home-page">
          <About/>
        </div>

        <div className="features-section">
          <Features/>
        </div>
      </div>
    </>
  );
};

export default Home;
