import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import Visualizations from "@/pages/Visualizations";
import MyReservations from "@/pages/MyReservations";
import Favorites from "@/pages/Favorites";
import AboutUs from "@/pages/AboutUs";
import LoginPage from "@/pages/LoginPage";
import PaymentHistory from "@/pages/PaymentHistory";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/useAuth2";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={LoginPage} />
      <Route path="/home">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/visualizations">
        <Layout>
          <Visualizations />
        </Layout>
      </Route>
      <Route path="/reservations">
        <Layout>
          <MyReservations />
        </Layout>
      </Route>
      <Route path="/favorites">
        <Layout>
          <Favorites />
        </Layout>
      </Route>
      <Route path="/about">
        <Layout>
          <AboutUs />
        </Layout>
      </Route>
      <Route path="/payment-history">
        <Layout>
          <PaymentHistory />
        </Layout>
      </Route>
      <Route>
        <Layout>
          <NotFound />
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
