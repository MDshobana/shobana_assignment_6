
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTasks } from '../slices/dashboardSlice';


export const initialForm = {
    employeeId: '',
    title: '',
    status: '',
    due: '',
    priority: ''
}

export default function TasksForm() {
    const selected = useSelector(selectTasks);
    const tasks = selected?.tasks ?? selected;
    console.log('[attendanceForm] attendance from Redux:', selected);
    const [form, setForm] = useState(initialForm);


    useEffect(() => {
        if (tasks) {
            setForm({
                employeeId: tasks.employeeId ?? '',
                title: tasks.title ?? '',
                status: tasks.status ?? '',
                due: tasks.due ?? '',
                priority: tasks.priority ?? '',
            });
        } else {
            setForm(initialForm);
        }
    }, [tasks]);


    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    if (!tasks) return;

    return (
        <>
            <ul>
            <b>employeeId → title → Status → Due → priority</b> 
            </ul>
            <ul>
                {tasks.map((t) => (
                    <li key={t.id} style={{ listStyle:"none" }}>
                        {t.employeeId} → {t.title} → {t.status} → {t.Due} {t.priority}
                    </li>
                ))}
            </ul>
        </>

    );
}
