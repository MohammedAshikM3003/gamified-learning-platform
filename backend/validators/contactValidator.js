const { z } = require("zod");

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(50).optional().or(z.literal("")),
  lastName: z.string().trim().min(1).max(50).optional().or(z.literal("")),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(1000),
});

module.exports = { contactSchema };
