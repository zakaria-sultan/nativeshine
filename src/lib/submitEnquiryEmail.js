/**
 * Sends enquiry payloads to info@nativeshine.co.uk via FormSubmit (no backend).
 * First-time use: FormSubmit may send a confirmation email to activate the address.
 * @see https://formsubmit.co/ajax-documentation
 */

export const NATIVE_SHINE_ENQUIRY_EMAIL = "info@nativeshine.co.uk";

const ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(NATIVE_SHINE_ENQUIRY_EMAIL)}`;

/**
 * @param {object} fields — name, email, phone?, service, message
 * @param {{ formLabel?: string }} options
 */
export async function submitEnquiryEmail(fields, options = {}) {
  const { formLabel = "Website enquiry" } = options;

  const payload = {
    name: fields.name?.trim() ?? "",
    email: fields.email?.trim() ?? "",
    phone: fields.phone?.trim() ?? "",
    service: fields.service?.trim() ?? "",
    message: fields.message?.trim() ?? "",
    _subject: `[NativeShine] ${formLabel} — ${fields.name?.trim() || "Unknown"}`,
    _template: "table",
    _captcha: "false",
  };

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    /* ignore */
  }

  if (!response.ok) {
    const msg =
      typeof body.message === "string"
        ? body.message
        : "Could not send your message. Please try again.";
    throw new Error(msg);
  }

  if (body && body.success === false) {
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Could not send your message.",
    );
  }

  return body;
}
