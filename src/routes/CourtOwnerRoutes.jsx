import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

import CourtOwnerDashboardView from "@/pages/CourtOwnerView/CourtOwnerDashboardView";
import CourtOwnerVenueListView from "@/pages/CourtOwnerView/CourtOwnerVenueListView";
import CourtOwnerVenueDetailView from "@/pages/CourtOwnerView/CourtOwnerVenueDetailView";
import CourtOwnerVenueCreateView from "@/pages/CourtOwnerView/CourtOwnerVenueCreateView";
import CourtOwnerCourtListView from "@/pages/CourtOwnerView/CourtOwnerCourtListView";
import CourtOwnerBookingView from "@/pages/CourtOwnerView/CourtOwnerBookingView";
import CourtOwnerScheduleView from "@/pages/CourtOwnerView/CourtOwnerScheduleView";
import CourtOwnerPromotionView from "@/pages/CourtOwnerView/CourtOwnerPromotionView";
import CourtOwnerNotificationView from "@/pages/CourtOwnerView/CourtOwnerNotificationView";
import CourtOwnerReportsView from "@/pages/CourtOwnerView/CourtOwnerReportsView";
import PromotionManagement from "@/pages/PromotionManagementPage";
import CourtsManage from "@/pages/CourtsManage";
import CourtReport from "@/pages/CourtReport";

const CourtOwnerRoutes = [
  <Route
    key="court-owner-dashboard"
    path="/court-owner/dashboard"
    element={<CourtOwnerDashboardView />}
  />,
  <Route
    key="court-owner-venues"
    path="/court-owner/venues"
    element={<CourtOwnerVenueListView />}
  />,
  <Route
    key="court-owner-venue-detail"
    path="/court-owner/venues/:venueId"
    element={<CourtOwnerVenueDetailView />}
  />,
  <Route
    key="court-owner-venue-create"
    path="/court-owner/venues/create"
    element={<CourtOwnerVenueCreateView />}
  />,
  <Route
    key="court-owner-courts"
    path="/court-owner/courts"
    element={<CourtOwnerCourtListView />}
  />,
  <Route
    key="court-owner-bookings"
    path="/court-owner/bookings"
    element={<CourtOwnerBookingView />}
  />,
  <Route
    key="court-owner-schedule"
    path="/court-owner/schedule"
    element={<CourtOwnerScheduleView />}
  />,
  <Route
    key="court-owner-promotions"
    path="/court-owner/promotions"
    element={<CourtOwnerPromotionView />}
  />,
  <Route
    key="court-owner-notifications"
    path="/court-owner/notifications"
    element={<CourtOwnerNotificationView />}
  />,
  <Route
    key="court-owner-reports"
    path="/court-owner/reports"
    element={<CourtOwnerReportsView />}
  />,
  <Route
    key="courts-manage"
    path="/courts-manage"
    element={
      <Layout>
        <CourtsManage />
      </Layout>
    }
  />,
  <Route
    key="courts-manage-center"
    path="/courts-manage/:centerId"
    element={
      <Layout>
        <CourtsManage />
      </Layout>
    }
  />,
  <Route
    key="promotion-management"
    path="/PromotionManagement"
    element={
      <Layout>
        <PromotionManagement />
      </Layout>
    }
  />,
  <Route
    key="promotion-management-court"
    path="/PromotionManagement/:courtId"
    element={
      <Layout>
        <PromotionManagement />
      </Layout>
    }
  />,
  <Route key="reports" path="/reports" element={<CourtReport />} />,
];

export default CourtOwnerRoutes;
