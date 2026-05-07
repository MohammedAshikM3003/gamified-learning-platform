const { getFirestore } = require("../config/firestore");

const saveContactMessage = async ({ firstName, lastName, email, phone, message }) => {
  const db = getFirestore();

  const payload = {
    firstName: firstName || "",
    lastName: lastName || "",
    email,
    phone: phone || "",
    message,
    createdAt: new Date().toISOString(),
  };

  await db.collection("contactMessages").add(payload);

  return payload;
};

module.exports = { saveContactMessage };
