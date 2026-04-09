import { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/react';
import store from './slices/store';
import {
  userLoggedIn,
  userLoggedOut,
  selectCurrentToken,
  selectCurrentUser,
} from './slices/authSlice';
import './App.css';
import Dashboard from './routes/dashboardRoute';

// --- Nav ---
function NavBar() {
  return (
    <nav className="navbar">
      <h1>Login Form</h1>
    </nav>
  );
}

// --- Login Form ---
function LoginForm() {
  const dispatch = useDispatch();

  // Local form state (use these exact names consistently)
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Use selectors consistently
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorText('');
    setLoading(true);

    try {
      const res = await fetch('https://shobana-assignment-6.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, password: passWord }),
        mode:"cors"
      });

      
      if (!res.ok) {
        const text = await res.text();
        setErrorText(text || "Login failed");
        throw new Error(`Login failed: ${res.status} ${text}`);
      }

      const data = await res.json(); 

      const tokenValue = data.accessToken ?? data.token ?? null;
      console.log(tokenValue)
      if (!tokenValue) {
        throw new Error('Server did not return a token field.');
      }

      dispatch(userLoggedIn({ token: tokenValue, username: userName }));

      localStorage.setItem('token', tokenValue);
      localStorage.setItem('username', userName);

      setUserName('');
      setPassWord('');
      setErrorText('');
    } catch (err) {
      console.error(err);
      setErrorText(err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleLogin} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
          required
        />
        <button type="submit">
          Submit
        </button>
      </form>
      {errorText && (<p style= {{ color: "red", marginTop: "8px" }}> {errorText} </p>) }
    </div>
  );
}

// --- Protected call example ---



function LoginApp() {
  return (
    <div className="App">
      <NavBar />
      <div className="login-page">
        <LoginForm />
        <Dashboard />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <LoginApp />
      <SpeedInsights />
    </Provider>
  );
}

