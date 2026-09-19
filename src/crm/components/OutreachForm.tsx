import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker, validLocalDateTime } from "@/components/ui/date-time-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resolveServerErrors } from "@/lib/server-errors";
import { ServerErrorBanner } from "@/crm/components/ServerErrorBanner";

// fieldNames must be a stable reference (module-level constant) so the effect
// below only reacts to the serverError.
export function OutreachForm({ children, onSubmit, className, serverError, fieldNames = [] }: { children: ReactNode; onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>; className?: string; serverError?: unknown; fieldNames?: readonly string[] }) {
  const form = useForm({ mode: "onBlur", shouldUnregister: true });
  const [banner, setBanner] = useState<string | null>(null);
  useEffect(() => {
    if (!serverError) { setBanner(null); return; }
    const resolved = resolveServerErrors(serverError, fieldNames);
    for (const [name, message] of Object.entries(resolved.fieldErrors)) {
      form.setError(name, { type: "server", message });
    }
    setBanner(resolved.bannerMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, serverError]);
  return <Form {...form}><form noValidate className={className} onSubmit={event => { event.preventDefault(); void form.handleSubmit(() => onSubmit(event))(event); }}>{banner && <ServerErrorBanner message={banner} />}{children}</form></Form>;
}
interface FieldProps {
  name: string; label: string; value: string; onChange: (value: string) => void;
  disabled?: boolean; required?: boolean; maxLength?: number;
  multiline?: boolean; dateTime?: boolean; className?: string; placeholder?: string;
  options?: { value: string; label: string }[];
}
export function OutreachField({ name, label, value, onChange, disabled, required, maxLength, multiline, dateTime, options, className, placeholder }: FieldProps) {
  const form = useFormContext();
  // Existing draft state also drives previews and idempotent retries; keep the form in sync with it.
  useEffect(() => { form.setValue(name, value); }, [form.setValue, name, value]);
  return <FormField control={form.control} name={name} defaultValue={value} rules={{ validate: input => {
    const text = String(input ?? "");
    if (required && !text.trim()) return `${label} is required.`;
    if (maxLength && text.length > maxLength) return `Use at most ${maxLength} characters.`;
    if (dateTime && text && !validLocalDateTime(text)) return "Choose a valid date and time (YYYY-MM-DD HH:mm).";
    return true;
  } }} render={({ field }) => {
    const update = (next: string) => { field.onChange(next); form.clearErrors(name); onChange(next); };
    return <FormItem className={className}><FormLabel>{label}</FormLabel>{options ? <Select value={value} onValueChange={update} disabled={disabled}><FormControl><SelectTrigger ref={field.ref} onBlur={field.onBlur}><SelectValue placeholder={placeholder} /></SelectTrigger></FormControl><SelectContent>{options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select> : <FormControl>{dateTime ? <DateTimePicker ref={field.ref} label={label} value={value} onChange={update} onBlur={field.onBlur} disabled={disabled} optional={!required} /> : multiline ? <Textarea ref={field.ref} value={value} onChange={event => update(event.target.value)} onBlur={field.onBlur} disabled={disabled} maxLength={maxLength} placeholder={placeholder} /> : <Input ref={field.ref} value={value} onChange={event => update(event.target.value)} onBlur={field.onBlur} disabled={disabled} maxLength={maxLength} placeholder={placeholder} />}</FormControl>}<FormMessage role="alert" /></FormItem>;
  }} />;
}
