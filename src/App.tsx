import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import HealthAssessment from "./pages/HealthAssessment";
import WorkoutPlanner from "./pages/WorkoutPlanner";
import MealPlanner from "./pages/MealPlanner";
import FoodScanner from "./pages/FoodScanner";
import AICoach from "./pages/AICoach";
import Progress from "./pages/Progress";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/health-assessment" element={<ProtectedPage><HealthAssessment /></ProtectedPage>} />
            <Route path="/workout-planner" element={<ProtectedPage><WorkoutPlanner /></ProtectedPage>} />
            <Route path="/meal-planner" element={<ProtectedPage><MealPlanner /></ProtectedPage>} />
            <Route path="/food-scanner" element={<ProtectedPage><FoodScanner /></ProtectedPage>} />
            <Route path="/ai-coach" element={<ProtectedPage><AICoach /></ProtectedPage>} />
            <Route path="/progress" element={<ProtectedPage><Progress /></ProtectedPage>} />
            <Route path="/settings" element={<ProtectedPage><SettingsPage /></ProtectedPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
