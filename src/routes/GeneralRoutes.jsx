import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

import HomeView from "@/pages/GeneralView/HomeView";
import LoginView from "@/pages/GeneralView/LoginView";
import SignUpView from "@/pages/GeneralView/SignUpView";
import SupportView from "@/pages/GeneralView/SupportView";
import ForgotPasswordView from "@/pages/GeneralView/ForgotPasswordView";
import BrowseCourtsView from "@/pages/GeneralView/BrowseCourtsView";
import FindCourtBySportView from "@/pages/UserView/FindCourtBySportView";
import FindCourtByVenueView from "@/pages/UserView/FindCourtByVenueView";
import VenueDetailView from "@/pages/GeneralView/VenueDetailView";
import CourtDetailsView from "@/pages/GeneralView/CourtDetailsView";
import SportsCenter from "@/pages/UserView/SportsCenter";
import CoachList from "@/pages/CoachBooking/CoachList";
import CoachDetails from "@/pages/CoachBooking/CoachDetails";

import court_mock_data from "@/data/court_mock_data";
import PricingView from "@/pages/ServicePackage/PricingView";
import WalletView from "@/pages/UserView/WalletView";
import WalletHistoryView from "@/pages/UserView/WalletHistoryView";
import DepositView from "@/pages/UserView/DepositView";
import SubscribePackageView from "@/pages/ServicePackage/SubscribePackageView";
import SportCenterDetails from "@/pages/UserView/SportCenterDetails";

import ChatListView from "@/pages/ChatView/ChatListView";
import ChatView from "@/pages/ChatView/ChatView";
import NewChatView from "@/pages/ChatView/NewChatView";


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
        <FindCourtBySportView data={court_mock_data} />
      </Layout>
    }
  />,
  <Route
    key="courts-sport-type"
    path="/courts/sport/:sportType"
    element={
      <Layout className="bg-gray-50">
        <FindCourtBySportView data={court_mock_data} />
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
        <CoachList />
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
  <Route
    key="chat-list"
    path="/chats"
    element={
      <Layout>
        <ChatListView />
      </Layout>
    }
  />,
  <Route
    key="chat-view"
    path="/chats/:chatSessionId"
    element={
      <Layout>
        <ChatView />
      </Layout>
    }
  />,
  <Route
    key="new-chat"
    path="/new-chat"
    element={
      <Layout>
        <NewChatView />
      </Layout>
    }
  />
];

export default GeneralRoutes;
