import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMoveLeadToPipeline } from "@/hooks/use-leads";
import { applyServerErrors } from "@/lib/server-errors";
import type { Lead } from "@/lib/types";

type BidForm = {
  project: string;
  client: string;
  phase: "RFP Review" | "Technical Eval" | "Shortlist";
  deadline: string;
  value: string;
};

const bidFields = ["project", "client", "phase", "deadline", "value"] as const;

export default function MoveToPipeline({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const moveLead = useMoveLeadToPipeline();
  const form = useForm<BidForm>({
    defaultValues: { project: "", client: "", phase: "RFP Review", deadline: "", value: "" },
  });
  const { reset } = form;
  useEffect(() => {
    setCalendarOpen(false);
    if (lead) reset({ project: lead.project || "", client: lead.company || "", phase: "RFP Review", deadline: "", value: "" });
  }, [lead, reset]);
  const busy = moveLead.isPending;
  const submit = (values: BidForm) => {
    if (!lead || busy) return;
    form.clearErrors("root");
    moveLead.mutate({
      id: lead.id,
      project: values.project.trim(),
      client: values.client.trim(),
      phase: values.phase,
      deadline: values.deadline,
      value: values.value.trim() ? Number(values.value) : undefined,
    }, {
onSuccess: onClose,
      onError: (error) => {
        const resolved = applyServerErrors(
          (name, options) => form.setError(name as keyof BidForm, options),
          error,
          bidFields,
        );
        if (resolved.bannerMessage) form.setError("root", { message: resolved.bannerMessage });
      },
    });
  };

  return <Dialog open={Boolean(lead)} onOpenChange={(open) => { if (!open && !busy) onClose(); }}>
    <DialogContent hideClose={busy} className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Move to Pipeline</DialogTitle>
        <DialogDescription>Create a bid for {lead?.full_name}. Saving changes this lead&apos;s status to Proposal.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-5 space-y-5">
          <FormField control={form.control} name="project" rules={{ validate: value => !!value.trim() || "Enter a project name." }} render={({ field }) => <FormItem>
            <FormLabel>Project</FormLabel><FormControl><Input {...field} disabled={busy} placeholder="Project name" /></FormControl><FormMessage />
          </FormItem>} />
          <FormField control={form.control} name="client" rules={{ validate: value => !!value.trim() || "Enter a client name." }} render={({ field }) => <FormItem>
            <FormLabel>Client</FormLabel><FormControl><Input {...field} disabled={busy} placeholder="Company or client name" /></FormControl><FormMessage />
          </FormItem>} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField control={form.control} name="phase" render={({ field }) => <FormItem>
              <FormLabel>Bid phase</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={busy}>
                <FormControl><SelectTrigger ref={field.ref} onBlur={field.onBlur}><SelectValue /></SelectTrigger></FormControl>
                <SelectContent><SelectItem value="RFP Review">RFP Review</SelectItem><SelectItem value="Technical Eval">Technical Eval</SelectItem><SelectItem value="Shortlist">Shortlist</SelectItem></SelectContent>
              </Select><FormMessage />
            </FormItem>} />
            <FormField control={form.control} name="deadline" rules={{ required: "Choose a deadline." }} render={({ field }) => <FormItem>
              <FormLabel>Deadline</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button type="button" variant="outline" ref={field.ref} onBlur={field.onBlur} disabled={busy}
                      className={"w-full justify-start text-left font-normal " + (!field.value ? "text-muted-foreground" : "")}>
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      {field.value ? format(parseISO(field.value), "PPP") : "Pick a date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value ? parseISO(field.value) : undefined}
                    defaultMonth={field.value ? parseISO(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      field.onBlur();
                      setCalendarOpen(false);
                    }}
                    disabled={busy} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>} />
          </div>
          <FormField control={form.control} name="value" rules={{ validate: value => !value.trim() || (Number.isFinite(Number(value)) && Number(value) >= 0) || "Enter a valid amount of zero or more." }} render={({ field }) => <FormItem>
            <FormLabel>Bid amount (optional)</FormLabel><FormControl><Input {...field} type="number" min="0" step="any" disabled={busy} placeholder="Not confirmed" /></FormControl>
            <FormDescription>Enter the bid amount, separate from project size. Leave blank if unconfirmed.</FormDescription><FormMessage />
          </FormItem>} />
          {form.formState.errors.root && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
          <DialogFooter className="gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{busy ? "Creating bid..." : "Create Bid & Move Lead"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>;
}
