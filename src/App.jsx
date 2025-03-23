import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import CourtFeedback from "./pages/CourtFeedback";
import HomeTest from "./pages/HomeTest";
import BrowseCourts from "./pages/BrowseCourts";
import CourtDetails from "./pages/CourtDetails";
import CourtCalendar from "./pages/CourtCalendar";
import ManageCourts from "./pages/ManageCourts";
import CoachList from "./pages/CoachList";
import CoachDetails from "./pages/CoachDetails";
import BookCoachSession from "./pages/BookCoachSession";
import CourtReport from "./pages/CourtReport";
import BookCourt from "./pages/BookCourt";
import Support from "./pages/Support";
import ForgotPassword from "./pages/ForgotPassword";
import NewSlotPage from "./pages/NewSlotPage";
import UpdateSlotPage from "./pages/UpdateSlotPage";
import SlotListPage from "./pages/SlotListPage";
import MatchingPage from "./pages/MatchingPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomeTest />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/browse-courts"
        element={
          <Layout>
            <BrowseCourts />
          </Layout>
        }
      />
      <Route
        path="/court/:id" // Add new route for court details
        element={
          <Layout>
            <CourtDetails />
          </Layout>
        }
      />
      <Route
        path="/book-court/:id" // Add new route for court details
        element={
          <Layout>
            <BookCourt />
          </Layout>
        }
      />
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
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <SignUp />
          </Layout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPassword />
          </Layout>
        }
      />
      <Route
        path="/support"
        element={
          <Layout>
            <Support />
          </Layout>
        }
      />
      <Route
        path="/feedback/:courtId"
        element={
          <Layout>
            <CourtFeedback />
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
      <Route path="/match-opponents" element={<MatchingPage />} />
    </Routes>
  );
}

export default App;
