import { Route } from "react-router-dom";
import Layout from "@/components/Layout";

import CourtFeedback from "@/pages/CourtFeedback";
import CourtCalendar from "@/pages/CourtCalendar";
import ManageCourts from "@/pages/ManageCourts";
import NewSlotPage from "@/pages/NewSlotPage";
import UpdateSlotPage from "@/pages/UpdateSlotPage";
import SlotListPage from "@/pages/SlotListPage";
import BookingListPage from "@/pages/BookingListPage";

const LegacyRoutes = [
  <Route
    key="court-calendar"
    path="/court/calendar/:id"
    element={
      <Layout>
        <CourtCalendar />
      </Layout>
    }
  />,
  <Route
    key="manage-courts"
    path="/manage-courts/:id"
    element={
      <Layout>
        <ManageCourts />
      </Layout>
    }
  />,
  <Route
    key="slots-new"
    path="/slots/new"
    element={
      <Layout>
        <NewSlotPage />
      </Layout>
    }
  />,
  <Route
    key="slots-edit"
    path="/slots/edit/:id"
    element={
      <Layout>
        <UpdateSlotPage />
      </Layout>
    }
  />,
  <Route
    key="slots-list"
    path="/slots/list"
    element={
      <Layout>
        <SlotListPage />
      </Layout>
    }
  />,
  <Route
    key="booking-list"
    path="/booking/list"
    element={
      <Layout>
        <BookingListPage />
      </Layout>
    }
  />,
  <Route
    key="court-feedback"
    path="/court-feedback/:courtId"
    element={
      <Layout>
        <CourtFeedback />
      </Layout>
    }
  />,
];

export default LegacyRoutes;
