
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAttendanceData } from '../slices/dashboardSlice';


export const initialForm = {
    employeeId: '',
    date: '',
    status: '',
    checkIn: '',
    checkOut: ''
}

export default function AttendanceForm() {
    const selected = useSelector(selectAttendanceData);
    const attendance = selected?.attendance ?? selected;
    console.log('[attendanceForm] attendance from Redux:', selected);
    const [form, setForm] = useState(initialForm);


    useEffect(() => {
        if (attendance) {
            setForm({
                employeeId: attendance.employeeId ?? '',
                date: attendance.date ?? '',
                status: attendance.status ?? '',
                checkIn: attendance.checkIn ?? '',
                checkOut: attendance.checkOut ?? '',
            });
        } else {
            setForm(initialForm);
        }
    }, [attendance]);


    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    if (!attendance) return;

    return (
        <>
            <ul>
                <b>employeeId → date → checkIn → checkOut</b>
            </ul>
            <ul>
                {attendance.map((a) => (
                    <li key={a.id} style={{ listStyle:"none" }}>
                        {a.employeeId} → {a.date} → {a.status} → {a.checkIn} → {a.checkOut}
                    </li>
                ))}
            </ul>
        </>

    );
}

//   return (
//     <div style={{ marginTop: 16, maxWidth: 420 }}>
//       <h3 style={{ marginBottom: 8 }}>Attendance</h3>

//       <div style={{ display: 'grid', gap: 8 }}>
//         <label>
//         employeeId: {' '}
//           <input
//             name="employeeId"
//             value={form.employeeId}
//             onChange={onChange}
//             required
//           />
//         </label>

//         <label>
//         Date: {' '}
//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={onChange}
//           />
//         </label>

//         <label>
//         status: {' '}
//           <input
//             name="status"
//             value={form.status}
//             onChange={onChange}
//             required
//           />
//         </label>

//         <label>
//         checkIn: {' '}
//           <input
//             name="checkIn"
//             value={form.checkIn}
//             onChange={onChange}
//           />
//         </label>

//         <label>
//         checkOut: {' '}
//           <input
//             type="checkOut"
//             name="checkOut"
//             value={form.checkOut}
//             onChange={onChange}
//           />
//         </label>
//       </div>
//     </div>
//   );
//}
