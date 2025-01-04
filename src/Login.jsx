import React, { useState } from 'react';
    import { auth } from './firebase';
    import { signInWithEmailAndPassword } from "firebase/auth";

    const Login = ({ onLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState(null);

      const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
          await signInWithEmailAndPassword(auth, email, password);
          onLogin();
        } catch (error) {
          setError(error.message);
        }
      };

      return (
        <div>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    };

    export default Login;
