import { describe, expect, it } from "vitest";
import { emailHtmlToText, emailTextToHtml, hasEscapedEmailMarkup } from "@/lib/email-text";

describe("email markup display", () => {
  it("converts escaped backend HTML to readable paragraphs", () => {
    const escaped = "&lt;p&gt;Dear Sarah,&lt;/p&gt;&lt;p&gt;Let's talk.&lt;br&gt;Twinblueprint&lt;/p&gt;";
    expect(hasEscapedEmailMarkup(escaped)).toBe(true);
    expect(emailHtmlToText(escaped)).toBe("Dear Sarah,\n\nLet's talk.\nTwinblueprint");
    expect(emailTextToHtml(emailHtmlToText(escaped))).toBe("<p>Dear Sarah,</p><p>Let&#39;s talk.<br>Twinblueprint</p>");
  });
  it("handles a repeatedly encoded template", () => {
    expect(emailHtmlToText("&amp;lt;p&amp;gt;Hello&amp;lt;/p&amp;gt;")).toBe("Hello");
  });
  it("preserves legitimate escaped text in normal email HTML", () => {
    const html = "<p>Gensler &lt;Partners&gt; &amp; Co</p>";
    expect(hasEscapedEmailMarkup(html)).toBe(false);
    expect(emailHtmlToText(html)).toBe("Gensler <Partners> & Co");
  });
});
