import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import Dashboard from "@/pages/Dashboard";
import Presentation from "@/pages/Presentation";
import PromoterView from "@/pages/PromoterView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Register} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/talents" component={Dashboard} />
      <Route path="/presentations" component={Dashboard} />
      <Route path="/settings" component={Dashboard} />
      <Route path="/analytics" component={Dashboard} />
      <Route path="/media" component={Dashboard} />

      <Route path="/calendar" component={Dashboard} />
      <Route path="/presentation/:id" component={Presentation} />
      <Route path="/talent/:id" component={PromoterView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
