import { useState } from "react";
import { Col } from "react-bootstrap";


export const ProjectCard = ({ title, description, imgUrl, extraText }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped(!flipped);
  };

  return (
    <Col size={12} sm={6} md={4}>
      <div className={`flip-card ${flipped ? "flipped" : ""}`} onClick={handleClick}>
        <div className="flip-card-inner">
          {/* Front Side */}
          <div className="flip-card-front">
            <div className="proj-imgbx">
              <img src={imgUrl} alt={title} loading="lazy" />
              <div className="proj-txtx">
                <h4>{title}</h4>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="flip-card-back">
            <div className="proj-txtx">
              <h4>{title}</h4>
              <span>{description}</span>
              {extraText && <p className="extra-text">{extraText}</p>}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};
