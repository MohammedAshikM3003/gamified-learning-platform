const { sendContactEmail } = require("../services/emailService");
const { saveContactMessage } = require("../services/contactStorage");

const submitContact = async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  try {
    await Promise.all([
      sendContactEmail({ firstName, lastName, email, phone, message }),
      saveContactMessage({ firstName, lastName, email, phone, message }),
    ]);

    res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact };
