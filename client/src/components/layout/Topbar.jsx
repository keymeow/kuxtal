import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Topbar = () => {
    return (
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-glass">
            <Link
                to="/mi-perfil"
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary shadow-soft hover:scale-105 transition-transform"
            >
                <User size={20} />
            </Link>

            <h1 className="font-display text-xl font-bold text-primary tracking-display">Kuxtal</h1>

            <Link
                to="/notificaciones"
                className="relative w-10 h-10 bg-surface-low rounded-full flex items-center justify-center text-textos hover:bg-secondary hover:text-primary transition-colors"
            >
                <Bell size={20} strokeWidth={1.5} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>
        </div>
    );
};

export default Topbar;
