import { useEffect, useState } from "react";
import { Client } from "@/API/CoachApi";
import PropTypes from "prop-types";

import CoachDashboardView from "@/pages/CoachView/CoachDashboardView";
import CoachSidebar from "../components/CoachPage/CoachSidebar";
import CoachProfile from "@/pages/CoachView/coach-profile";
import CoachSchedules from "@/pages/CoachView/coach-schedules";
import CoachPackagesPage from "@/pages/CoachView/coach-packages-page";
import CoachBookingsPage from "@/pages/CoachView/coach-bookings-page";
import CoachPromotionManagementPage from "@/pages/CoachView/CoachPromotionManagementPage";
import CoachOnboarding from "@/pages/CoachView/CoachOnboarding";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";
import CoachReviewsPage from "@/pages/CoachView/CoachReviewsPage";

// Protected route component that checks for Coach role
const ProtectedCoachRoute = ({ children }) => {
  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Check if user has specific roles
  const isCoach = user?.roles?.includes("Coach");
  const [loading, setLoading] = useState(true);
  const [hasCoachProfile, setHasCoachProfile] = useState(false);

  useEffect(() => {
    if (isCoach) {
      const checkCoachProfile = async () => {
        try {
          const client = new Client();
          const response = await client.getMyCoachProfile();

          // If we get a valid response, the coach profile exists
          if (response && response.id) {
            setHasCoachProfile(true);
          } else {
            setHasCoachProfile(false);
          }
        } catch (error) {
          console.error("Error checking coach profile:", error);
          // If API fails with 404, they don't have a profile
          setHasCoachProfile(false);
        } finally {
          setLoading(false);
        }
      };

      checkCoachProfile();
    } else {
      setLoading(false);
    }
  }, [isCoach]);

  // While checking, show nothing (or could add a loading spinner)
  if (loading) {
    return null;
  }

  // If not a coach, redirect to forbidden
  if (!isCoach) {
    return <Navigate to="/forbidden" replace />;
  }

  // If a coach but has no profile, redirect to onboarding
  if (
    !hasCoachProfile &&
    !window.location.pathname.includes("/coach/onboarding")
  ) {
    return <Navigate to="/coach/onboarding" replace />;
  }

  // If onboarding is complete and trying to access onboarding page, redirect to dashboard
  if (hasCoachProfile && window.location.pathname === "/coach/onboarding") {
    return <Navigate to="/coach/dashboard" replace />;
  }

  return children;
};

ProtectedCoachRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const CoachRoutes = [
  <Route
    key="coach-onboarding"
    path="/coach/onboarding"
    element={
      <ProtectedCoachRoute>
        <CoachOnboarding />
      </ProtectedCoachRoute>
    }
  />,
  <Route
    key="coach-dashboard"
    path="/coach/dashboard"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachDashboardView />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,
  //// Hồ Sơ Coach
  <Route
    key="coach-profile"
    path="/coach-profile"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachProfile />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,

  <Route
    key="coach-profile"
    path="/coach-profile/:id"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachProfile />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,
  /////Lịch Làm Việc Coach

  <Route
    key="coach-schedules"
    path="/coach-schedules"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachSchedules />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,

  <Route
    key="/coach-schedules"
    path="/coach-schedules/:id"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachSchedules />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,

  /////Gói Đào Tạo Coach

  <Route
    key="coach-packages"
    path="/coach-packages"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachPackagesPage />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,

  <Route
    key="coach-packages"
    path="/coach-packages/:coach_id"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachPackagesPage />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,
  <Route
    key="coach-reviews"
    path="/coach-reviews"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachReviewsPage />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,
  /////Booking của Coach

  <Route
    key="coach-bookings"
    path="/coach-bookings"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachBookingsPage />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,

  /////Quản Lý Khuyến Mãi cho Coach

  <Route
    key="coach-promotions"
    path="/coach-promotions"
    element={
      <ProtectedCoachRoute>
        <CoachSidebar>
          <CoachPromotionManagementPage />
        </CoachSidebar>
      </ProtectedCoachRoute>
    }
  />,
];

export default CoachRoutes;
