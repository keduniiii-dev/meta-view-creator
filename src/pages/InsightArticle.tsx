import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle2, ExternalLink, Lightbulb, ListChecks } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotFound from "./NotFound";
import { getInsightBySlug, isInsightIndexable } from "@/content/insights";
import type { InsightBlock } from "@/content/insights/types";
import { formatArticleDate } from "@/lib/articlesApi";
import { BASE_URL } from "@/lib/constants";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";

function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 id={block.id} className="scroll-mt-28 text-2xl md:text-3xl font-heading font-bold text-foreground mt-14 mb-4">{block.text}</h2>;
    case "h3":
      return <h3 className="text-xl font-heading font-semibold text-foreground mt-8 mb-2">{block.text}</h3>;
    case "p":
      return <p className="text-lg leading-relaxed text-muted-foreground mb-5">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-primary text-lg text-muted-foreground">
          {block.items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      );
    case "image":
      return (
        <figure className="my-10">
          <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" className="w-full h-auto rounded-2xl border border-border" />
          <figcaption className="mt-3 text-sm text-muted-foreground">{block.caption}</figcaption>
        </figure>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-muted">
              <tr>{block.headers.map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold text-foreground">{h}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  {r.map((c, i) => i === 0
                    ? <th key={i} scope="row" className="px-4 py-3 font-semibold text-foreground">{c}</th>
                    : <td key={i} className="px-4 py-3 text-muted-foreground">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return <p className="my-6 rounded-xl border-l-4 border-primary bg-primary/5 p-4 text-base text-foreground">{block.text}</p>;
    case "useCase":
      return (
        <div className="my-6 rounded-2xl border border-border bg-card p-6">
          <Badge variant="outline" className="mb-3 border-primary/40 text-primary">Hypothetical</Badge>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-4">{block.title}</h3>
          <dl className="space-y-3 text-muted-foreground">
            <div><dt className="font-semibold text-foreground">Challenge</dt><dd>{block.challenge}</dd></div>
            <div><dt className="font-semibold text-foreground">Possible visualisation approach</dt><dd>{block.approach}</dd></div>
            <div><dt className="font-semibold text-foreground">Potential business value</dt><dd>{block.value}</dd></div>
          </dl>
        </div>
      );
    case "checklist":
      return (
        <div className="my-8 rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 text-xl font-heading font-semibold text-foreground mb-4"><ListChecks className="h-5 w-5 text-primary" />{block.title}</h3>
          <ul className="space-y-3">
            {block.items.map((i) => (
              <li key={i} className="flex gap-3 text-muted-foreground"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" /><span>{i}</span></li>
            ))}
          </ul>
        </div>
      );
    case "faq":
      return (
        <Accordion type="single" collapsible className="my-6">
          {block.items.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-foreground">{f.q}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
  }
}

const InsightArticlePage = () => {
  const { slug } = useParams();
  const article = getInsightBySlug(slug);
  if (!article) return <NotFound />;

  const indexable = isInsightIndexable(article);
  const url = `${BASE_URL}/blog/${article.slug}`;
  const image = `${BASE_URL}${article.heroImage.src.startsWith("/") ? "" : "/"}${article.heroImage.src}`;
  const faq = article.body.find((b) => b.type === "faq");

  return (
    <>
      <Helmet defer={false}>
        <title>{article.seo.metaTitle} | Twinblueprint</title>
        <meta name="description" content={article.seo.metaDescription} />
        <link rel="canonical" href={url} />
        {!indexable && <meta name="robots" content="noindex, nofollow, noarchive" />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.seo.metaTitle} />
        <meta property="og:description" content={article.seo.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.seo.metaTitle} />
        <meta name="twitter:description" content={article.seo.metaDescription} />
        <meta name="twitter:image" content={image} />
        <script type="application/ld+json">{JSON.stringify(getArticleSchema({
          title: article.title, description: article.seo.metaDescription, image, author: article.author,
          publishedAt: article.publishedAt, url, category: article.category, tags: [],
        }))}</script>
        <script type="application/ld+json">{JSON.stringify(getBreadcrumbSchema([
          { name: "Home", url: BASE_URL }, { name: "Blog", url: `${BASE_URL}/blog` }, { name: article.title, url },
        ]))}</script>
        {faq && faq.type === "faq" && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          })}</script>
        )}
      </Helmet>
      <Navbar />
      <main className="bg-background">
        <article>
          <header className="bg-hero pt-32 pb-12">
            <div className="container max-w-3xl">
              {!indexable && (
                <p className="mb-4 inline-block rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Draft - Pre-production preview
                </p>
              )}
              <Badge className="mb-4 bg-primary/10 text-primary border-0">{article.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-hero-foreground leading-tight text-balance mb-6">{article.title}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-hero-muted">
                <span className="flex items-center gap-2"><User className="h-4 w-4" />{article.author}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatArticleDate(article.publishedAt)}</span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{article.readingTime}</span>
              </div>
            </div>
            <figure className="container max-w-5xl mt-10">
              <img src={article.heroImage.src} alt={article.heroImage.alt} width={1600} height={912} fetchPriority="high" className="w-full h-auto rounded-2xl border border-border" />
              {article.heroImage.caption && <figcaption className="mt-3 text-sm text-hero-muted">{article.heroImage.caption}</figcaption>}
            </figure>
          </header>

          <div className="container max-w-3xl py-12 md:py-16">
            <Link to="/blog"><Button variant="ghost" className="pl-0 mb-6 text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Button></Link>

            <p className="text-xl leading-relaxed text-foreground mb-10 text-pretty">{article.summary}</p>

            <aside aria-labelledby="key-takeaways" className="mb-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8">
              <h2 id="key-takeaways" className="flex items-center gap-2 text-xl font-heading font-bold text-foreground mb-4"><Lightbulb className="h-5 w-5 text-primary" />Key takeaways</h2>
              <ul className="space-y-3">
                {article.keyTakeaways.map((k) => (
                  <li key={k} className="flex gap-3 text-foreground"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" /><span>{k}</span></li>
                ))}
              </ul>
            </aside>

            {article.body.map((b, i) => <Block key={i} block={b} />)}

            <section aria-labelledby="sources" className="mt-14 border-t border-border pt-8">
              <h2 id="sources" className="text-xl font-heading font-bold text-foreground mb-4">Sources and further reading</h2>
              <ol className="space-y-2 list-decimal pl-5 text-muted-foreground">
                {article.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">{s.title}<ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
                    <span> - {s.publisher}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="related" className="mt-10 rounded-2xl border border-border bg-muted p-6">
              <h2 id="related" className="text-lg font-heading font-bold text-foreground mb-3">Related reading</h2>
              <ul className="space-y-2">
                {article.relatedSlugs.map((r) => (
                  <li key={r.href}><Link to={r.href} className="text-primary hover:underline">{r.title} →</Link></li>
                ))}
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-3">{article.cta.heading}</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{article.cta.copy}</p>
              <Button asChild variant="outline">
                <a href={article.cta.href} target="_blank" rel="noopener noreferrer">{article.cta.label}<ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </section>
          </div>
        </article>
      </main>
    </>
  );
};

export default InsightArticlePage;
