import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { username, password });
            const { access, refresh } = response.data;
    

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
    
            // aktualizacja stanu tokena
            window.dispatchEvent(new Event('storage'));
    
            navigate('/users');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed! Please check your credentials.');
        }
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="User name"
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
