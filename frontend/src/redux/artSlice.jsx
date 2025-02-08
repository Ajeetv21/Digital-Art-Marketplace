import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/arts";

// Fetch all artworks
export const fetchArts = createAsyncThunk("art/fetchArts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch artworks");
  }
});

// Fetch a single artwork by ID
export const fetchArtById = createAsyncThunk("art/fetchArtById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch artwork details");
  }
});

// Update an artwork
export const updateArt = createAsyncThunk("art/updateArt", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(updatedData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    return response.data; // Return updated artwork
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update artwork");
  }
});

// Delete an artwork
export const deleteArt = createAsyncThunk("art/deleteArt", async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id; // Return deleted artwork ID
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to delete artwork");
  }
});

const artSlice = createSlice({
  name: "art",
  initialState: {
    arts: [],
    selectedArt: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArts.fulfilled, (state, action) => {
        state.loading = false;
        state.arts = action.payload;
      })
      .addCase(fetchArts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchArtById.fulfilled, (state, action) => {
        state.selectedArt = action.payload;
      })
      .addCase(fetchArtById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateArt.fulfilled, (state, action) => {
        state.selectedArt = action.payload;
        state.arts = state.arts.map((art) => (art._id === action.payload._id ? action.payload : art));
      })
      .addCase(updateArt.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteArt.fulfilled, (state, action) => {
        state.arts = state.arts.filter((art) => art._id !== action.payload);
      })
      .addCase(deleteArt.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default artSlice.reducer;
