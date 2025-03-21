import { Route } from "react-router-dom";
import Layout from "@/components/Layout";

import BookCourtView from "@/pages/UserView/BookCourtView";
import UserDashboardView from "@/pages/UserView/UserDashboardView";
import UserCourtBookingManagementView from "@/pages/UserView/UserCourtBookingManagementView";
import UserTeamMatchingManagementView from "@/pages/UserView/UserTeamMatchingManagementView";
import UserCoachingManagementView from "@/pages/UserView/UserCoachingManagementView";
import MatchFinder from "@/pages/MatchFinder";
import Feedback from "@/pages/Feedback";
import BookCoachSession from "@/pages/BookCoachSession";
import TransactionHistoryPage from "@/pages/TransactionHistoryPage";

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
    element={<UserDashboardView />}
  />,
  <Route
    key="user-bookings"
    path="/user/bookings"
    element={<UserCourtBookingManagementView />}
  />,
  <Route
    key="user-matching"
    path="/user/matching"
    element={<UserTeamMatchingManagementView />}
  />,
  <Route
    key="user-coachings"
    path="/user/coachings"
    element={<UserCoachingManagementView />}
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
