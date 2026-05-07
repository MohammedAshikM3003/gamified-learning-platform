import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import flappyImg from "../assets/img/flappy.jpg";
import rocketImg from "../assets/img/rocket.png";
import tomjerryImg from "../assets/img/tomjerry.jpg";
import stonepaperImg from "../assets/img/stonepaper.png";
import cheeseImg from "../assets/img/cheese.jpg";
import candyImg from "../assets/img/candy.jpg";
import "./Sixth.css";
import Snowfall from "./Snowfall.jsx"
import profile from "../assets/img/profile.png";

function Sixth() {
  const [showGame, setShowGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // hide navbar when modal opens
  useEffect(() => {
    if (showGame) {
      document.body.classList.add("hide-navbar");
    } else {
      document.body.classList.remove("hide-navbar");
    }
  }, [showGame]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const handlePlay = (game) => {
    setSelectedGame(game);
    setShowGame(true);
  };

  return (
    <div className="sixth-page game-page">
      <Snowfall /> {/* ❌ Add this */}
      <div className="profile-pic">
        <img src={profile} alt="Profile" />
      </div>
      <h1 className="game-title">6th Class Games</h1>
      <div className="game-slider">
        <div className="game-slider-inner">
          <Slider {...settings}>
            {data.map((d, i) => (
              <div
                key={i}
                className="game-card"
              >
                {/* Image Section */}
                <div className="game-card-media">
                  <div className="game-card-avatar">
                    <img
                      src={d.img}
                      alt={d.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Name + Button */}
                <div className="game-card-body">
                  <p className="game-card-title">{d.name}</p>
                  <button
                    onClick={() => handlePlay(d)}
                    className="btn btn-secondary game-button"
                  >
                    ▶ Play Fullscreen
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <Modal
        show={showGame}
        onHide={() => setShowGame(false)}
        fullscreen
        centered
        contentClassName="p-0"
      >
        <Modal.Body style={{ padding: 0, position: "relative" }}>
          {/* Close button */}
          <button
            onClick={() => setShowGame(false)}
            className="btn btn-danger game-modal-close"
          >
            ✖
          </button>

          {/* Game iframe */}
          {selectedGame && (
            <iframe
              src={selectedGame.url}
              width="100%"
              height="100%"
              style={{
                border: "none",
                display: "block",
              }}
              title={selectedGame.name}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

const data = [
  {
    name: "Rocket Game 🚀",
    img: rocketImg,
    url: "https://subham20135.github.io/spacelab/",
  },
  {
    name: "Flappy Bird 🐦",
    img: flappyImg,
    url: "https://subham20135.github.io/birdgame/",
  },
  {
    name: "Archery Game",
    img: cheeseImg,
    url: "https://subham20135.github.io/arrow/ ",
  },
  {
    name: "Technology Game",
    img: tomjerryImg,
    url: "https://subham20135.github.io/computergame/",
  },
  {
    name: "Car Racing",
    img: stonepaperImg,
    url: "https://subham20135.github.io/cargame/",
  },
  {
    name: "Candy Catcher",
    img: candyImg,
    url: "https://subham20135.github.io/sweet/",
  },
];



export default Sixth;
