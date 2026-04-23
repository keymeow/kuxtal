import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, UserCircle, CalendarDays, Clock3, Home, ArrowLeft } from 'lucide-react';

const CitaAgendada = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos los detalles de la cita pasados desde AgendarCita.jsx
    const cita = location.state;

    // Si alguien intenta entrar a esta URL sin haber agendado (state vacío), 
    // lo expulsamos al Home por seguridad.
    if (!cita) {
        return <Navigate to="/" replace />;
    }

    // Formateo de fecha para el resumen de la cita
    const formatearFechaResumen = (fechaStr) => {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50/50 flex flex-col items-center py-10 px-6 animate-in zoom-in duration-500 pb-24">

            {/* Icono de Éxito Gigante y Animado */}
            <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6 border-4 border-white shadow-soft animate-bounce">
                <CheckCircle2 size={60} strokeWidth={2.5} />
            </div>

            {/* Mensaje Principal */}
            <h1 className="text-3xl font-bold text-textos text-center leading-tight mb-3">¡Cita agendada exitosamente!</h1>
            <p className="text-sm text-gray-500 text-center leading-relaxed mb-10 max-w-xs">
                Se ha enviado una confirmación a tu correo institucional. Revisa la sección "Mis Citas" para ver el seguimiento.
            </p>

            {/* Resumen de la Cita */}
            <div className="w-full bg-white rounded-3xl p-6 border border-gray-100 shadow-soft space-y-6 mb-12">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider border-b border-gray-100 pb-2">Resumen de la consulta</h3>

                {/* Especialista */}
                <div className="flex items-center gap-4">
                    <UserCircle size={32} className="text-gray-300 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400 font-semibold">Especialista</p>
                        <p className="text-base font-bold text-textos">{cita.doctor}</p>
                        <p className="text-xs font-semibold text-primary">{cita.especialidad}</p>
                    </div>
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-4">
                    <CalendarDays size={32} className="text-gray-300 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400 font-semibold">Fecha</p>
                        <p className="text-base font-bold text-textos capitalize">{formatearFechaResumen(cita.fecha)}</p>
                    </div>
                </div>

                {/* Hora */}
                <div className="flex items-center gap-4">
                    <Clock3 size={32} className="text-gray-300 shrink-0" />
                    <div>
                        <p className="text-xs text-gray-400 font-semibold">Hora seleccionada</p>
                        <p className="text-base font-bold text-textos">{cita.hora} hrs.</p>
                    </div>
                </div>
            </div>

            {/* Botones de Escape */}
            <div className="w-full space-y-3">
                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-primary text-white p-4 rounded-kuxtal font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
                >
                    <Home size={18} /> Volver al Inicio
                </button>
                <button
                    onClick={() => navigate('/agendar/nutricion')}
                    className="w-full text-gray-400 text-sm flex items-center justify-center gap-1.5 hover:text-primary transition-colors py-2"
                >
                    <ArrowLeft size={16} /> Agendar otra cita
                </button>
            </div>

        </div>
    );
};

export default CitaAgendada;
