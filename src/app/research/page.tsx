import { AppHeader } from '@/components/app-header';
import { ResearchClient } from './research-client';

export default function ResearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppHeader />
      <main className="flex-1">
        <ResearchClient />
      </main>
    </div>
  );
}
