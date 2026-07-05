import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SpacesProvider } from "@/contexts/SpacesContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import BusinessOnboarding from "./pages/BusinessOnboarding.tsx";
import Newsletter from "./pages/Newsletter.tsx";
import Spaces from "./pages/Spaces.tsx";
import LawDetail from "./pages/LawDetail.tsx";
import BuddyChat from "./pages/BuddyChat.tsx";
import Reports from "./pages/Reports.tsx";
import ComplianceDashboard from "./pages/ComplianceDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import DarkModeToggle from "@/components/DarkModeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DarkModeToggle />
      <BrowserRouter>
        <AuthProvider>
          <SpacesProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business-onboarding"
                element={
                  <ProtectedRoute>
                    <BusinessOnboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newsletter"
                element={
                  <ProtectedRoute requireProfile>
                    <Newsletter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute requireProfile>
                    <Newsletter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/spaces"
                element={
                  <ProtectedRoute requireProfile>
                    <Spaces />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/law/:slug"
                element={
                  <ProtectedRoute requireProfile>
                    <LawDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute requireProfile>
                    <BuddyChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compliance"
                element={
                  <ProtectedRoute requireProfile>
                    <ComplianceDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requireProfile>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SpacesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
