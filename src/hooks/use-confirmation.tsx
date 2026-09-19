import { useEffect, useRef, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function useConfirmation() {
  const [message, setMessage] = useState<string | null>(null);
  const resolve = useRef<((answer: boolean) => void) | null>(null);
  useEffect(() => () => resolve.current?.(false), []);
  const finish = (answer: boolean) => { resolve.current?.(answer); resolve.current = null; setMessage(null); };
  const confirm = (text: string) => new Promise<boolean>(done => { resolve.current?.(false); resolve.current = done; setMessage(text); });
  const confirmation = <AlertDialog open={message !== null} onOpenChange={open => { if (!open) finish(false); }}>
    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirm action</AlertDialogTitle><AlertDialogDescription>{message}</AlertDialogDescription></AlertDialogHeader>
      <AlertDialogFooter><AlertDialogCancel onClick={() => finish(false)}>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => finish(true)}>Confirm</AlertDialogAction></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
  return { confirm, confirmation };
}
