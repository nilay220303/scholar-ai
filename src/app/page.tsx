import Link from 'next/link';
import {
  FileText,
  Search,
  Tags,
  Quote,
  GitCompareArrows,
  Laptop,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/header';

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Semantic Search',
    description: 'Find relevant passages with contextual understanding, not just keywords.',
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'AI Summarization',
    description: 'Get concise, abstract-like summaries of your research papers in seconds.',
  },
  {
    icon: <Tags className="h-8 w-8 text-primary" />,
    title: 'Keyword Extraction',
    description: 'Instantly identify key terms and phrases to grasp core concepts quickly.',
  },
  {
    icon: <Quote className="h-8 w-8 text-primary" />,
    title: 'Citation Generation',
    description: 'Automatically generate citations in various formats (APA, MLA, etc.).',
  },
  {
    icon: <GitCompareArrows className="h-8 w-8 text-primary" />,
    title: 'Multi-Document Comparison',
    description: 'Analyze multiple papers to find overlapping themes and conflicting insights.',
  },
  {
    icon: <Laptop className="h-8 w-8 text-primary" />,
    title: 'Responsive UI',
    description: 'Seamless experience on desktop, tablet, and mobile with dark and light modes.',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-24 sm:py-32 text-center">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4">
            Transform Text into Knowledge.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
            Upload, search, and analyze research papers with our state-of-the-art AI bot. Go from information overload to deep insights in minutes.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/research">Start Research</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container py-16 sm:py-24 bg-secondary dark:bg-transparent rounded-lg mb-16">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">
              A Powerful Toolkit for Researchers
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground mt-4">
              Everything you need to accelerate your literature review and analysis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-card/50 dark:bg-card/70 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
