import { fetchUserProfile } from 'app/globalSlice';
import AdminProtectedRoute from 'components/AdminProtectedRoute';
import JoinFromLink from 'components/JoinFromLink';
import ProtectedRoute from 'components/ProtectedRoute';
import Account from 'features/Account';
import Admin from 'features/Admin';

import ChatLayout from 'layout/ChatLayout';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
function App() {
    const [isFetch, setIsFetch] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.global);
    console.log('user', user);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            if (token) dispatch(fetchUserProfile());

            setIsFetch(true);
        };

        fetchProfile();
        // eslint-disable-next-line
    }, []);

    if (!isFetch) return '';

    return (
        <div className="App">
            <Routes>
                <Route path="/*" element={<Account />} />
                <Route
                    path="/tl-link/:conversationId"
                    element={<JoinFromLink />}
                />
                <Route
                    path="chat/*"
                    element={
                        <ProtectedRoute
                            isAllowed={user && user.role === 'USER'}
                        >
                            <ChatLayout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/*"
                    element={
                        <AdminProtectedRoute
                            isAllowed={user && user.role === 'ADMIN'}
                        >
                            <Admin />
                        </AdminProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
