import { Route } from "react-router-dom";

import CoachDashboardView from "@/pages/CoachView/CoachDashboardView";
import CoachScheduleManagementView from "@/pages/CoachView/CoachScheduleManagementView";
import CoachTraineeManagementView from "@/pages/CoachView/CoachTraineeManagementView";
import CoachTrainingSessionManagementView from "@/pages/CoachView/CoachTrainingSessionManagementView";
import CoachTrainingPackageManagementView from "@/pages/CoachView/CoachTrainingPackageManagementView";
import CoachAnalyticsView from "@/pages/CoachView/CoachAnalyticsView";

const CoachRoutes = [
  <Route
    key="coach-dashboard"
    path="/coach/dashboard"
    element={<CoachDashboardView />}
  />,
  <Route
    key="coach-sessions"
    path="/coach/sessions"
    element={<CoachTrainingSessionManagementView />}
  />,
  <Route
    key="coach-schedule"
    path="/coach/schedule"
    element={<CoachScheduleManagementView />}
  />,
  <Route
    key="coach-trainees"
    path="/coach/trainees"
    element={<CoachTraineeManagementView />}
  />,
  <Route
    key="coach-packages"
    path="/coach/packages"
    element={<CoachTrainingPackageManagementView />}
  />,
  <Route
    key="coach-analytics"
    path="/coach/analytics"
    element={<CoachAnalyticsView />}
  />,
];

export default CoachRoutes;
