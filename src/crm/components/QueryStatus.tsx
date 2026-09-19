import { AlertCircle, ChevronLeft, ChevronRight, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

export function QueryStatus({ query }: { query: { isPending: boolean; isError: boolean; refetch: () => unknown } }) {
  if (query.isPending) return <div role="status" aria-label="Loading data" className="grid gap-4 py-2 sm:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="space-y-3 rounded-xl border p-5"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-32" /><Skeleton className="h-3 w-full" /></div>)}</div>;
  if (query.isError) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Unable to load data</AlertTitle><AlertDescription className="flex flex-wrap items-center justify-between gap-3">Please try again.<Button variant="outline" size="sm" onClick={() => query.refetch()}><RefreshCw className="mr-2 h-3.5 w-3.5" />Retry</Button></AlertDescription></Alert>;
  return null;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center"><div className="mb-4 rounded-full bg-muted p-3"><Inbox className="h-5 w-5 text-muted-foreground" /></div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p></div>;
}

export function PaginationControls({ page, pages, onChange, busy = false }: { page: number; pages: number; onChange: (page: number) => void; busy?: boolean }) {
  if (pages <= 1 && page <= 1) return null;
  return <Pagination className="justify-end border-t pt-4"><PaginationContent className="flex-wrap justify-center gap-y-3"><PaginationItem><Button type="button" variant="outline" size="sm" disabled={busy || page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button></PaginationItem><PaginationItem><span aria-live="polite" className="px-3 text-xs text-muted-foreground">Page {page} of {Math.max(page, pages)}</span></PaginationItem><PaginationItem><Button type="button" variant="outline" size="sm" disabled={busy || page >= pages} onClick={() => onChange(page + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></PaginationItem></PaginationContent></Pagination>;
}
