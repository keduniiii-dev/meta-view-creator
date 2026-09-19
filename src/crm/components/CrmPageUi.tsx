import { type ReactNode, useId } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export function SelectField({ label, value, onChange, options, placeholder = "Select an option", disabled = false }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string; disabled?: boolean }) {
  const id = useId();
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger id={id} aria-label={label}><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>;
}
export function MetricCard({ label, value, detail, icon: Icon, compact = false }: { label: string; value: ReactNode; detail?: string; icon: LucideIcon | IconType; compact?: boolean }) {
  if (compact) return <Card className="min-w-0"><CardContent className="flex flex-col items-center px-3 py-4 text-center"><Icon className="mb-2 h-4 w-4 text-primary" /><p className="text-xl font-semibold tabular-nums">{value}</p><p className="text-xs text-muted-foreground">{label}</p>{detail && <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>}</CardContent></Card>;
  return <Card><CardContent className="p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{label}</p><div className="rounded-lg bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div></div><p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>{detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}</CardContent></Card>;
}
