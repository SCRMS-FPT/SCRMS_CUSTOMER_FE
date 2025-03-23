import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

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





const CourtOwnerRoutes = [
  <Route
    key="court-owner-dashboard"
    path="/court-owner/dashboard"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerDashboardView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-venues"
    path="/court-owner/venues"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerVenueListView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-venue-detail"
    path="/court-owner/venues/:venueId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerVenueDetailView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-venue-create"
    path="/court-owner/venues/create"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerVenueCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-courts"
    path="/court-owner/courts"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerCourtListView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-court-details"
    path="/court-owner/courts/:courtId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerCourtDetailView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-court-create-venue"
    path="/court-owner/courts/create/:venueId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerCourtCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-court-create"
    path="/court-owner/courts/create"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerCourtCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-court-update"
    path="/court-owner/courts/update/:courtId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerCourtCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-bookings"
    path="/court-owner/bookings"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerBookingView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-schedule"
    path="/court-owner/schedule"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerScheduleView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-promotions"
    path="/court-owner/promotions"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerPromotionView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-promotion-create"
    path="/court-owner/promotions/create"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerPromotionCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-promotion-edit"
    path="/court-owner/promotions/edit/:promotionId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerPromotionCreateView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-promotion-details"
    path="/court-owner/promotions/details/:promotionId"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerPromotionDetailView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-notifications"
    path="/court-owner/notifications"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerNotificationView />
      </CourtOwnerSidebar>
    }
  />,
  <Route
    key="court-owner-reports"
    path="/court-owner/reports"
    element={
      <CourtOwnerSidebar>
        <CourtOwnerReportsView />
      </CourtOwnerSidebar>
    }
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
  <Route
    key="reports"
    path="/reports"
    element={
      <CourtReport />
    }
  />,
];

export default CourtOwnerRoutes;
