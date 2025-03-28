import { Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@/components/GeneralComponents/Layout";
import CourtOwnerOnboarding from "@/pages/CourtOwnerView/CourtOwnerOnboarding";
import CourtOwnerDashboardView from "@/pages/CourtOwnerView/CourtOwnerDashboardView";
import CourtOwnerVenueListView from "@/pages/CourtOwnerView/CourtOwnerVenueListView";
import CourtOwnerVenueDetailView from "@/pages/CourtOwnerView/CourtOwnerVenueDetailView";
import CourtOwnerVenueCreateView from "@/pages/CourtOwnerView/CourtOwnerVenueCreateView";
import CourtOwnerCourtListView from "@/pages/CourtOwnerView/CourtOwnerCourtListView";
import CourtOwnerCourtDetailView from "@/pages/CourtOwnerView/CourtOwnerCourtDetailView";
import CourtOwnerCourtCreateView from "@/pages/CourtOwnerView/CourtOwnerCourtCreateView";
import CourtOwnerBookingView from "@/pages/CourtOwnerView/CourtOwnerBookingView";
import CourtOwnerScheduleView from "@/pages/CourtOwnerView/CourtOwnerScheduleView";
import CourtOwnerPromotionView from "@/pages/CourtOwnerView/CourtOwnerPromotionView";
import CourtOwnerPromotionDetailView from "@/pages/CourtOwnerView/CourtOwnerPromotionDetailView";
import CourtOwnerPromotionCreateView from "@/pages/CourtOwnerView/CourtOwnerPromotionCreateView";
import CourtOwnerNotificationView from "@/pages/CourtOwnerView/CourtOwnerNotificationView";
import CourtOwnerReportsView from "@/pages/CourtOwnerView/CourtOwnerReportsView";
import PromotionManagement from "@/pages/PromotionManagementPage";
import CourtsManage from "@/pages/CourtsManage";
import CourtReport from "@/pages/CourtReport";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Client } from "../API/CourtApi";
import CourtOwnerCourtUpdateView from "../pages/CourtOwnerView/CourtOwnerCourtUpdateView";
import CourtOwnerVenueUpdateView from "../pages/CourtOwnerView/CourtOwnerVenueUpdateView";
import CourtOwnerBookingDetailView from "../pages/CourtOwnerView/CourtOwnerBookingDetailView";
// Protected route component that checks for CourtOwner role
const ProtectedCourtOwnerRoute = ({ children }) => {
  // Get user info from Redux
  const user = useSelector((state) => state.user.userProfile);

  // Check if user has specific roles
  const isCourtOwner = user?.roles?.includes("CourtOwner");
  const [loading, setLoading] = useState(true);
  const [hasSportCenters, setHasSportCenters] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCourtOwner) {
      const checkSportCenters = async () => {
        try {
          const client = new Client();
          const response = await client.getOwnedSportCenters(1, 10);

          // Check if the court owner has any sport centers
          if (response.sportCenters?.data?.length === 0) {
            setHasSportCenters(false);
          } else {
            setHasSportCenters(true);
          }
        } catch (error) {
          console.error("Error checking sport centers:", error);
          // If API fails, we'll assume they have centers to avoid blocking access
          setHasSportCenters(true);
        } finally {
          setLoading(false);
        }
      };

      checkSportCenters();
    } else {
      setLoading(false);
    }
  }, [isCourtOwner]);

  // While checking, show nothing (or could add a loading spinner)
  if (loading) {
    return null;
  }

  // If not a court owner, redirect to forbidden
  if (!isCourtOwner) {
    return <Navigate to="/forbidden" replace />;
  }

  // If a court owner but has no sport centers, redirect to onboarding
  if (
    !hasSportCenters &&
    !window.location.pathname.includes("/court-owner/onboarding")
  ) {
    return <Navigate to="/court-owner/onboarding" replace />;
  }

  // If onboarding is complete and trying to access onboarding page, redirect to dashboard
  if (
    hasSportCenters &&
    window.location.pathname === "/court-owner/onboarding"
  ) {
    return <Navigate to="/court-owner/dashboard" replace />;
  }

  return children;
};
ProtectedCourtOwnerRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
const CourtOwnerRoutes = [
  <Route
    key="court-owner-onboarding"
    path="/court-owner/onboarding"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerOnboarding />
      </ProtectedCourtOwnerRoute>
    }
  />,
  // Protected Court Owner routes
  <Route
    key="court-owner-dashboard"
    path="/court-owner/dashboard"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerDashboardView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-venues"
    path="/court-owner/venues"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerVenueListView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-venue-detail"
    path="/court-owner/venues/:venueId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerVenueDetailView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-venue-update"
    path="/court-owner/venues/update/:venueId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerVenueUpdateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-venue-create"
    path="/court-owner/venues/create"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerVenueCreateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-courts"
    path="/court-owner/courts"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerCourtListView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-court-details"
    path="/court-owner/courts/:courtId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerCourtDetailView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-court-create-venue"
    path="/court-owner/courts/create/:venueId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerCourtCreateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-court-create"
    path="/court-owner/courts/create"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerCourtCreateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-court-update"
    path="/court-owner/courts/update/:courtId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerCourtUpdateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-bookings"
    path="/court-owner/bookings"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerBookingView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-booking-details"
    path="/court-owner/bookings/:bookingId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerBookingDetailView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-schedule"
    path="/court-owner/schedule"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerScheduleView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-promotions"
    path="/court-owner/promotions"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerPromotionView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-promotion-create"
    path="/court-owner/promotions/create"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerPromotionCreateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-promotion-edit"
    path="/court-owner/promotions/edit/:promotionId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerPromotionCreateView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-promotion-details"
    path="/court-owner/promotions/details/:promotionId"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerPromotionDetailView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-notifications"
    path="/court-owner/notifications"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerNotificationView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="court-owner-reports"
    path="/court-owner/reports"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtOwnerSidebar>
          <CourtOwnerReportsView />
        </CourtOwnerSidebar>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="courts-manage"
    path="/courts-manage"
    element={
      <ProtectedCourtOwnerRoute>
        <Layout>
          <CourtsManage />
        </Layout>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="courts-manage-center"
    path="/courts-manage/:centerId"
    element={
      <ProtectedCourtOwnerRoute>
        <Layout>
          <CourtsManage />
        </Layout>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="promotion-management"
    path="/PromotionManagement"
    element={
      <ProtectedCourtOwnerRoute>
        <Layout>
          <PromotionManagement />
        </Layout>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="promotion-management-court"
    path="/PromotionManagement/:courtId"
    element={
      <ProtectedCourtOwnerRoute>
        <Layout>
          <PromotionManagement />
        </Layout>
      </ProtectedCourtOwnerRoute>
    }
  />,
  <Route
    key="reports"
    path="/reports"
    element={
      <ProtectedCourtOwnerRoute>
        <CourtReport />
      </ProtectedCourtOwnerRoute>
    }
  />,
];

export default CourtOwnerRoutes;
