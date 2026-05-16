const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Minimum digits in phone (ignoring spaces/punctuation) */
const PHONE_DIGITS_MIN = 10;

function countDigits(s) {
  return (s.match(/\d/g) || []).length;
}

/**
 * @returns {Record<string, string>} fieldKey → error message (empty object if valid)
 */
export function validateContactForm(data) {
  const errors = {};
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const service = data.service?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && countDigits(phone) < PHONE_DIGITS_MIN) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!service) errors.service = "Please select a service.";
  if (!message) errors.message = "Please enter a message.";

  return errors;
}

export function validateQuoteForm(data) {
  const errors = {};
  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const service = data.service?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (countDigits(phone) < PHONE_DIGITS_MIN) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!service) errors.service = "Please select a service.";
  if (!message) errors.message = "Please tell us about your project.";

  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
