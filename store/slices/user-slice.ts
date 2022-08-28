import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { any } from "prop-types";
import { Plan } from "types";

type state = {
  isSignIn: boolean;
  tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  };
  heroImages: string[];
  user: any;
  plans: { FREE: Plan; STANDARD: Plan; PREMIUM: Plan };
  currentPlan: Plan;
  isRefreshTokenFailed: boolean;
  collections: any;
};

const placeHolderPlan = {
  anualDiscount: 0,
  anualOriginalPrice: 0,
  anualPrice: 0,
  description: "Start learning the tool",
  displayName: "FREE",
  features: {
    COLLECTION_GENERATION_ATTEMPTS: { description: "", value: 0, unlimited: true },
    MAX_IMAGES_PER_COLLECTION: { description: "", value: 0 },
    CUSTOMER_SUPPORT: { description: "", value: "" },
  },
  monthlyDiscount: 0,
  monthlyOriginalPrice: 0,
  monthlyPrice: 0,
};

const initialState: state = {
  isSignIn: false,
  tokens: {
    accessToken: "",
    idToken: "",
    refreshToken: "",
  },
  heroImages: [],
  user: {},
  plans: {
    FREE: placeHolderPlan,
    STANDARD: placeHolderPlan,
    PREMIUM: placeHolderPlan,
  },
  currentPlan: placeHolderPlan,
  isRefreshTokenFailed: false,
  collections: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<any>) {
      state.tokens = action.payload;
    },
    setIsSignIn(state, action: PayloadAction<boolean>) {
      state.isSignIn = action.payload;
    },
    setHeroImages(state, action: PayloadAction<string[]>) {
      state.heroImages = action.payload;
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
    },
    setPlans(
      state,
      action: PayloadAction<{ FREE: Plan; STANDARD: Plan; PREMIUM: Plan }>
    ) {
      state.plans = action.payload;
    },
    setCurrentPlan(state, action: PayloadAction<Plan>) {
      state.currentPlan = action.payload;
    },
    setIsRefreshTokenFailed(state, action: PayloadAction<boolean>) {
      state.isRefreshTokenFailed = action.payload;
    },
    setCollections(state, action: PayloadAction<any>) {
      state.collections = action.payload;
    }
  },
});

export const {
  setTokens,
  setIsSignIn,
  setHeroImages,
  setUser,
  setPlans,
  setCurrentPlan,
  setIsRefreshTokenFailed,
  setCollections
} = userSlice.actions;
export default userSlice.reducer;
