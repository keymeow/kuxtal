import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

// Decodifica el payload del JWT y verifica que no haya expirado
const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
        return token;
    } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => getValidToken());
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    });

    const login = useCallback((newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
