import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import UserList from './components/UserList';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute'; 

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <UserList />
                        </PrivateRoute>
                    }
                />
                
                <Route
                    path="/users/:id/update"
                    element={
                        <PrivateRoute>
                            <div>Update User Component</div>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/users/:id"
                    element={
                        <PrivateRoute>
                            <div>User Details Component</div>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
