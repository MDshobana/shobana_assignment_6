import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EmployeeForm from '../assets/dashboardData';
import AttendanceForm from '../assets/attendanceData';
import TasksForm from '../assets/tasks';


import {
    userLoggedOut,
    selectCurrentToken,
    selectCurrentUser,
} from '../slices/authSlice';
import '../../src/App.css';
import { setLoading, setEmployeeData, clearEmployee } from '../slices/dashboardSlice';



async function getJsonOrThrow(res, label) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `${label} HTTP ${res.status}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
        const text = await res.text().catch(() => '');
        throw new Error(
            `${label} returned non-JSON (content-type: ${ct}). Body: ${text?.slice(0, 200) || '(empty)'}`
        );
    }
    return res.json();
}



const fetchEmployeeData = async (dispatch, employeeID, token) => {
    dispatch(setLoading(true));

    try {
        const withAuth = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};


        const employeeResponse = await fetch(`/api/employee/${employeeID}`, withAuth);
        const employee = await getJsonOrThrow(employeeResponse, 'Employee');

        const attendanceResponse = await fetch(`/api/attendance?employeeId=${employeeID}`, withAuth);
        const attendance = await getJsonOrThrow(attendanceResponse, 'Attendance');

        const tasksResponse = await fetch(`/api/tasks?employeeId=${employeeID}`, withAuth);
        const tasks = await getJsonOrThrow(tasksResponse, 'Tasks');

        dispatch(setEmployeeData({ employee, attendance, tasks }));
    } finally {
        dispatch(setLoading(false));

    }
};

function Dashboard() {
    const token = useSelector(selectCurrentToken);
    const user = useSelector(selectCurrentUser);

    const dispatch = useDispatch();
    const [output, setOutput] = useState('');

    useEffect(() => {
        if (token) {
            fetchEmployeeData(dispatch, 1, token);
        }

    }, [dispatch, token]);

    const callDashboard = useCallback(async () => {
        setOutput('');
        if (!token) {
            setOutput('No token in Redux—login first.');
            return;
        }


        try {
            await fetchEmployeeData(dispatch, 1, token);
            setOutput('Data reloaded successfully.');
        } catch (err) {
            setOutput(`Reload failed: ${err?.message || err}`);
        }
    }, [dispatch, token]);


    const handleLogout = () => {
        dispatch(userLoggedOut());
        dispatch(clearEmployee());
        setForm(initialForm);
    };


    return (
        <div style={{ marginTop: 16 }}>
            <div>Logged in as: <b>{user ?? 'Unknown'}</b></div>
            <div>Token present: <b>{token ? 'Yes' : 'No'}</b></div>
            <button onClick={callDashboard} disabled={!token}>
                Dashboard
            </button>
            <button onClick={handleLogout} style={{ marginLeft: 8 }}>
                Logout
            </button>
            {output && <pre style={{ marginTop: 8 }}>{output}</pre>}
            <EmployeeForm />
            <AttendanceForm />
            <TasksForm />
        </div>
    );


}

export default Dashboard;