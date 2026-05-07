import meter1 from "../assets/img/meter1.svg";
import meter2 from "../assets/img/meter2.svg";
import meter3 from "../assets/img/meter3.svg";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";
import colorSharp from "../assets/img/color-sharp.png"
import { useTranslation } from "../TranslationContext"; // adjust path if needed
import { useMemo } from "react";

export const AboutUs = () => {
  const { t } = useTranslation(); // ⬅️ add this
  const responsive = useMemo(() => ({
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }), []);

  return (
    <section className="AboutUs" id="about">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
              <h2>{t("scores")}</h2>
              <p>{t("ScoresDescription")}</p>
              <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                <div className="item mx-5">
                  <img src={meter1} alt="Image" loading="lazy" />
                  <h5>{t("TaskDone")}</h5>
                </div>
                <div className="item mx-5">
                  <img src={meter2} alt="Image" loading="lazy" />
                  <h5>{t("accuracy")}</h5>
                </div>
                <div className="item mx-5">
                  <img src={meter3} alt="Image" loading="lazy" />
                  <h5>{t("improvement")}</h5>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <img className="background-image-left" src={colorSharp} alt="Image" loading="lazy" />
    </section>
  )
}