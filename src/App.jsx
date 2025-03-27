import { Routes } from "react-router-dom";
import {
  GeneralRoutes,
  UserRoutes,
  CourtOwnerRoutes,
  CoachRoutes,
  LegacyRoutes,
} from "./routes";

function App() {
  return (
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
  );
}

export default App;
