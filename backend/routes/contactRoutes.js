const express = require("express");
const { submitContact } = require("../controllers/contactController");
const validate = require("../middleware/validate");
const { contactSchema } = require("../validators/contactValidator");

const router = express.Router();

router.post("/contact", validate(contactSchema), submitContact);

module.exports = router;
