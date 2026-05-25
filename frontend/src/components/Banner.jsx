import { useState, useEffect, lazy, Suspense } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import headerImg from "../assets/img/header-img.png";

const Snowfall = lazy(() => import("./Snowfall.jsx"));

export const Banner = () => {
    const navigate = useNavigate();
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const toRotate = ["Your Journey Begins Here", "Gamified Learning", "Master New Skills"];
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const period = 2000;

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => { clearInterval(ticker) };
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setDelta(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setDelta(500);
        }
    };

    return (
        <section className="banner" id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative' }}>
            <Suspense fallback={null}>
                <Snowfall />
            </Suspense>
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline" style={{ 
                            background: 'var(--gradient-primary)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            letterSpacing: '2px',
                            padding: '8px 16px',
                            display: 'inline-block',
                            marginBottom: '16px'
                        }}>WELCOME TO LEARNCRAFT</span>
                        
                        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
                            Learn, Play, Master <br />
                            <span className="wrap" style={{ color: 'var(--primary)' }}>{text}</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '80%' }}>
                            Excel for excellence. Experience a modern, gamified learning platform that adapts to your skills, rewards your progress, and turns education into an epic quest.
                        </p>
                        
                        <button 
                            className="btn-ai-action" 
                            style={{ 
                                marginTop: '20px', 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                width: 'fit-content',
                                maxWidth: '320px',
                                padding: '14px 26px',
                                fontSize: '16px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                boxShadow: 'var(--shadow-glow)'
                            }} 
                            onClick={() => navigate('/signup')}
                        >
                            START PLAYING <ArrowRightCircle size={25} />
                        </button>
                    </Col>
                    
                    <Col xs={12} md={6} xl={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img 
                            src={headerImg} 
                            alt="Header img" 
                            loading="eager" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '500px', 
                                objectFit: 'contain',
                                animation: 'updown 3s linear infinite',
                                filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.3))'
                            }} 
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};