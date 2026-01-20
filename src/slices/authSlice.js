import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {username: null, token: null},
    reducers: {
      userLoggedIn: (state, action) =>
      {
        // const {user, accessToken } = action.payload
        console.log(action.payload)
        state.username  = action.payload?.username ?? null;
        state.token = action.payload?.token ?? null;
      },
      userLoggedOut: (state) => {
        state.username = null;
        state.token = null;
      },
    },
  });
  
  export const { userLoggedIn, userLoggedOut } = authSlice.actions;
  
  export default authSlice.reducer;

  export const selectCurrentUser = (state) => state.auth.username
  export const selectCurrentToken = (state) => state.auth.token