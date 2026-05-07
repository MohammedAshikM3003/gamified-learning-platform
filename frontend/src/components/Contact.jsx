import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.png";
import "animate.css";
import TrackVisibility from "react-on-screen";
import { useTranslation } from "../TranslationContext"; // ⬅️ import translation hook
import { submitContactForm } from "../services/contactService";
import { useToast } from "../context/ToastContext";
import { Input } from "./common/Input";
import { Textarea } from "./common/Textarea";
import { Button } from "./common/Button";

export const Contact = () => {
  const { t } = useTranslation(); // ⬅️ use translation

  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState(t("send"));
  const [status, setStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);
  const { showToast } = useToast();

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors([]);
    setButtonText(t("sending"));
    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formDetails);
      setButtonText(t("send"));
      setFormDetails(formInitialDetails);

      setStatus({ success: true, message: result.message });
      showToast(result.message || "Message sent successfully.", "success");
    } catch (err) {
      if (Array.isArray(err.details) && err.details.length > 0) {
        setFieldErrors(err.details);
      }
      setStatus({
        success: false,
        message: err.message || t("serverError"),
      });
      showToast(err.message || t("serverError"), "error");
      setButtonText(t("send"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact" id="contactus">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={`float-zigzag ${
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }`}
                  src={contactImg}
                  alt={t("title")}
                />
              )}
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>{t("title")}</h2>
                  <form onSubmit={handleSubmit}>
                    <Row>
                      <Col size={12} sm={6} className="px-1">
                        <Input
                          id="firstName"
                          label={t("firstName")}
                          value={formDetails.firstName}
                          placeholder={t("firstName")}
                          onChange={(e) =>
                            onFormUpdate("firstName", e.target.value)
                          }
                          autoComplete="given-name"
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <Input
                          id="lastName"
                          label={t("lastName")}
                          value={formDetails.lastName}
                          placeholder={t("lastName")}
                          onChange={(e) =>
                            onFormUpdate("lastName", e.target.value)
                          }
                          autoComplete="family-name"
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <Input
                          id="email"
                          label={t("email")}
                          type="email"
                          value={formDetails.email}
                          placeholder={t("email")}
                          onChange={(e) =>
                            onFormUpdate("email", e.target.value)
                          }
                          autoComplete="email"
                          required
                        />
                      </Col>
                      <Col size={12} sm={6} className="px-1">
                        <Input
                          id="phone"
                          label={t("phone")}
                          type="tel"
                          value={formDetails.phone}
                          placeholder={t("phone")}
                          onChange={(e) =>
                            onFormUpdate("phone", e.target.value)
                          }
                          autoComplete="tel"
                        />
                      </Col>
                      <Col size={12} className="px-1">
                        <Textarea
                          id="message"
                          label={t("message")}
                          value={formDetails.message}
                          placeholder={t("message")}
                          onChange={(e) =>
                            onFormUpdate("message", e.target.value)
                          }
                          required
                        />
                        <Button type="submit" isLoading={isSubmitting} variant="primary">
                          {isSubmitting ? t("sending") : buttonText}
                        </Button>
                      </Col>
                      {fieldErrors.length > 0 && (
                        <Col>
                          <ul className="contact-errors">
                            {fieldErrors.map((error) => (
                              <li key={`${error.field}-${error.message}`}>
                                {error.message}
                              </li>
                            ))}
                          </ul>
                        </Col>
                      )}
                      {status.message && (
                        <Col>
                          <p
                            className={
                              status.success === false ? "danger" : "success"
                            }
                          >
                            {status.message}
                          </p>
                        </Col>
                      )}
                    </Row>
                  </form>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
