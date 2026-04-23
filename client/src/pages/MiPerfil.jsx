import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ClipboardList, Settings, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MiPerfil = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        localStorage.removeItem('perfilCompleto');
        navigate('/login');
    };

    // Función para el botón Cerrar
    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="max-w-md mx-auto py-6 px-4 animate-in fade-in duration-500 pb-24">
            {/* Cabecera */}
            <h1 className="text-2xl font-bold text-textos mb-6">Mi Perfil</h1>

            {/* Tarjeta Principal de Usuario */}
            <div className="bg-primary rounded-kuxtal p-6 text-white flex items-center gap-4 mb-8 shadow-soft">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{user?.nombre} {user?.apellido_paterno}</h2>
                    <p className="opacity-80 text-sm">{user?.tipo_usuario} - UAM Cuajimalpa</p>
                </div>
            </div>

            <div className="space-y-3">

                {/* 1. Datos personales */}
                <Link to="/editar-datos-medicos" className="flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-gray-50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-primary rounded-full flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <span className="font-semibold text-textos">Editar datos personales</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Link>

                {/* 2. Historial médico */}
                <Link to="/historial" className="flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-gray-50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                            <ClipboardList size={20} />
                        </div>
                        <span className="font-semibold text-textos">Historial médico</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Link>

                {/* 3. Configuración */}
                <Link to="/configuracion" className="flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-gray-50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                            <Settings size={20} />
                        </div>
                        <span className="font-semibold text-textos">Configuración</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Link>

                {/* 4. Ayuda */}
                <Link to="/ayuda" className="flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-gray-50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                            <HelpCircle size={20} />
                        </div>
                        <span className="font-semibold text-textos">Ayuda</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Link>

                {/* 5. Politica de privacidad */}
                <Link to="/privacidad" className="flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-gray-50 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                            <HelpCircle size={20} />
                        </div>
                        <span className="font-semibold text-textos">Politica de privacidad</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </Link>

                {/* 6. Cerrar Sesión */}
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-white rounded-kuxtal shadow-sm border border-red-50 hover:bg-red-50 transition-colors mt-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                            <LogOut size={20} />
                        </div>
                        <span className="font-semibold text-red-600">Cerrar sesión</span>
                    </div>
                </button>

            </div>

            {/* Botón de Cerrar*/}
            <div className="mt-10">
                <button onClick={handleClose} className="w-full flex items-center justify-center gap-2 p-4 bg-gray-100 text-gray-600 rounded-kuxtal font-bold shadow-sm hover:bg-gray-200 transition-colors">
                    <X size={20} />
                    Cerrar
                </button>
            </div>

        </div>
    );
};

export default MiPerfil;
