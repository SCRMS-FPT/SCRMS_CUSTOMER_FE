import { Routes } from "react-router-dom";
import {
  GeneralRoutes,
  UserRoutes,
  CourtOwnerRoutes,
  CoachRoutes,
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
    </Routes>
  );
}

export default App;
