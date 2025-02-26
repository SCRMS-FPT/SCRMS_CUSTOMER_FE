import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import MatchFinder from "./pages/MatchFinder";
import CourtFeedback from "./pages/CourtFeedback";
import CoachList from "./pages/CoachList";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
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
      <Route
        path="/coaches"
        element={
          <Layout>
            <CoachList />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
