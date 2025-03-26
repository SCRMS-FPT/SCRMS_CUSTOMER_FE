import { Outlet, Route } from "react-router-dom";

import CoachDashboardView from "@/pages/CoachView/CoachDashboardView";
import CoachScheduleManagementView from "@/pages/CoachView/CoachScheduleManagementView";
import CoachTraineeManagementView from "@/pages/CoachView/CoachTraineeManagementView";
import CoachTrainingSessionManagementView from "@/pages/CoachView/CoachTrainingSessionManagementView";
import CoachTrainingPackageManagementView from "@/pages/CoachView/CoachTrainingPackageManagementView";
import CoachAnalyticsView from "@/pages/CoachView/CoachAnalyticsView";
import CoachSidebar from "../components/CoachPage/CoachSidebar";
import CoachProfile from "@/pages/CoachView/coach-profile"
import CoachSchedules from "@/pages/CoachView/coach-schedules"
import CoachPackagesPage from "@/pages/CoachView/coach-packages-page"
import CoachBookingsPage from "@/pages/CoachView/coach-bookings-page"
import CoachPromotionManagementPage from "@/pages/CoachView/CoachPromotionManagementPage"

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
  //// Hồ Sơ Coach
  <Route
    key="coach-profile"
    path="/coach-profile"
    element={
      <CoachSidebar>
        <CoachProfile />
      </CoachSidebar>
    }
  />,

  <Route
    key="coach-profile"
    path="/coach-profile/:id"
    element={
      <CoachSidebar>
        <CoachProfile />
      </CoachSidebar>
    }
  />,
  /////Lịch Làm Việc Coach

  <Route
    key="coach-schedules"
    path="/coach-schedules"
    element={
      <CoachSidebar>
        <CoachSchedules />
      </CoachSidebar>
    }
  />,

  <Route
    key="/coach-schedules"
    path="/coach-schedules/:id"
    element={
      <CoachSidebar>
        <CoachSchedules />
      </CoachSidebar>
    }
  />,



  /////Gói Đào Tạo Coach

  <Route
    key="coach-packages"
    path="/coach-packages"
    element={
      <CoachSidebar>
        <CoachPackagesPage />
      </CoachSidebar>
    }
  />,

  <Route
    key="coach-packages"
    path="/coach-packages/:coach_id"
    element={
      <CoachSidebar>
        <CoachPackagesPage />
      </CoachSidebar>
    }
  />,


  /////Booking của Coach

  <Route
    key="coach-bookings"
    path="/coach-bookings"
    element={
      <CoachSidebar>
        <CoachBookingsPage />
      </CoachSidebar>
    }
  />,


  /////Quản Lý Khuyến Mãi cho Coach

  <Route
    key="coach-promotions"
    path="/coach-promotions"
    element={
      <CoachSidebar>
        <CoachPromotionManagementPage />
      </CoachSidebar>
    }
  />,



];

export default CoachRoutes;
