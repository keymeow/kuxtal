import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Calendar, Heart, ClipboardList, User } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Inicio', path: '/', icon: <Home size={20} /> },
        { name: 'Mensajes', path: '/mensajes', icon: <MessageCircle size={20} /> },
        { name: 'Mis citas', path: '/mis-citas', icon: <Calendar size={20} /> },
        { name: 'Favoritos', path: '/favoritos', icon: <Heart size={20} /> },
        { name: 'Historial médico', path: '/historial', icon: <ClipboardList size={20} /> },
    ];

    return (
        <div className="w-64 bg-primary h-full text-white flex flex-col p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-white p-2 rounded-lg">💊</div>
                <h2 className="text-2xl font-bold tracking-tight">Kuxtal</h2>
            </div>

            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all ${location.pathname === item.path ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                            }`}
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
