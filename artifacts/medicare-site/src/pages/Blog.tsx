import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, BookOpen, Calendar } from "lucide-react";
import { getAllPosts } from "@/lib/blogPosts";

const posts = getAllPosts();

export default function Blog() {
  return (
    <div>
      <SEOHead
        title="Medicare Education Blog | Medicare with Ashley | San Diego"
        description="Free Medicare guides and educational articles for San Diego County residents. Learn about Medicare Advantage, Medigap, Part D, turning 65, and more from local broker Ashley Watson."
        canonical="/blog/"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 lg:py-20" data-testid="blog-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary font-semibold uppercase tracking-wide text-sm mb-3">Resources</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-5">
            Medicare Education &amp; Resources
          </h1>
          <p className="text-foreground/70 text-xl max-w-2xl mx-auto leading-relaxed">
            Free guides written by Ashley Watson to help San Diego County residents understand Medicare — clearly, honestly, and without the jargon.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 bg-background" data-testid="blog-posts">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">Articles coming soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.slug} className="border border-border shadow-sm hover:shadow-md transition-shadow bg-white" data-testid={`blog-card-${post.slug}`}>
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-1">
                        {post.dateFormatted && (
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.dateFormatted}
                          </div>
                        )}
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-3 leading-snug">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        {post.description && (
                          <p className="text-foreground/70 leading-relaxed mb-4">
                            {post.description}
                          </p>
                        )}
                        <span className="inline-flex items-center text-primary font-medium text-sm" aria-hidden="true">
                          Read article <ChevronRight className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground" data-testid="blog-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Have a Medicare Question?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Ashley is available 7 days a week to answer questions and help you find the right plan — at no cost to you.
          </p>
          <Link href="/schedule">
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-10 py-4 h-auto rounded-full">
              Book a Free Consultation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
