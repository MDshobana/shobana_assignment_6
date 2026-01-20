import { createSlice } from '@reduxjs/toolkit'

const dashboardSlice = createSlice({
    name: 'employee',
    initialState: {employee: null, attendance: [], tasks: [], loading: false},
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setEmployeeData: (state, action) => {
            state.employee = action.payload.employee;
            state.attendance = action.payload.attendance;
            state.tasks = action.payload.tasks;
        },
        clearEmployee: (state) => {
            state.employee = null;
            state.attendance = [];
            state.tasks = [];

        }
    }

});

export const {setLoading, setEmployeeData, clearEmployee } = dashboardSlice.actions;
export const selectEmployeeData = (state) => state.employee.employee;
export const selectAttendanceData = (state) => state.employee.attendance;
export const selectTasks = (state) => state.employee.tasks;
export default dashboardSlice.reducer;