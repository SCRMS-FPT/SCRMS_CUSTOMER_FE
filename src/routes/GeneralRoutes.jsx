import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

import HomeView from "@/pages/GeneralView/HomeView";
import LoginView from "@/pages/GeneralView/LoginView";
import SignUpView from "@/pages/GeneralView/SignUpView";
import SignoutView from "@/components/GeneralComponents/SignoutView";
import SupportView from "@/pages/GeneralView/SupportView";
import ForgotPasswordView from "@/pages/GeneralView/ForgotPasswordView";
import BrowseCourtsView from "@/pages/GeneralView/BrowseCourtsView";
import FindCourtBySportView from "@/pages/UserView/FindCourtBySportView";
import FindCourtByVenueView from "@/pages/UserView/FindCourtByVenueView";
import VenueDetailView from "@/pages/GeneralView/VenueDetailView";
import CourtDetailsView from "@/pages/GeneralView/CourtDetailsView";
import SportsCenter from "@/pages/UserView/SportsCenter";
import CoachListView from "@/pages/GeneralView/CoachListView";
import CoachDetails from "@/pages/CoachBooking/CoachDetails";

import PricingView from "@/pages/ServicePackage/PricingView";
import WalletView from "@/pages/UserView/WalletView";
import WalletHistoryView from "@/pages/UserView/WalletHistoryView";
import DepositView from "@/pages/UserView/DepositView";
import SubscribePackageView from "@/pages/ServicePackage/SubscribePackageView";
import SportCenterDetails from "@/pages/UserView/SportCenterDetails";

import ChatListView from "@/pages/ChatView/ChatListView";
import ChatView from "@/pages/ChatView/ChatView";
import NewChatView from "@/pages/ChatView/NewChatView";
import ChatPage from "@/pages/ChatView/ChatPage";
import NotFoundView from "@/pages/GeneralView/NotFoundView";
import UserProfileView from "@/pages/GeneralView/UserProfileView";
import Forbidden403 from "@/pages/Error/Forbidden403";

const GeneralRoutes = [
  <Route
    key="home"
    path="/"
    element={
      <Layout>
        <HomeView />
      </Layout>
    }
  />,
  <Route
    key="home-alt"
    path="/home"
    element={
      <Layout>
        <HomeView />
      </Layout>
    }
  />,
  <Route
    key="login"
    path="/login"
    element={
      <Layout>
        <LoginView />
      </Layout>
    }
  />,
  <Route
    key="signup"
    path="/signup"
    element={
      <Layout>
        <SignUpView />
      </Layout>
    }
  />,
  <Route
    key="logout"
    path="/logout"
    element={
      <Layout>
        <SignoutView />
      </Layout>
    }
  />,
  <Route
    key="forgot-password"
    path="/forgot-password"
    element={
      <Layout>
        <ForgotPasswordView />
      </Layout>
    }
  />,
  <Route
    key="support"
    path="/support"
    element={
      <Layout>
        <SupportView />
      </Layout>
    }
  />,
  <Route // Need update
    key="sports-center"
    path="/sports-centers"
    element={
      <Layout>
        <SportsCenter />
      </Layout>
    }
  />,
  <Route // Need update
    key="sports-center"
    path="/sports-center/:id"
    element={
      <Layout>
        <SportCenterDetails />
      </Layout>
    }
  />,
  <Route
    key="browse-courts"
    path="/browse-courts"
    element={
      <Layout>
        <BrowseCourtsView />
      </Layout>
    }
  />,
  <Route
    key="court-details"
    path="/court/:id"
    element={
      <Layout>
        <CourtDetailsView />
      </Layout>
    }
  />,
  <Route //need update
    key="courts-sport"
    path="/courts/sport"
    element={
      <Layout className="bg-gray-50">
        <FindCourtBySportView />
      </Layout>
    }
  />,
  <Route
    key="courts-sport-type"
    path="/courts/sport/:sportType"
    element={
      <Layout className="bg-gray-50">
        <FindCourtBySportView />
      </Layout>
    }
  />,
  <Route
    key="courts-venue"
    path="/courts/venue"
    element={
      <Layout className="bg-gray-50">
        <FindCourtByVenueView />
      </Layout>
    }
  />,
  <Route
    key="courts-venue"
    path="/venue/:venueId"
    element={
      <Layout className="bg-gray-50">
        <VenueDetailView />
      </Layout>
    }
  />,
  <Route
    key="coaches"
    path="/coaches"
    element={
      <Layout>
        <CoachListView />
      </Layout>
    }
  />,
  <Route
    key="coach-details"
    path="/coach/:id"
    element={
      <Layout>
        <CoachDetails />
      </Layout>
    }
  />,
  <Route
    key="pricing"
    path="/pricing"
    element={
      <Layout>
        <PricingView />
      </Layout>
    }
  />,
  <Route
    key="subscribe-package"
    path="/subscribe-package/:id"
    element={
      <Layout>
        <SubscribePackageView />
      </Layout>
    }
  />,
  <Route
    key="wallet"
    path="/wallet"
    element={
      <Layout>
        <WalletView />
      </Layout>
    }
  />,
  <Route
    key="wallet-history"
    path="/wallet/history"
    element={
      <Layout>
        <WalletHistoryView />
      </Layout>
    }
  />,
  <Route
    key="wallet-deposit"
    path="/wallet/deposit"
    element={
      <Layout>
        <DepositView />
      </Layout>
    }
  />,
  <Route key="chat-view" path="/chats" element={<ChatView />} />,
  <Route
    key="new-chat"
    path="/new-chat"
    element={
      <Layout>
        <NewChatView />
      </Layout>
    }
  />,
  <Route
    key="not-found"
    path="/404"
    element={
      <Layout>
        <NotFoundView />
      </Layout>
    }
  />,
  // 403 Forbidden route
  <Route key="forbidden" path="/forbidden" element={<Forbidden403 />} />,
  // <Route
  //   key="-profile-settings"
  //   path="/profile"
  //   element={
  //     <Layout>
  //       <UserProfileView />
  //     </Layout>
  //   }
  // />,
];

export default GeneralRoutes;
