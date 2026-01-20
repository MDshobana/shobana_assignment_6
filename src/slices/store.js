import {configureStore} from '@reduxjs/toolkit';
import authReducer from "./authSlice"
import dashboardReducer from "./dashboardSlice"

const store = configureStore({
    reducer:{
        auth: authReducer,
        employee: dashboardReducer,
    }
})

export default store;