import { forwardRef, useState } from "react";
import { format, isValid, parse } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export function validLocalDateTime(value: string) {
  const parsed = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
  return isValid(parsed) && format(parsed, "yyyy-MM-dd'T'HH:mm") === value;
}
interface DateTimePickerProps {
  id?: string; value: string; onChange: (value: string) => void; onBlur?: () => void;
  disabled?: boolean; label: string; optional?: boolean;
  "aria-describedby"?: string; "aria-invalid"?: boolean | "true" | "false";
}
export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>(({ value, onChange, label, optional, disabled, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const selected = validLocalDateTime(value) ? parse(value, "yyyy-MM-dd'T'HH:mm", new Date()) : undefined;
  const hour = selected ? format(selected, "HH") : "09";
  const minute = selected ? format(selected, "mm") : "00";
  function update(date: Date, nextHour = hour, nextMinute = minute) { onChange(`${format(date, "yyyy-MM-dd")}T${nextHour}:${nextMinute}`); }
  return <div className="flex items-center gap-2">
    <Input {...props} ref={ref} type="text" disabled={disabled} value={value.replace("T", " ")} placeholder="YYYY-MM-DD HH:mm" onChange={event => onChange(event.target.value.replace(" ", "T"))} className="min-w-0 tabular-nums" />
    <Popover open={open} onOpenChange={setOpen}><PopoverTrigger asChild><Button type="button" size="icon" variant="outline" className="shrink-0" disabled={disabled} aria-label={`Choose date and time for ${label}`}><CalendarDays className="h-4 w-4" /></Button></PopoverTrigger><PopoverContent align="start" className="w-auto p-0">
      <Calendar mode="single" selected={selected} defaultMonth={selected} onSelect={date => { if (date) update(date); }} initialFocus />
      <div className="space-y-3 border-t p-3"><p className="text-xs text-muted-foreground">Local time (24-hour)</p><div className="grid grid-cols-2 gap-2">
        <Select value={hour} onValueChange={next => update(selected ?? new Date(), next)}><SelectTrigger aria-label={`${label} hour`}><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={minute} onValueChange={next => update(selected ?? new Date(), hour, next)}><SelectTrigger aria-label={`${label} minute`}><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
      </div><div className="flex justify-end gap-2">{optional && <Button type="button" variant="ghost" size="sm" onClick={() => { onChange(""); setOpen(false); }}>Clear</Button>}<Button type="button" size="sm" onClick={() => setOpen(false)}>Done</Button></div></div>
    </PopoverContent></Popover>
  </div>;
});
DateTimePicker.displayName = "DateTimePicker";
