import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'; 
import axios from 'axios';
import './../App.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            alert('Haslo musi zawierac co najmniej 8 znakow.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Hasła nie pasują do siebie!');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/register/',
                {username, email, password},
                {headers: {'Content-Type': 'application/json'}}
            );
            alert('Registration successful!');
            navigate('/login'); 
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
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
                    <div className="input-container">
                        <label htmlFor="password">Confirm password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            required
                        />
                    </div>
                    <br></br>
                    <br></br>
                    <label className="checkbox-privacy">
                        <input type="checkbox" id="privacyCheck" required/>
                        <span></span>
                        You agree to our friendly <u>privacy policy</u>
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
