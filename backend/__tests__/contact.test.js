const request = require("supertest");

jest.mock("../services/emailService", () => ({
  sendContactEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../services/contactStorage", () => ({
  saveContactMessage: jest.fn().mockResolvedValue(undefined),
}));

const app = require("../app");

describe("POST /contact", () => {
  it("returns 200 for valid payload", async () => {
    const response = await request(app)
      .post("/contact")
      .send({
        firstName: "Ada",
        lastName: "Lovelace",
        email: "ada@example.com",
        phone: "1234567890",
        message: "Hello LearnCraft team.",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("returns 400 for invalid payload", async () => {
    const response = await request(app).post("/contact").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });
});
