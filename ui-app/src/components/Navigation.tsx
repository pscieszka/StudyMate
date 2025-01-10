import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import './Navigation.css';

const Navigation = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('accessToken'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');    
        window.dispatchEvent(new Event('storage')); 
        navigate('/login');
    };

    return (
        <nav>
            <div className="main-container">
                <div className="navbar">
                    <Link to="/users">Home</Link>
                    {!token && (
                    <div className="right-links">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                    )}
                </div>
            </div>
            {token && <Link to="/users"></Link>}
            {token && <button className="logout-button" onClick={handleLogout}>Wyloguj</button>}
        </nav>
    );
};

export default Navigation;
