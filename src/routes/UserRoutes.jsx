import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

import BookCourtView from "@/pages/UserView/BookCourtView";
import UserDashboardView from "@/pages/UserView/UserDashboardView";
import UserCourtBookingManagementView from "@/pages/UserView/UserCourtBookingManagementView";
import UserBookingDetailView from "@/pages/UserView/UserBookingDetailView";
import UserTeamMatchingManagementView from "@/pages/UserView/UserTeamMatchingManagementView";
import UserMatchingDetailView from "@/pages/UserView/UserMatchingDetailView";
import UserCoachingManagementView from "@/pages/UserView/UserCoachingManagementView";
import UserCoachDetailView from "@/components/UserPage/UserCoachDetailView";
import UserCoachScheduleDetailView from "@/pages/UserView/UserCoachScheduleDetailView";
import UserFeedbackView from "@/pages/UserView/UserFeedbackView";
import UserFeedbackDetailView from "@/pages/UserView/UserFeedbackDetailView";
import UserDepositView from "@/pages/UserView/UserDepositView";
import UserTransactionView from "@/pages/UserView/UserTransactionView";
import MatchFinder from "@/pages/MatchFinder";
import Feedback from "@/pages/Feedback";
import BookCoachSession from "@/pages/BookCoachSession";
import TransactionHistoryPage from "@/pages/TransactionHistoryPage";

import UserSidebar from "@/components/Userpage/UserSidebar";






const UserRoutes = [
  <Route
    key="book-court"
    path="/book-court/:id"
    element={
      <Layout>
        <BookCourtView />
      </Layout>
    }
  />,
  <Route
    key="user-dashboard"
    path="/user/dashboard"
    element={
      <UserSidebar>
        <UserDashboardView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-bookings"
    path="/user/bookings"
    element={
      <UserSidebar>
        <UserCourtBookingManagementView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-booking-details"
    path="/user/bookings/:id"
    element={
      <UserSidebar>
        <UserBookingDetailView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-matching"
    path="/user/matching"
    element={
      <UserSidebar>
        <UserTeamMatchingManagementView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-matching-details"
    path="/user/matching/:id"
    element={
      <UserSidebar>
        <UserMatchingDetailView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-coachings"
    path="/user/coachings"
    element={
      <UserSidebar>
        <UserCoachingManagementView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-coach-details"
    path="/user/coach/:coachId"
    element={
      <UserSidebar>
        <UserCoachDetailView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-coaching-schedule-details"
    path="/user/coachings/schedule/:scheduleId"
    element={
      <UserSidebar>
        <UserCoachScheduleDetailView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-feedbacks"
    path="/user/feedbacks"
    element={
      <UserSidebar>
        <UserFeedbackView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-feedback-details"
    path="/user/feedbacks/:id"
    element={
      <UserSidebar>
        <UserFeedbackDetailView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-transactions"
    path="/user/transactions"
    element={
      <UserSidebar>
        <UserTransactionView />
      </UserSidebar>
    }
  />,
  <Route
    key="user-deposit"
    path="/wallet/deposit"
    element={<UserDepositView />}
  />,
  <Route
    key="match-opponents"
    path="/match-opponents"
    element={
      <Layout>
        <MatchFinder />
      </Layout>
    }
  />,
  <Route
    key="feedback"
    path="/feedback/:courtId"
    element={
      <Layout>
        <Feedback />
      </Layout>
    }
  />,
  <Route
    key="book-coach"
    path="/book-coach/:id"
    element={
      <Layout>
        <BookCoachSession />
      </Layout>
    }
  />,
  <Route
    key="history"
    path="/History"
    element={
      <Layout>
        <TransactionHistoryPage />
      </Layout>
    }
  />,
];

export default UserRoutes;
