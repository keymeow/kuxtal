import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar, Clock, ChevronRight, User,
    Salad, Brain, Stethoscope, Syringe
} from 'lucide-react';

const modulos = [
    {
        id: 1,
        nombre: 'Nutrición',
        desc: 'Planes alimenticios y seguimiento personalizado.',
        icon: Salad,
        bg: 'bg-orange-50 hover:bg-orange-100',
        iconColor: 'text-orange-600',
        btnColor: 'bg-orange-600',
        decorColor: 'text-orange-300',
        path: '/nutricion',
    },
    {
        id: 2,
        nombre: 'Psicología',
        desc: 'Apoyo emocional y bienestar mental para tu día.',
        icon: Brain,
        bg: 'bg-purple-50 hover:bg-purple-100',
        iconColor: 'text-purple-600',
        btnColor: 'bg-purple-600',
        decorColor: 'text-purple-300',
        path: '/psicologia',
    },
    {
        id: 3,
        nombre: 'Médico General',
        desc: 'Consulta integral para diagnósticos y prevención.',
        icon: Stethoscope,
        bg: 'bg-blue-50 hover:bg-blue-100',
        iconColor: 'text-blue-600',
        btnColor: 'bg-blue-600',
        decorColor: 'text-blue-300',
        path: '/medico',
    },
    {
        id: 4,
        nombre: 'Enfermería',
        desc: 'Curaciones, inyecciones y cuidados básicos.',
        icon: Syringe,
        bg: 'bg-red-50 hover:bg-red-100',
        iconColor: 'text-red-600',
        btnColor: 'bg-red-600',
        decorColor: 'text-red-300',
        path: '/enfermeria',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [proximasCitas, setProximasCitas] = useState([]);
    const [isLoadingCitas, setIsLoadingCitas] = useState(true);

    useEffect(() => {
        const fetchCitasHome = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/citas/mis-citas', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ahora = new Date();
                const futuras = response.data
                    .filter(c => c.estado === 'programada' && new Date(c.fecha_hora_inicio) >= ahora)
                    .sort((a, b) => new Date(a.fecha_hora_inicio) - new Date(b.fecha_hora_inicio));
                setProximasCitas(futuras.slice(0, 2));
            } catch (error) {
                console.error('Error al cargar citas en Home', error);
            } finally {
                setIsLoadingCitas(false);
            }
        };
        if (token) fetchCitasHome();
    }, [token]);

    const formatearFecha = (iso) =>
        new Date(iso).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
    const formatearHora = (iso) =>
        new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="space-y-12 animate-in fade-in duration-700">

            {/* ── Bienvenida ────────────────────────────────────────── */}
            <section>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-textos mb-2">
                    Bienvenido
                </h1>
                <p className="text-textos/60 text-lg">¿En qué área necesitas atención?</p>
            </section>

            {/* ── Grid de servicios ─────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modulos.map((m) => {
                    const Icon = m.icon;
                    return (
                        <div
                            key={m.id}
                            onClick={() => navigate(m.path)}
                            className={`group ${m.bg} transition-all duration-300 rounded-kuxtal p-8 h-56 flex flex-col justify-between cursor-pointer hover:scale-[1.02] relative overflow-hidden shadow-soft`}
                        >
                            <div className="relative z-10">
                                <Icon size={36} className={`${m.iconColor} mb-4`} strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-textos">{m.nombre}</h3>
                                <p className={`${m.iconColor} opacity-70 text-sm mt-1`}>{m.desc}</p>
                            </div>

                            {/* Icono decorativo de fondo */}
                            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                                <Icon size={120} className={m.decorColor} strokeWidth={1} />
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); navigate(m.path); }}
                                className={`${m.btnColor} text-white self-start px-6 py-2 rounded-full font-bold text-sm mt-4 relative z-10`}
                            >
                                Agendar
                            </button>
                        </div>
                    );
                })}
            </section>

            {/* ── Próximas Citas ────────────────────────────────────── */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-textos">Próximas Citas</h2>
                    <button
                        onClick={() => navigate('/mis-citas')}
                        className="text-primary font-bold flex items-center gap-1 hover:underline text-sm"
                    >
                        Ver todas <ChevronRight size={16} />
                    </button>
                </div>

                {/* Cargando */}
                {isLoadingCitas ? (
                    <div className="bg-surface rounded-kuxtal p-6 shadow-soft animate-pulse flex items-center justify-center min-h-[100px]">
                        <div className="w-7 h-7 border-4 border-secondary border-t-primary rounded-full animate-spin" />
                    </div>

                ) : proximasCitas.length === 0 ? (
                    /* Sin citas */
                    <div className="bg-surface rounded-kuxtal p-8 shadow-soft flex flex-col items-center text-center">
                        <div className="bg-secondary/40 p-4 rounded-full mb-4">
                            <Calendar size={28} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <p className="font-bold text-textos mb-1">No tienes citas próximas</p>
                        <p className="text-sm text-textos/60 mb-5">Agenda una consulta para cuidar tu salud.</p>
                        <button
                            onClick={() => navigate('/nutricion')}
                            className="px-6 py-2.5 bg-gradient-to-b from-primary to-primary-dark text-white text-sm font-bold rounded-full shadow-soft hover:scale-105 transition-all"
                        >
                            Agendar ahora
                        </button>
                    </div>

                ) : (
                    /* Lista de citas */
                    <div className="space-y-4">
                        {proximasCitas.map((cita) => (
                            <div
                                key={cita.id}
                                onClick={() => navigate('/mis-citas')}
                                className="bg-surface rounded-kuxtal p-6 shadow-soft cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                    {/* Info doctor */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-secondary rounded-kuxtal flex items-center justify-center text-primary shrink-0">
                                            <User size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-textos">{cita.doctor_nombre}</h4>
                                            <p className="text-textos/60 text-sm flex items-center gap-1">
                                                <User size={12} strokeWidth={1.5} /> {cita.especialidad}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Chips fecha/hora */}
                                    <div className="flex flex-wrap gap-3">
                                        <div className="bg-secondary/50 px-4 py-2 rounded-full flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" strokeWidth={1.5} />
                                            <span className="text-sm font-semibold text-textos capitalize">
                                                {formatearFecha(cita.fecha_hora_inicio)}
                                            </span>
                                        </div>
                                        <div className="bg-secondary/50 px-4 py-2 rounded-full flex items-center gap-2">
                                            <Clock size={14} className="text-primary" strokeWidth={1.5} />
                                            <span className="text-sm font-semibold text-textos">
                                                {formatearHora(cita.fecha_hora_inicio)}
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight size={20} className="text-textos/30 hidden md:block shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default Home;
