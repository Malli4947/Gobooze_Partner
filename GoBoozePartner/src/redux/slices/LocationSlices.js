import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
const API_KEY = 'AIzaSyCtTH8DV1-h4tYTSb-geYjdn71a0Up_63k';

const initialState = {
  currentLattitude: null,
  currentLongitude: null,
};

const LocationSlice = createSlice({
  name: 'locationSlice',
  initialState,
  reducers: {
    onGettingCoordinates: (state, action) => {
      state.currentLattitude = action.payload.lattitude;
      state.currentLongitude = action.payload.longitude;
    },
  },
});

export const {onGettingCoordinates} = LocationSlice.actions;
export default LocationSlice.reducer;
