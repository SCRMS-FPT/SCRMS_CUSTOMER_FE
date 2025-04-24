import { Route } from "react-router-dom";
import Layout from "@/components/GeneralComponents/Layout";

import HomeView from "@/pages/GeneralView/HomeView";
import LoginView from "@/pages/GeneralView/LoginView";
import SignUpView from "@/pages/GeneralView/SignUpView";
import SupportView from "@/pages/GeneralView/SupportView";
import ForgotPasswordView from "@/pages/GeneralView/ForgotPasswordView";
import BrowseCourtsView from "@/pages/GeneralView/BrowseCourtsView";
import CourtDetailsView from "@/pages/GeneralView/CourtDetailsView";
import SportsCenter from "@/pages/UserView/SportsCenter";
import CoachList from "@/pages/CoachBooking/CoachList";
import CoachDetails from "@/pages/CoachBooking/CoachDetails";

import PricingView from "@/pages/ServicePackage/PricingView";
import WalletView from "@/pages/UserView/WalletView";
import WalletHistoryView from "@/pages/UserView/WalletHistoryView";
import DepositView from "@/pages/UserView/DepositView";
import SubscribePackageView from "@/pages/ServicePackage/SubscribePackageView";
import SportCenterDetails from "@/pages/UserView/SportCenterDetails";

import NotFoundView from "@/pages/GeneralView/NotFoundView";
import Forbidden403 from "@/pages/Error/Forbidden403";
import VerificationView from "@/pages/GeneralView/VerificationView";
import ResetPasswordConfirmPage from "@/pages/GeneralView/ResetPasswordConfirmView";

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
    key="verify"
    path="/verify/:token"
    element={
      <Layout>
        <VerificationView />
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
  <Route //chưa có dịch sang tiếng việt
    key="court-details"
    path="/court/:id"
    element={
      <Layout>
        <CourtDetailsView />
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
    path="/coaches/:id"
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
    key="reset-password-confirm"
    path="/resetpasswordconfirm/:token"
    element={
      <Layout>
        <ResetPasswordConfirmPage />
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
];

export default GeneralRoutes;
