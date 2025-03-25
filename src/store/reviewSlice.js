import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client } from "../API/ReviewApi";

// ✅ Initialize API Client
const apiClient = new Client();

/** 
 * 🔹 Fetch Reviews 
 * API: GET /api/reviews?subject_type=court&subject_id=uuid&page=1&limit=10
 */
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ subject_type, subject_id }, { rejectWithValue }) => {
    try {
      const response = await apiClient.getReviews(subject_type, subject_id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch reviews.");
    }
  }
);

/** 
 * 🔹 Post a Review 
 * API: POST /api/reviews
 */
export const postReview = createAsyncThunk(
  "reviews/postReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to post review.");
    }
  }
);

/** 
 * 🔹 Update a Review 
 * API: PUT /api/reviews/{reviewId}
 */
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, updatedData }, { rejectWithValue }) => {
    try {
      await apiClient.updateReview(reviewId, updatedData);
      return { reviewId, updatedData };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update review.");
    }
  }
);

/** 
 * 🔹 Delete a Review 
 * API: DELETE /api/reviews/{reviewId}
 */
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await apiClient.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete review.");
    }
  }
);

/** 
 * 🔹 Reply to a Review 
 * API: POST /api/reviews/{reviewId}/reply
 */
export const replyToReview = createAsyncThunk(
  "reviews/replyToReview",
  async ({ reviewId, replyData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.replyToReview(reviewId, replyData);
      return { reviewId, reply: response };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reply to review.");
    }
  }
);

// ✅ Initial State
const initialState = {
  reviews: [],
  status: "idle",
  error: null,
};

// ✅ Create Slice
const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(postReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews.push(action.payload);
      })

      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.reviewId
        );
        if (index !== -1) {
          state.reviews[index] = {
            ...state.reviews[index],
            ...action.payload.updatedData,
          };
        }
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })

      .addCase(replyToReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.reviewId
        );
        if (index !== -1) {
          state.reviews[index].replies = [
            ...(state.reviews[index].replies || []),
            action.payload.reply,
          ];
        }
      });
  },
});

// ✅ **Only One Export**
export default reviewSlice.reducer;

