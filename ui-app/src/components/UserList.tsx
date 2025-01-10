import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './../App.css';

interface BusinessUser {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
}

const UserList = () => {
    const [users, setUsers] = useState<BusinessUser[]>([]);
    const [formData, setFormData] = useState<Partial<BusinessUser>>({
        first_name: '',
        last_name: '',
        role: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchUsers = () => {
        const token = localStorage.getItem('accessToken');  
        if (!token) {
            console.error('No token found!');
            return;
        }
        
        axios.get('http://localhost:8000/api/users/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => setUsers(response.data))
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Please check your token.');
            } else {
                console.error('Error fetching users:', error);
            }
        });
    };
    

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found!');
            return;
        }

        const endpoint = isEditing && formData.id 
            ? `http://localhost:8000/api/users/${formData.id}/update/` 
            : 'http://localhost:8000/api/users/';

        const method = isEditing ? axios.put : axios.post;

        method(endpoint, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(() => {
                setIsEditing(false);
                setFormData({ first_name: '', last_name: '', role: '' });
                fetchUsers();
            })
            .catch((error) =>
                console.error(
                    `Error ${isEditing ? 'updating' : 'adding'} user:`,
                    error
                )
            );
    };

    const handleDeleteUser = (id: number) => {

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found!');
            return;
        }

        axios
            .delete(`http://localhost:8000/api/users/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
            })
            .then(() => fetchUsers())
            .catch((error) => console.error('Error deleting user:', error));
    };

    const handleEditClick = (user: BusinessUser) => {
        setFormData(user);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="main-container">
            <div className="form-container">
                <h1>Let's level up your brand, together</h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="input-container">
                        <label htmlFor="first-name">First name</label>
                        <input
                            type="text"
                            id="first-name"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="last-name">Last name</label>
                        <input
                            type="text"
                            id="last-name"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            required
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Role</option>
                            <option value="Menedżer">Menedżer</option>
                            <option value="Projektant Produktu">Projektant Produktu</option>
                            <option value="CTO">CTO</option>
                            <option value="Lider Zespołu">Lider Zespołu</option>
                        </select>
                    </div>
                    <br></br>
                    <br></br>
                    <label className="checkbox-privacy">
                        <input type="checkbox" id="privacyCheck" required/>
                        <span></span>
                        You agree to our friendly <u>privacy policy</u>
                    </label>
                    <button type="submit">{isEditing ? 'CHANGE' : 'SUBMIT'}</button>
                </form>
            </div>

            <ul>
            {users.map(user => (
                    <li key={user.id}>
                        <div className="user-info" onClick={() => handleEditClick(user)}>
                            <span className={'user-name'}>{user.first_name} {user.last_name}</span>
                            <div className="role">{user.role}</div>
                        </div>
                        <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
