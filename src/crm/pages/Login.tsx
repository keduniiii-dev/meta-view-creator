import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/crm/hooks/useApi";

const CrmLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useLogin } = useAuth();
  const { mutate, isPending, error } = useLogin();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate(
      { username, password },
      {
        onSuccess: () => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("crm-auth", "true");
          }
          toast({
            title: "Logged in",
            description: "Welcome back to the CRM.",
          });
          navigate("/crm/dashboard", { replace: true });
        },
        onError: (error) => {
          toast({
            title: "Login failed",
            description: error instanceof Error ? error.message : "Unable to sign in.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">CRM login</CardTitle>
          <CardDescription>Sign in to access your CRM workspace.</CardDescription>
          <p className="text-sm text-muted-foreground">Local demo login: <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">password123</span></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required className="pr-10" />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-all duration-200 hover:text-foreground"
                >
                  <span className="transition-transform duration-200 ease-out hover:scale-110">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </span>
                </button>
              </div>
            </div>
            {error ? <p className="text-sm text-destructive">{error instanceof Error ? error.message : "Unable to sign in."}</p> : null}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmLoginPage;
