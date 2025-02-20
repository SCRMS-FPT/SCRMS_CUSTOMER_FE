import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import MatchFinder from "./pages/MatchFinder";
import CourtFeedback from "./pages/CourtFeedback";
import HomeTest from "./pages/HomeTest";
import CourtList from "./pages/CourtList";
import CourtDetails from "./pages/CourtDetails";

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
        path="/court/list"
        element={
          <Layout>
            <CourtList />
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
