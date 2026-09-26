import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { crmPath } from "@/lib/crm-base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

function responseStatus(cause: unknown): number | undefined {
  return cause && typeof cause === "object" && "status" in cause ? (cause as { status: number }).status : undefined;
}

export default function AdminLoginDialog({ onClose }: { onClose: () => void }) {
  const { loginByPasscode } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const lockTimer = useRef<number | undefined>(undefined);
  const form = useForm({ defaultValues: { passcode: "" } });
  const busy = form.formState.isSubmitting;
  useEffect(() => () => window.clearTimeout(lockTimer.current), []);
  async function submit(values: { passcode: string }) {
    if (locked) return;
    setError("");
    setShowPasscode(false);
    try {
      const user = await loginByPasscode(values.passcode);
      if (user.role !== "admin") {
        form.setValue("passcode", "");
        setError("An administrator account is required to access the archive.");
        return;
      }
      await queryClient.cancelQueries();
      queryClient.clear();
      form.reset();
      onClose();
      navigate(crmPath("/archived"));
    } catch (cause) {
      form.setValue("passcode", "");
      const status = responseStatus(cause);
      if (status === 429) {
        setLocked(true);
        lockTimer.current = window.setTimeout(() => setLocked(false), 60_000);
        setError("Too many attempts, try again in a minute");
      } else if (status === 401) {
        setError("Invalid admin passcode");
      } else if (status === 400) {
        setError("Enter the admin passcode before unlocking.");
      } else {
        setError(cause instanceof Error ? cause.message : "Unable to unlock admin access. Please try again.");
      }
    }
  }
  return <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}><DialogContent><motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.25, ease: "easeOut" }}><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Lock className="h-5 w-5 text-primary" /></div><DialogHeader><DialogTitle>Admin access</DialogTitle><DialogDescription>Enter the admin passcode to archive or delete uploaded leads.</DialogDescription></DialogHeader>
    <Form {...form}><form className="space-y-4" noValidate onSubmit={form.handleSubmit(submit)}>
      <FormField control={form.control} name="passcode" rules={{ required: "Admin passcode is required." }} render={({ field }) => <FormItem><FormLabel>Admin passcode</FormLabel><div className="relative"><FormControl><Input {...field} type={showPasscode ? "text" : "password"} autoComplete="current-password" disabled={busy || locked} className="pr-12" placeholder="Enter admin passcode" /></FormControl><Button type="button" variant="outline" size="icon" disabled={busy || locked} aria-label={showPasscode ? "Hide passcode" : "Show passcode"} aria-pressed={showPasscode} title={showPasscode ? "Hide passcode" : "Show passcode"} onMouseDown={event => event.preventDefault()} onClick={() => setShowPasscode(v => !v)} className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 border-border bg-muted text-foreground shadow-none hover:bg-muted/80 hover:text-primary"><AnimatePresence mode="wait" initial={false}>{showPasscode ? <motion.span key="hide" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }} className="block"><Eye className="h-4 w-4" /></motion.span> : <motion.span key="show" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }} className="block"><EyeOff className="h-4 w-4" /></motion.span>}</AnimatePresence></Button></div><FormMessage role="alert" /></FormItem>} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <DialogFooter><Button type="button" variant="outline" disabled={busy} onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy || locked}>{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Unlocking…</> : "Unlock"}</Button></DialogFooter>
    </form></Form>
  </motion.div></DialogContent></Dialog>;
}