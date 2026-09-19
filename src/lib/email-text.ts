export function hasEscapedEmailMarkup(value: string): boolean {
  return /&(?:amp;)*(?:lt;|#0*60;|#x0*3c;)\s*\/?(?:p|br|div|span|html|body|h[1-6]|ul|ol|li|table|tr|td|strong|em|a)\b/i.test(value);
}

/** Convert stored email HTML into editable text without inserting it into the page. */
export function emailHtmlToText(html: string): string {
  let markup = html;
  // Older API responses escaped the whole template, sometimes more than once.
  // Decode only recognizable email markup; the final result is always plain text.
  for (let pass = 0; pass < 3 && hasEscapedEmailMarkup(markup); pass++) {
    markup = new DOMParser().parseFromString(markup, "text/html").body.textContent || "";
  }
  const doc = new DOMParser().parseFromString(markup, "text/html");
  doc.querySelectorAll("script, style, head").forEach(node => node.remove());
  doc.querySelectorAll("br").forEach(node => node.replaceWith("\n"));
  doc.querySelectorAll("li").forEach(node => node.prepend("• "));
  doc.querySelectorAll("a[href]").forEach(node => {
    const url = node.getAttribute("href") || "";
    if (/^(https?:|mailto:)/i.test(url) && node.textContent !== url) node.append(` (${url})`);
  });
  doc.querySelectorAll("p, div, li, h1, h2, h3, h4, h5, h6, blockquote, tr").forEach(node => node.append("\n\n"));
  return (doc.body.textContent || "").replace(/\u00a0/g, " ").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** HTML is generated only at the API boundary, preserving paragraphs and line breaks. */
export function emailTextToHtml(text: string): string {
  const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]!));
  if (!text.trim()) return "";
  return text.trim().replace(/\r\n?/g, "\n").split(/\n\s*\n/).map(paragraph => `<p>${escape(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
}
