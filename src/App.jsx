import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import MatchFinder from "./pages/MatchFinder";
import CourtFeedback from "./pages/CourtFeedback";
import HomeTest from "./pages/HomeTest";
import BrowseCourts from "./pages/BrowseCourts";
import CourtDetails from "./pages/CourtDetails";
import CourtCalendar from "./pages/CourtCalendar";

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
        path="/court/calendar/:id" 
        element={
          <Layout>
            <CourtCalendar />
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
        path="/match-opponents"
        element={
          <Layout>
            <MatchFinder />
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
    </Routes>
  );
}

export default App;
