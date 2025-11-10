import React from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import hero_banner from "../../assets/assets/hero_banner.jpg";

const Home = () => {
  return (
    <>
      <Navbar />
      <section className="hero">
        <img src={hero_banner} alt="Hero Banner" className="hero-image" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Unlimited movies, TV shows, and more.</h1>
            <h1>Nagasundharam</h1>
            <p>Devops Engineer</p>
            <p>Bannari Amman Institute of Technology</p>
            <button className="btn btn-primary">Project Ready  Now</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
