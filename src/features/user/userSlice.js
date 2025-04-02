import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../../services/authService";

// Import actions as functions to avoid circular dependency
let clearFavoritesAction = null;
let fetchUserFavoritesAction = null;

// Function to set the favorite actions after they are imported
export const setFavoriteActions = (fetchUserFavorites, clearFavorites) => {
  fetchUserFavoritesAction = fetchUserFavorites;
  clearFavoritesAction = clearFavorites;
};

// Async thunk to login user
export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const data = await loginUser(email, password);

      // Fetch user profile data
      if (data.user) {
        dispatch(fetchUserProfile(data.user.id));
        // Kullanıcı favorilerini yükle, eğer aksiyon ayarlanmışsa
        if (fetchUserFavoritesAction) {
          dispatch(fetchUserFavoritesAction());
        }
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to register user
export const register = createAsyncThunk(
  "user/register",
  async ({ email, password, fullName }, { rejectWithValue, dispatch }) => {
    try {
      const data = await registerUser(email, password, fullName);

      // Yeni kayıt olan kullanıcı için favorileri yükle (boş olacak)
      if (data.user && fetchUserFavoritesAction) {
        dispatch(fetchUserFavoritesAction());
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to logout user
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutUser();
      // Kullanıcı çıkış yaptığında favorileri temizle, eğer aksiyon ayarlanmışsa
      if (clearFavoritesAction) {
        dispatch(clearFavoritesAction());
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get current user session
export const getSession = createAsyncThunk(
  "user/getSession",
  async (_, { dispatch }) => {
    const user = await getCurrentUser();

    // Fetch user profile if user exists
    if (user) {
      dispatch(fetchUserProfile(user.id));
      // Kullanıcı oturumu varsa favorileri yükle, eğer aksiyon ayarlanmışsa
      if (fetchUserFavoritesAction) {
        dispatch(fetchUserFavoritesAction());
      }
    }

    return user;
  }
);

// Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const profile = await getUserProfile(userId);
      return profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  userName: "",
  userProfile: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateNames(state, action) {
      state.userName = action.payload;
    },
    resetName(state) {
      state.userName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.userName = action.payload.user?.user_metadata?.full_name || "";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.userName = action.payload.user?.user_metadata?.full_name || "";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userName = "";
        state.userProfile = null;
        state.status = "idle";
        state.error = null;
      })
      // Get session cases
      .addCase(getSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userName = action.payload?.user_metadata?.full_name || "";
      })
      // Fetch user profile cases
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        // If profile has a full_name, use it
        if (action.payload?.full_name) {
          state.userName = action.payload.full_name;
        }
      });
  },
});

export const { updateNames, resetName } = userSlice.actions;
export default userSlice.reducer;
