import { request } from "../utils/request";

export const submitContactForm = (payload) =>
  request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
