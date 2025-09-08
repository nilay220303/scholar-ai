'use client';

import { useState, useMemo } from 'react';
import {
  FilePlus,
  FileText,
  Search,
  Tags,
  Quote,
  GitCompareArrows,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

import { pdfSummarization } from '@/ai/flows/pdf-summarization';
import { extractKeywords } from '@/ai/flows/keyword-extraction';
import { generateCitation } from '@/ai/flows/citation-generation';
import { semanticSearch } from '@/ai/flows/semantic-search';
import { multiDocumentComparison } from '@/ai/flows/multi-document-comparison';

type Document = {
  id: string;
  name: string;
  content: string;
};

type AnalysisResults = {
  summary?: string;
  keywords?: string[];
  searchResults?: string[];
  citation?: string;
  comparison?: string;
};

export function ResearchClient() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const [isAddDocOpen, setAddDocOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');

  const { toast } = useToast();

  const selectedDocuments = useMemo(
    () => documents.filter((doc) => selectedDocIds.has(doc.id)),
    [documents, selectedDocIds]
  );

  const handleAddDocument = () => {
    if (!newDocName.trim() || !newDocContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a name and content for the document.',
        variant: 'destructive',
      });
      return;
    }
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: newDocName,
      content: newDocContent,
    };
    setDocuments((prev) => [...prev, newDoc]);
    setNewDocName('');
    setNewDocContent('');
    setAddDocOpen(false);
    toast({
      title: 'Success',
      description: `Document "${newDoc.name}" added.`,
    });
  };
  
  const handleToggleSelection = (docId: string) => {
    setSelectedDocIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(docId)) {
            newSet.delete(docId);
        } else {
            newSet.add(docId);
        }
        return newSet;
    });
    setResults({});
  };

  const handleDeleteSelected = () => {
    setDocuments(docs => docs.filter(doc => !selectedDocIds.has(doc.id)));
    setSelectedDocIds(new Set());
    setResults({});
  }

  const runAnalysis = async (analysisType: string) => {
    setIsLoading(true);
    setResults((prev) => ({ ...prev, [analysisType]: undefined }));
    try {
      if (selectedDocuments.length === 0) throw new Error("No document selected.");
      const doc = selectedDocuments[0];

      if (analysisType === 'summary') {
        const res = await pdfSummarization({ pdfContent: doc.content });
        setResults((prev) => ({ ...prev, summary: res.summary }));
      } else if (analysisType === 'keywords') {
        const res = await extractKeywords({ text: doc.content });
        setResults((prev) => ({ ...prev, keywords: res.keywords }));
      } else if (analysisType === 'citation') {
        const res = await generateCitation({ documentText: doc.content, citationFormat });
        setResults((prev) => ({ ...prev, citation: res.citation }));
      } else if (analysisType === 'search') {
        if (!searchQuery.trim()) throw new Error("Search query is empty.");
        const res = await semanticSearch({ documentContent: doc.content, query: searchQuery });
        setResults((prev) => ({ ...prev, searchResults: res.relevantPassages }));
      } else if (analysisType === 'comparison') {
        if (selectedDocuments.length < 2) throw new Error("Select at least two documents to compare.");
        const res = await multiDocumentComparison({ documents: selectedDocuments.map(d => ({filename: d.name, content: d.content})) });
        setResults((prev) => ({...prev, comparison: res.comparison}));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ title: 'Analysis Failed', description: message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderSingleDocView = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
      <TabsList className="shrink-0">
        <TabsTrigger value="summary"><FileText className="w-4 h-4 mr-2" />Summary</TabsTrigger>
        <TabsTrigger value="keywords"><Tags className="w-4 h-4 mr-2" />Keywords</TabsTrigger>
        <TabsTrigger value="search"><Search className="w-4 h-4 mr-2" />Search</TabsTrigger>
        <TabsTrigger value="citation"><Quote className="w-4 h-4 mr-2" />Citation</TabsTrigger>
      </TabsList>
      <ScrollArea className="flex-1 mt-4">
        <TabsContent value="summary">
          <Button onClick={() => runAnalysis('summary')} disabled={isLoading}>
            {isLoading && results.summary === undefined ? <Icons.spinner className="mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
            Generate Summary
          </Button>
          {results.summary && <Card className="mt-4"><CardContent className="p-6 text-sm">{results.summary}</CardContent></Card>}
        </TabsContent>
        <TabsContent value="keywords">
          <Button onClick={() => runAnalysis('keywords')} disabled={isLoading}>
            {isLoading && results.keywords === undefined ? <Icons.spinner className="mr-2" /> : <Tags className="w-4 h-4 mr-2" />}
            Extract Keywords
          </Button>
          {results.keywords && <div className="mt-4 flex flex-wrap gap-2">{results.keywords.map(k => <div key={k} className="bg-primary/10 text-primary-foreground-subtle px-2 py-1 rounded-md text-sm">{k}</div>)}</div>}
        </TabsContent>
        <TabsContent value="search" className="space-y-4">
          <div className="flex gap-2">
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Enter search query..." />
            <Button onClick={() => runAnalysis('search')} disabled={isLoading}>
                {isLoading && results.searchResults === undefined ? <Icons.spinner className="mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Search
            </Button>
          </div>
          {results.searchResults && <div className="space-y-4">{results.searchResults.map((p, i) => <Card key={i}><CardContent className="p-4 text-sm italic border-l-2 border-primary">"{p}"</CardContent></Card>)}</div>}
        </TabsContent>
        <TabsContent value="citation" className="space-y-4">
          <div className="flex gap-2">
            <Select value={citationFormat} onValueChange={setCitationFormat}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="APA">APA</SelectItem>
                <SelectItem value="MLA">MLA</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => runAnalysis('citation')} disabled={isLoading}>
              {isLoading && results.citation === undefined ? <Icons.spinner className="mr-2" /> : <Quote className="w-4 h-4 mr-2" />}
              Generate Citation
            </Button>
          </div>
          {results.citation && <Card className="mt-4"><CardContent className="p-6 text-sm bg-muted/50 rounded-lg">{results.citation}</CardContent></Card>}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );

  const renderMultiDocView = () => (
    <ScrollArea className="h-full">
        <h2 className="text-xl font-headline font-bold mb-4">Multi-Document Comparison</h2>
        <Button onClick={() => runAnalysis('comparison')} disabled={isLoading}>
            {isLoading && results.comparison === undefined ? <Icons.spinner className="mr-2" /> : <GitCompareArrows className="w-4 h-4 mr-2" />}
            Compare {selectedDocuments.length} Documents
        </Button>
        {results.comparison && <Card className="mt-4"><CardContent className="p-6"><ReactMarkdown className="prose dark:prose-invert max-w-none">{results.comparison}</ReactMarkdown></CardContent></Card>}
    </ScrollArea>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-3.5rem)]">
      <Card className="m-4 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-lg">My Documents</CardTitle>
          {selectedDocIds.size > 0 && <Button variant="destructive" size="icon" onClick={handleDeleteSelected}><Trash2 className="w-4 h-4" /></Button>}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-auto">
            <Dialog open={isAddDocOpen} onOpenChange={setAddDocOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline"><FilePlus className="w-4 h-4 mr-2" />Add Document</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle className="font-headline">Add New Document</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid gap-2"><Label htmlFor="doc-name">Document Name</Label><Input id="doc-name" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} /></div>
                    <div className="grid gap-2"><Label htmlFor="doc-content">Content (Paste Text)</Label><Textarea id="doc-content" value={newDocContent} onChange={(e) => setNewDocContent(e.target.value)} rows={10} /></div>
                    <Button onClick={handleAddDocument}>Add Document</Button>
                    </div>
                </DialogContent>
            </Dialog>

          <ScrollArea className="flex-1 -mx-6">
            <div className="px-6 space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted" >
                <Checkbox
                  id={doc.id}
                  checked={selectedDocIds.has(doc.id)}
                  onCheckedChange={() => handleToggleSelection(doc.id)}
                />
                <label htmlFor={doc.id} className="text-sm font-medium leading-none flex-1 cursor-pointer">{doc.name}</label>
              </div>
            ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="m-4">
        <CardContent className="p-6 h-full">
          {selectedDocuments.length === 0 && <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"><BookOpen className="w-16 h-16 mb-4" /><p>Add and select a document to begin analysis.</p></div>}
          {selectedDocuments.length === 1 && renderSingleDocView()}
          {selectedDocuments.length > 1 && renderMultiDocView()}
        </CardContent>
      </Card>
    </div>
  );
}
