import { render, screen } from "@testing-library/react";
import { Contact } from "../components/Contact";
import { TranslationProvider } from "../TranslationContext";
import { ToastProvider } from "../context/ToastContext";

vi.mock("../services/contactService", () => ({
  submitContactForm: vi.fn().mockResolvedValue({
    success: true,
    message: "Message sent successfully.",
  }),
}));

describe("Contact component", () => {
  it("renders the contact form", () => {
    render(
      <TranslationProvider>
        <ToastProvider>
          <Contact />
        </ToastProvider>
      </TranslationProvider>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
  });
});
