import { PenSquare } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <PenSquare className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">
          Civic Scribe
        </h1>
      </div>
    </header>
  );
}
