import { useState, useEffect, lazy, Suspense } from "react";
import { Container, Row, Col } from "react-bootstrap"
import { ArrowRightCircle } from "react-bootstrap-icons"
import headerImg from"../assets/img/header-img.png"
import { useTranslation } from "../TranslationContext"; // adjust path if needed

const Snowfall = lazy(() => import("./Snowfall.jsx"));

export const Banner = () => {
    const { t } = useTranslation(); // ⬅️ add this
    const [loopNum, setLoopNum] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const toRotate = [t("journey")]
    const [text, setText] = useState('')
    const [delta, setDelta] = useState(300- Math.random()*100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(()=>{
            tick();
        },delta)

        return() => {clearInterval(ticker)};
    },[text])

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0,text.length + 1)

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta /2)
    }

    if(!isDeleting && updatedText === fullText){
        setIsDeleting(true);
        setDelta(period);
    }
    else if(isDeleting && updatedText === ''){
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setDelta(500);
    }
}

    return (
        <section className="banner" id="home">
                         <Suspense fallback={null}>
                             <Snowfall />
                         </Suspense>
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}> 
                    <span className="tagline">{t("welcome_tagline")}</span>
                    <h1>{t("learn_with_fun")}<br /><span className="wrap">{text}</span></h1>
                    <p>{t("excel_for_excellence")}</p>
                                        <button className="btn btn-primary" onClick={() => console.log('connect')}>
                                            {t("lets_connect")} <ArrowRightCircle size={25}></ArrowRightCircle>
                                        </button>
                    </Col>
                    <Col xs={12} md={6} xl={5}>
                    <img src={headerImg} alt="Header img" loading="eager" />

                    </Col>
                </Row>
            </Container>
        </section>
    )
}