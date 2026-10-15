/** Send enquiries to the current database-configured contact email. */
export async function submitEnquiryEmail(fields, options = {}) {
  const { formLabel = "Website enquiry", recipient } = options;
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error("Contact details are unavailable. Please reload and try again.");
  }
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`;

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

  const response = await fetch(endpoint, {
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

  if (body && (body.success === false || body.success === "false")) {
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "Could not send your message.",
    );
  }

  if (body.success !== true && body.success !== "true") {
    throw new Error("The email service did not confirm delivery. Please try again.");
  }
  return body;
}
