
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Choice from "./pages/Choice";
import Create from "./pages/Create";
import CreateLoading from "./pages/CreateLoading";
import Story from "./pages/Story";
import StoryPlayback from "./pages/StoryPlayback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/choice"
              element={
                <ProtectedRoute>
                  <Choice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <Create />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create/loading"
              element={
                <ProtectedRoute>
                  <CreateLoading />
                </ProtectedRoute>
              }
            />
            <Route
              path="/story/playback"
              element={
                <ProtectedRoute>
                  <StoryPlayback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/story/:id"
              element={
                <ProtectedRoute>
                  <Story />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
