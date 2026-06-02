import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./lib/trpc";
import superjson from "superjson";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StudentProvider } from "./contexts/StudentContext";
import Home from "./pages/Home";
import ClassViewer from "./pages/course/ClassViewer";
import StudentLogin from "./pages/StudentLogin";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import MiProgreso from "./pages/MiProgreso";
import Flashcards from "./pages/Flashcards";
import Simuladores from "./pages/Simuladores";
import { useAuth, useUser, AuthenticateWithRedirectCallback } from "@clerk/react";
import { Loader2 } from "lucide-react";

function TrpcProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers: async () => {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
  if (!isSignedIn) return <Redirect to="/login" />;
  return <>{children}</>;
}

function RequireProfessor({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
  if (user?.publicMetadata?.role !== "professor") return <Redirect to="/" />;
  return <>{children}</>;
}

function HomeRedirect() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
  if (user?.publicMetadata?.role === "professor") return <Redirect to="/profesor" />;
  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={StudentLogin} />
      <Route path="/sso-callback">
        <AuthenticateWithRedirectCallback />
      </Route>
      <Route path="/">
        <RequireAuth><HomeRedirect /></RequireAuth>
      </Route>
      <Route path="/week/:week/class/:class">
        <RequireAuth><ClassViewer /></RequireAuth>
      </Route>
      <Route path="/profesor">
        <RequireAuth><RequireProfessor><ProfessorDashboard /></RequireProfessor></RequireAuth>
      </Route>
      <Route path="/mi-progreso">
        <RequireAuth><MiProgreso /></RequireAuth>
      </Route>
      <Route path="/flashcards">
        <RequireAuth><Flashcards /></RequireAuth>
      </Route>
      <Route path="/simuladores">
        <RequireAuth><Simuladores /></RequireAuth>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TrpcProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <StudentProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </StudentProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </TrpcProvider>
  );
}

export default App;
