import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Esto simulará la verificación de la base de datos, por ahora. 
    // En el futuro, el backend enviará un flag 'perfilCompleto' en el token o login.
    const perfilCompleto = localStorage.getItem('perfilCompleto') === 'true';

    if (!token) return <Navigate to="/login" replace />;

    // SI EL TOKEN EXISTE PERO EL PERFIL NO ESTÁ LLENO:
    // Lo forzamos a ir a /perfil, a menos que ya esté ahí.
    if (!perfilCompleto && location.pathname !== '/perfil') {
        return <Navigate to="/perfil" replace />;
    }

    // Si ya tiene perfil, lo dejamos ir al Home
    return <Outlet />;
};

export default ProtectedRoute;
