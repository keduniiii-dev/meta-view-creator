import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { resolveServerErrors } from "@/lib/server-errors";
import { crmPath } from "@/lib/crm-base";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  useEffect(() => {
    if (user) {
      navigate(crmPath("/dashboard"), { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (sessionStorage.getItem("session-expired")) {
      toast.error("Session expired. Please sign in again.");
      sessionStorage.removeItem("session-expired");
    }
  }, []);

  const handleSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      await login(values.username.trim(), values.password);
      toast.success("Welcome back!");
      navigate(crmPath("/dashboard"), { replace: true });
    } catch (err) {
      const resolved = resolveServerErrors(err, ["username", "password"]);
      for (const [name, message] of Object.entries(resolved.fieldErrors)) {
        form.setError(name as keyof LoginValues, { type: "server", message });
      }
      if (resolved.bannerMessage) {
        toast.error(resolved.bannerMessage);
      } else if (!Object.keys(resolved.fieldErrors).length) {
        toast.error("Login failed. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} className="w-full max-w-md">
        <Card className="w-full overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 text-center text-white">
            <div className="mx-auto w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-white">
              Twinblueprint CRM
            </CardTitle>
            <CardDescription className="text-slate-300">
              Sign in to your account
            </CardDescription>
          </div>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            {...field}
                            autoComplete="username"
                            placeholder="admin"
                            className="pl-9"
                            disabled={submitting}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="pl-9 pr-10"
                            disabled={submitting}
                          />
                          <Button variant="ghost" size="icon"
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {showPassword ? (
                                <motion.span
                                  key="off"
                                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.2 }}
                                  className="block"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                                    <path d="m2 2 20 20" />
                                  </svg>
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="on"
                                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.2 }}
                                  className="block"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;