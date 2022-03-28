import { createSlice } from "@reduxjs/toolkit";
import { formatConfig } from "../../services/helpers/functions";

const initialState = {
  value: [],
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    fetchSiteConfig: (state, action) => {
      state.value = formatConfig(action.payload.data);
    },
    updateSiteConfig: (state, action) => {
      state.value[action.payload.data.key] = action.payload.data.value;
    },
  },
});

export const { fetchSiteConfig, updateSiteConfig } = configSlice.actions;

export default configSlice.reducer;
