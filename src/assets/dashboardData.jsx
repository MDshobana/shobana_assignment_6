
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEmployeeData } from '../slices/dashboardSlice';


export const initialForm = {
    username: '',
    name: '',
    title: '',
    email: '',
  }

export default function EmployeeForm() {
  const selected = useSelector(selectEmployeeData);
  const employee = selected?.employee ?? selected;
  console.log('[EmployeeForm] employee from Redux:', employee);
  const [form, setForm] = useState(initialForm);


  useEffect(() => {
    if (employee) {
      setForm({
        username: employee.username ?? '',
        name: employee.name ?? '',
        title: employee.title ?? '',
        email: employee.email ?? '',
      });
    } else {
        setForm(initialForm);
    }
  }, [employee]);


  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  if (!employee) return <p>No employee loaded. Click “Dashboard” to load.</p>;

  return (
    <div style={{ marginTop: 16, maxWidth: 420 }}>
      <h3 style={{ marginBottom: 8 }}>Employee</h3>

      <div style={{ display: 'grid', gap: 8 }}>
        <label>
          Username: {' '}
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Name: {' '}
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Title: {' '}
          <input
            name="title"
            value={form.title}
            onChange={onChange}
          />
        </label>

        <label>
          Email: {' '}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
}
