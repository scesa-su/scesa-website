type Mailto = { to: string; subject?: string; body?: string };

/** RFC 6068 mailto link: percent-encoded (spaces as %20, not +) with CRLF line breaks in the body. */
export function mailtoHref({ to, subject, body }: Mailto) {
  const params = [
    subject && `subject=${encodeURIComponent(subject)}`,
    body && `body=${encodeURIComponent(body.replace(/\r?\n/g, "\r\n"))}`,
  ].filter(Boolean);
  return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
}
