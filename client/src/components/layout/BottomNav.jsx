import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Calendar, Heart, ClipboardList } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const navs = [
        { icon: <Home />, path: '/', label: 'Inicio' },
        { icon: <MessageCircle />, path: '/mensajes', label: 'Chat' },
        { icon: <Calendar />, path: '/mis-citas', label: 'Citas' },
        { icon: <Heart />, path: '/favoritos', label: 'Favs' },
        { icon: <ClipboardList />, path: '/historial', label: 'Histo' },
    ];

    return (
        <div className="flex justify-around items-center h-16">
            {navs.map((n) => (
                <Link
                    key={n.path}
                    to={n.path}
                    className={`flex flex-col items-center transition-colors ${location.pathname === n.path ? 'text-primary' : 'text-gray-300'
                        }`}
                >
                    {React.cloneElement(n.icon, { size: 24, strokeWidth: 1.5 })}
                </Link>
            ))}
        </div>
    );
};

export default BottomNav;
