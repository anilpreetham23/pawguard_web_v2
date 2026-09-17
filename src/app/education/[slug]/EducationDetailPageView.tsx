import Link from "next/link";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PageShell, Section, Card, Button } from "@/components/ui/pawguard";
import { GUIDES } from "../EducationPageView";
import { fetchServerCachedBlogPostBySlug } from "@/lib/api/server-public-data";

export default async function EducationDetailPage({ slug }: { slug: string }) {
  const remotePost = await fetchServerCachedBlogPostBySlug(slug);
  const staticGuide = GUIDES.find((g) => g.slug === slug);

  const guide = remotePost
    ? {
        category: remotePost.category ? remotePost.category.replace("-", " ").toUpperCase() : "GUIDE",
        title: remotePost.title,
        description: remotePost.excerpt || (remotePost.body ? remotePost.body.slice(0, 150) : ""),
        readTime: "5 min read",
        sections: [
          {
            heading: remotePost.title,
            content: remotePost.body || "",
          },
        ],
        icon: BookOpen,
      }
    : staticGuide
    ? {
        category: staticGuide.category,
        title: staticGuide.title,
        description: staticGuide.description,
        readTime: staticGuide.readTime,
        sections: staticGuide.sections,
        icon: staticGuide.icon,
      }
    : null;

  if (!guide) {
    return (
      <PageShell>
        <main id="main-content" className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+3rem)] text-center">
          <h1 className="text-3xl font-bold text-foreground">Guide Not Found</h1>
          <p className="text-muted-foreground mt-2 mb-6">The requested education guide does not exist.</p>
          <Link href="/education">
            <Button variant="primary" size="md">Browse All Guides</Button>
          </Link>
        </main>
      </PageShell>
    );
  }

  const Icon = guide.icon;

  return (
    <PageShell>
      <main id="main-content" className="flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-height)+1.5rem)]">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors duration-fast group mb-6"
          >
            <ArrowLeft size={15} className="transition-transform duration-fast group-hover:-translate-x-0.5" />
            Back to all guides
          </Link>
        </div>

        <PageHeader
          eyebrow={guide.category}
          title={guide.title}
          subtitle={guide.description}
        />

        <Section bg="default">
          <div className="max-w-[800px] mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-border pb-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <Icon size={16} />
                {guide.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {guide.readTime}
              </span>
            </div>

            <div className="flex flex-col gap-8">
              {guide.sections.map((sec, i) => (
                <Card key={i} variant="default" className="p-6 flex flex-col gap-3">
                  <h2 className="font-serif font-bold text-xl text-foreground">
                    {sec.heading}
                  </h2>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </Card>
              ))}
            </div>

            <div className="border-t border-border pt-6 flex items-center justify-between">
              <Link href="/education">
                <Button variant="outline" size="sm">
                  ← More Guides
                </Button>
              </Link>
              <Link href="/adopt">
                <Button variant="primary" size="sm">
                  Adopt a Rescue Dog
                </Button>
              </Link>
            </div>
          </div>
        </Section>
      </main>
    </PageShell>
  );
}
