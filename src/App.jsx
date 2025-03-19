import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import HomeView from "@/pages/GeneralView/HomeView";
import LoginView from "@/pages/GeneralView/LoginView";
import SignUpView from "./pages/GeneralView/SignUpView";
import SupportView from "@/pages/GeneralView/SupportView";
import ForgotPasswordView from "@/pages/GeneralView/ForgotPasswordView";
import BrowseCourtsView from "@/pages/GeneralView/BrowseCourtsView";
import CourtDetailsView from "@/pages/GeneralView/CourtDetailsView";


import BookCourtView from "@/pages/UserView/BookCourtView";
import UserDashboardView from "@/pages/UserView/UserDashboardView";
import UserCourtBookingManagementView from "@/pages/UserView/UserCourtBookingManagementView";
import UserTeamMatchingManagementView from "@/pages/UserView/UserTeamMatchingManagementView";
import UserCoachingManagementView from "@/pages/UserView/UserCoachingManagementView";

import CourtOwnerDashboardView from "@/pages/CourtOwnerView/CourtOwnerDashboardView";
import CourtOwnerCourtListView from "@/pages/CourtOwnerView/CourtOwnerCourtListView";
import CourtOwnerBookingView from "@/pages/CourtOwnerView/CourtOwnerBookingView";
import CourtOwnerScheduleView from "@/pages/CourtOwnerView/CourtOwnerScheduleView";
import CourtOwnerReportsView from "@/pages/CourtOwnerView/CourtOwnerReportsView";


import CoachDashboardView from "@/pages/CoachView/CoachDashboardView";
import CoachScheduleManagementView from "@/pages/CoachView/CoachScheduleManagementView";
import CoachTraineeManagementView from "@/pages/CoachView/CoachTraineeManagementView";
import CoachTrainingSessionManagementView from "@/pages/CoachView/CoachTrainingSessionManagementView";
import CoachTrainingPackageManagementView from "@/pages/CoachView/CoachTrainingPackageManagementView";
import CoachAnalyticsView from "@/pages/CoachView/CoachAnalyticsView";



import MatchFinder from "@/pages/MatchFinder";
import CourtFeedback from "@/pages/CourtFeedback";
import CourtCalendar from "@/pages/CourtCalendar";
import ManageCourts from "@/pages/ManageCourts";
import CoachList from "@/pages/CoachList";
import CoachDetails from "@/pages/CoachDetails";
import BookCoachSession from "@/pages/BookCoachSession";
import CourtReport from "@/pages/CourtReport";
import NewSlotPage from "@/pages/NewSlotPage";
import UpdateSlotPage from "@/pages/UpdateSlotPage";
import SlotListPage from "@/pages/SlotListPage";
import { Book } from "lucide-react";
import BookingListPage from "@/pages/BookingListPage";
import SportsCenter from "@/pages/SportsCenter";
import Feedback from "@/pages/Feedback";
import CourtsManage from "@/pages/CourtsManage";

function App() {
  return (
    <Routes>
      {/* General View */}
      <Route
        path="/"
        element={
          <Layout>
            <HomeView />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <Layout>
            <HomeView />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginView />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <SignUpView />
          </Layout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPasswordView />
          </Layout>
        }
      />
      <Route
        path="/support"
        element={
          <Layout>
            <SupportView />
          </Layout>
        }
      />
      <Route
        path="/sports-center"
        element={
          <Layout>
            <SportsCenter />
          </Layout>
        }
      />
      <Route
        path="/browse-courts"
        element={
          <Layout>
            <BrowseCourtsView />
          </Layout>
        }
      />
      <Route
        path="/court/:id"
        element={
          <Layout>
            <CourtDetailsView />
          </Layout>
        }
      />
      <Route
        path="/coaches"
        element={
          <Layout>
            <CoachList />
          </Layout>
        }
      />
      <Route
        path="/coach/:id"
        element={
          <Layout>
            <CoachDetails />
          </Layout>
        }
      />


      {/* User View */}
      <Route
        path="/book-court/:id" // Add new route for court details
        element={
          <Layout>
            <BookCourtView />
          </Layout>
        }
      />

      <Route
        path="/user/dashboard"
        element={
          <UserDashboardView />
        }
      />
      <Route
        path="/user/bookings"
        element={
          <UserCourtBookingManagementView />
        }
      />
      <Route
        path="/user/matching"
        element={
          <UserTeamMatchingManagementView />
        }
      />
      <Route
        path="/user/coachings"
        element={
          <UserCoachingManagementView />
        }
      />


      {/* Court Owner View */}
      <Route
        path="/court-owner/dashboard"
        element={
          <CourtOwnerDashboardView />
        }
      />
      <Route
        path="/court-owner/courts"
        element={
          <CourtOwnerCourtListView />
        }
      />
      <Route
        path="/court-owner/bookings"
        element={
          <CourtOwnerBookingView />
        }
      />
      <Route
        path="/court-owner/schedule"
        element={
          <CourtOwnerScheduleView />
        }
      />
      <Route
        path="/court-owner/reports"
        element={
          <CourtOwnerReportsView />
        }
      />

      {/* Coach View  */}
      <Route
        path="/coach/dashboard"
        element={
          <CoachDashboardView />
        }
      />
      <Route
        path="/coach/sessions"
        element={
          <CoachTrainingSessionManagementView />
        }
      />
      <Route
        path="/coach/schedule"
        element={
          <CoachScheduleManagementView />
        }
      />
      <Route
        path="/coach/trainees"
        element={
          <CoachTraineeManagementView />
        }
      />
      <Route
        path="/coach/packages"
        element={
          <CoachTrainingPackageManagementView />
        }
      />
      <Route
        path="/coach/analytics"
        element={
          <CoachAnalyticsView />
        }
      />


      {/* To be updated */}
      <Route
        path="/court/calendar/:id"
        element={
          <Layout>
            <CourtCalendar />
          </Layout>
        }
      />
      <Route
        path="/manage-courts/:id"
        element={
          <Layout>
            <ManageCourts />
          </Layout>
        }
      />
      <Route
        path="/slots/new"
        element={
          <Layout>
            <NewSlotPage />
          </Layout>
        }
      />
      <Route
        path="/slots/edit/:id"
        element={
          <Layout>
            <UpdateSlotPage />
          </Layout>
        }
      />
      <Route
        path="/slots/list"
        element={
          <Layout>
            <SlotListPage />
          </Layout>
        }
      />
      <Route
        path="/booking/list"
        element={
          <Layout>
            <BookingListPage />
          </Layout>
        }
      />

      <Route
        path="/match-opponents"
        element={
          <Layout>
            <MatchFinder />
          </Layout>
        }
      />
      <Route
        path="/court-feedback/:courtId"
        element={
          <Layout>
            <CourtFeedback />
          </Layout>
        }
      />
      <Route
        path="/feedback/:courtId"
        element={
          <Layout>
            <Feedback />
          </Layout>
        }
      />

      <Route
        path="/CourtsManage"
        element={
          <Layout>
            <CourtsManage />
          </Layout>
        }
      />

      <Route
        path="/book-coach/:id"
        element={
          <Layout>
            <BookCoachSession />
          </Layout>
        }
      />
      <Route
        path="/reports"
        element={
          // <Layout>
          <CourtReport />
          // </Layout>
        }
      />
    </Routes>
  );
}

export default App;
