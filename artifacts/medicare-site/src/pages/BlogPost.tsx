import SEOHead from "@/components/SEOHead";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Calendar, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getBlogStructuredData } from "@/data/blogStructuredData";
import { getPost } from "@/lib/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">That article doesn't exist or may have been moved.</p>
        <Link href="/blog">
          <Button className="rounded-full bg-primary text-primary-foreground px-8 py-3 h-auto">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const structuredData = getBlogStructuredData(post.slug);

  return (
    <div>
      <SEOHead
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}/`}
        ogType={structuredData ? "article" : "website"}
        schemaJson={structuredData?.articleSchema}
      />
      {structuredData?.faqSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(structuredData.faqSchema)}
          </script>
        </Helmet>
      )}

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 lg:py-16" data-testid="blogpost-header">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-primary text-sm font-medium hover:underline mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all articles
          </Link>
          {post.dateFormatted && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
              <Calendar className="h-3.5 w-3.5" />
              {post.dateFormatted}
            </div>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <img
              src="/ashley-watson.webp"
              alt="Ashley Watson"
              className="w-10 h-10 rounded-full object-cover object-top"
              loading="lazy"
              width="40"
              height="40"
            />
            <div>
              <p className="font-semibold text-foreground text-sm">Ashley Watson</p>
              <p className="text-muted-foreground text-xs">Licensed Medicare Broker · San Diego, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-12 bg-background" data-testid="blogpost-body">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-foreground
              prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-table:border prose-table:border-border
              prose-th:bg-accent/50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:p-3 prose-td:border prose-td:border-border
              prose-li:text-foreground/80"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Author card */}
          <div className="mt-14 pt-10 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start gap-5 bg-accent/30 rounded-2xl p-6">
              <img
                src="/ashley-watson.webp"
                alt="Ashley Watson"
                className="w-20 h-20 rounded-2xl object-cover object-top shrink-0"
                loading="lazy"
                width="80"
                height="80"
              />
              <div>
                <p className="font-serif font-bold text-foreground text-xl mb-1">Ashley Watson</p>
                <p className="text-muted-foreground text-sm mb-3">
                  Licensed Medicare Broker · Medicare with Ashley · CA License #4052120
                </p>
                <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                  Ashley is an independent Medicare broker serving all of San Diego County. She helps clients compare Medicare Advantage, Medigap, and Part D plans — free of charge, seven days a week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/schedule">
                    <Button className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 h-auto text-sm">
                      Book a Free Consultation
                    </Button>
                  </Link>
                  <a href="tel:+16199472325">
                    <Button variant="outline" className="rounded-full border-primary text-primary px-6 py-2.5 h-auto text-sm">
                      <Phone className="mr-1.5 h-4 w-4" />
                      (619) 947-2325
                    </Button>
                  </a>
                  <Link href="/free-consultation">
                    <Button variant="outline" className="rounded-full border-primary text-primary px-6 py-2.5 h-auto text-sm">
                      Use the Quick Consultation Form
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary text-primary-foreground" data-testid="blogpost-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
            Questions About Your Medicare Options?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
            Ashley offers free, no-pressure consultations for San Diego County residents. Get personalized answers for your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
                Schedule a Free Review
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" className="border-2 border-white/70 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 h-auto rounded-full bg-transparent">
                Read More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
