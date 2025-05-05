import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

import BookCourtView from "@/pages/UserView/BookCourtView";
import UserDashboardView from "@/pages/UserView/UserDashboardView";
import UserCourtBookingManagementView from "@/pages/UserView/UserCourtBookingManagementView";
import UserBookingDetailView from "@/pages/UserView/UserBookingDetailView";
import UserCoachingManagementView from "@/pages/UserView/UserCoachingManagementView";
import UserCoachDetailView from "@/components/UserPage/UserCoachDetailView";
import UserFeedbackView from "@/pages/UserView/UserFeedbackView";
import UserFeedbackDetailView from "@/pages/UserView/UserFeedbackDetailView";
import UserDepositView from "@/pages/UserView/UserDepositView";
import UserSubscriptionsView from "@/pages/UserView/UserSubscriptionsView";
import UserSidebar from "@/components/UserPage/UserSidebar";

import ProfilePage from "../pages/UserView/ProfilePage";
import ChangePasswordPage from "../pages/UserView/ChangePasswordPage";
import FindMatchContainer from "@/pages/UserView/FindMatchContainer";
import UserCoachBookingDetailView from "../pages/UserView/UserCoachBookingDetailView";
import MessengerPage from "../pages/ChatView/MessengerPage";
import WalletWithdrawalForm from "@/pages/UserView/WalletWithdrawalForm";
import WithdrawalsList from "@/pages/UserView/WithdrawalsList";
import NotificationPage from "@/pages/UserView/UserNotification";
import MyWalletView from "@/pages/UserView/MyWalletView";
import DepositView from "@/pages/UserView/DepositView";
import MyUserDepositView from "@/pages/UserView/MyUserDepositView";
import MyUserWalletHistoryView from "@/pages/UserView/MyUserWalletHistoryView";
import MyUserWalletWithdrawalForm from "@/pages/UserView/MyUserWalletWithdrawalForm";
import MyUserWithdrawalsList from "@/pages/UserView/MyUserWithdrawalsList";
import { User } from "lucide-react";

const UserRoutes = [
  <Route
    key="book-court"
    path="/book-court/:id"
    element={
      <ProtectedRoute>
        <Layout>
          <BookCourtView />
        </Layout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-dashboard"
    path="/user/dashboard"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserDashboardView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-bookings"
    path="/user/bookings"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserCourtBookingManagementView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-booking-details"
    path="/user/bookings/:id"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserBookingDetailView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-coachings"
    path="/user/coachings"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserCoachingManagementView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-coach-details"
    path="/user/coach/:coachId"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserCoachDetailView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-feedbacks"
    path="/user/feedbacks"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserFeedbackView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-feedback-details"
    path="/user/feedbacks/:id"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserFeedbackDetailView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-subscriptions"
    path="/user/subscriptions"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserSubscriptionsView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-feedback-details"
    path="/user/coachings/:id"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <UserCoachBookingDetailView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="user-deposit"
    path="/wallet/deposit"
    element={
      <ProtectedRoute>
        <UserDepositView />
      </ProtectedRoute>
    }
  />,
  <Route
    key="my-wallet"
    path="/user/my-wallet"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <MyWalletView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="my-wallet-deposit"
    path="/user/deposit"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <MyUserDepositView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="my-wallet-withdrawal"
    path="/user/withdrawal"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <MyUserWalletWithdrawalForm />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
  key="my-wallet-withdrawal"
  path="/user/withdrawal/history"
  element={
    <ProtectedRoute>
      <UserSidebar>
        <MyUserWithdrawalsList />
      </UserSidebar>
    </ProtectedRoute>
  }
/>,
  <Route
    key="my-wallet-history"
    path="/user/wallet/history"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <MyUserWalletHistoryView />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="wallet-withdraw"
    path="/wallet/withdraw"
    element={
      <ProtectedRoute>
        <Layout>
          <WalletWithdrawalForm />
        </Layout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="wallet-withdrawals"
    path="/wallet/withdrawals"
    element={
      <ProtectedRoute>
        <Layout>
          <WithdrawalsList />
        </Layout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="match-opponents"
    path="/find-match"
    element={
      <ProtectedRoute>
        <Layout>
          <FindMatchContainer />
        </Layout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <ProfilePage />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="changepassword"
    path="/change-password"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <ChangePasswordPage />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="notifications"
    path="/notifications"
    element={
      <ProtectedRoute>
        <UserSidebar>
          <NotificationPage />
        </UserSidebar>
      </ProtectedRoute>
    }
  />,
  <Route
    key="messenger"
    path="/messenger"
    element={
      <ProtectedRoute>
        <MessengerPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key="messenger-conversation"
    path="/messenger/:chatId"
    element={
      <ProtectedRoute>
        <MessengerPage />
      </ProtectedRoute>
    }
  />,
];

export default UserRoutes;
