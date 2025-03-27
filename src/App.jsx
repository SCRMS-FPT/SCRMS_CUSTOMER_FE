import { Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import {
  GeneralRoutes,
  UserRoutes,
  CourtOwnerRoutes,
  CoachRoutes,
  LegacyRoutes,
} from "./routes";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* General Routes */}
        {GeneralRoutes}

        {/* User Routes */}
        {UserRoutes}

        {/* Court Owner Routes */}
        {CourtOwnerRoutes}

        {/* Coach Routes */}
        {CoachRoutes}

        {/* Legacy Routes - To be updated */}
        {LegacyRoutes}
      </Routes>
    </AuthProvider>
  );
}

export default App;
