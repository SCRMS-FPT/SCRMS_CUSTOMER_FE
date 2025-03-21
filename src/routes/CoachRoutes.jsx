import { Outlet, Route } from "react-router-dom";

import CoachDashboardView from "@/pages/CoachView/CoachDashboardView";
import CoachScheduleManagementView from "@/pages/CoachView/CoachScheduleManagementView";
import CoachTraineeManagementView from "@/pages/CoachView/CoachTraineeManagementView";
import CoachTrainingSessionManagementView from "@/pages/CoachView/CoachTrainingSessionManagementView";
import CoachTrainingPackageManagementView from "@/pages/CoachView/CoachTrainingPackageManagementView";
import CoachAnalyticsView from "@/pages/CoachView/CoachAnalyticsView";
import CoachSidebar from "../components/CoachPage/CoachSidebar";

const CoachRoutes = [
  <Route
    key="coach-dashboard"
    path="/coach/dashboard"
    element={
      <CoachSidebar>
        <CoachDashboardView />
      </CoachSidebar>
    }
  />,
  <Route
    key="coach-sessions"
    path="/coach/sessions"
    element={
      <CoachSidebar>
        <CoachTrainingSessionManagementView />
      </CoachSidebar>
    }
  />,
  <Route
    key="coach-schedule"
    path="/coach/schedule"
    element={
      <CoachSidebar>
        <CoachScheduleManagementView />
      </CoachSidebar>
    }
  />,
  <Route
    key="coach-trainees"
    path="/coach/trainees"
    element={
      <CoachSidebar>
        <CoachTraineeManagementView />
      </CoachSidebar>
    }
  />,
  <Route
    key="coach-packages"
    path="/coach/packages"
    element={
      <CoachSidebar>
        <CoachTrainingPackageManagementView />
      </CoachSidebar>
    }
  />,
  <Route
    key="coach-analytics"
    path="/coach/analytics"
    element={
      <CoachSidebar>
        <CoachAnalyticsView />
      </CoachSidebar>
    }
  />,
];

export default CoachRoutes;
