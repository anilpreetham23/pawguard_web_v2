"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Share2 } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { PageShell, Section, Card, Reveal, Button } from "../components/pawguard";
import { GUIDES } from "./EducationPage";

export default function EducationDetailPage({ slug }: { slug: string }) {
  const guide = GUIDES.find((g) => g.slug === slug);

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
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
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
