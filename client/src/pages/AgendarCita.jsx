import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import axios from 'axios';
import { ChevronLeft, Clock, Calendar, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgendarCita = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();

    // 1. Definición de todos los estados (Hooks) siempre al principio
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [horasOcupadas, setHorasOcupadas] = useState([]);

    // Extraemos al doctor del estado de navegación
    const doctor = location.state?.doctor;

    const todosLosSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30'
    ];

    // 2. useEffect siempre al nivel superior
    useEffect(() => {
        // Solo ejecutamos la lógica si tenemos los datos necesarios
        if (fechaSeleccionada && doctor?.id && token) {
            const consultarDisponibilidad = async () => {
                try {
                    setIsLoading(true);
                    setError('');
                    const response = await axios.get(`http://localhost:4000/api/citas/disponibilidad`, {
                        params: { id_especialista: doctor.id, fecha: fechaSeleccionada },
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHorasOcupadas(response.data.horasOcupadas || []);
                } catch (err) {
                    console.error(err);
                    setError('No se pudo sincronizar la disponibilidad.');
                } finally {
                    setIsLoading(false);
                }
            };
            consultarDisponibilidad();
        }
    }, [fechaSeleccionada, doctor?.id, token]);

    // 3. Comprobación de seguridad DESPUÉS de los hooks
    if (!doctor) {
        return <Navigate to="/doctores/nutricion" replace />;
    }

    const handleAgendar = async () => {
        if (!fechaSeleccionada || !horaSeleccionada) return;
        try {
            setIsLoading(true);
            await axios.post('http://localhost:4000/api/citas/agendar', {
                id_especialista: doctor.id,
                fecha: fechaSeleccionada,
                hora: horaSeleccionada,
                motivo_consulta: 'Consulta de nutrición'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/cita-agendada', {
                state: {
                    doctor: doctor.nombre,
                    especialidad: doctor.especialidad,
                    fecha: fechaSeleccionada,
                    hora: horaSeleccionada
                }
            });
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Este horario se acaba de ocupar.');
            } else {
                setError('Error al procesar la cita.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateClick = (arg) => {
        const hoy = new Date().toISOString().split('T')[0];
        if (arg.dateStr < hoy) return;
        setFechaSeleccionada(arg.dateStr);
        setHoraSeleccionada(null);
    };

    const formatearFechaTitulo = (fechaStr) => {
        const opciones = { weekday: 'long', day: 'numeric', month: 'short' };
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    return (
        <div className="max-w-md mx-auto min-h-screen pb-32 bg-white">
            {/* Topbar */}
            <div className="px-4 py-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-20 shadow-glass">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-textos">Elegir Horario</h1>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* Info Doctor */}
                <div className="bg-secondary/30 p-4 rounded-3xl flex items-center gap-4 border border-blue-50">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg uppercase">
                        {doctor.nombre?.charAt(0) || 'D'}
                    </div>
                    <div>
                        <h3 className="font-bold text-textos">{doctor.nombre}</h3>
                        <p className="text-xs text-primary font-bold uppercase tracking-wider">{doctor.especialidad}</p>
                    </div>
                </div>

                {error && <p className="bg-red-50 text-red-600 p-3 rounded-xl text-xs text-center border border-red-100">{error}</p>}

                {/* Calendario */}
                <div className="bg-surface p-4 rounded-3xl shadow-soft">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm uppercase">
                        <Calendar size={16} /> Selecciona el día
                    </div>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        locale={esLocale}
                        weekends={false}
                        headerToolbar={{ left: 'title', center: '', right: 'prev,next' }}
                        height="auto"
                        dateClick={handleDateClick}
                        dayCellClassNames={(arg) => arg.dateStr === fechaSeleccionada ? 'fc-day-selected-kuxtal' : ''}
                    />
                </div>

                {/* Horarios */}
                {fechaSeleccionada && (
                    <div className="bg-surface p-5 rounded-3xl shadow-soft animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-sm font-bold text-textos mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-primary" /> Horarios disponibles
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {todosLosSlots.map((h) => {
                                const isOccupied = horasOcupadas.includes(h);
                                const isSelected = h === horaSeleccionada;
                                return (
                                    <button
                                        key={h}
                                        disabled={isOccupied}
                                        onClick={() => setHoraSeleccionada(h)}
                                        className={`py-3 rounded-xl text-[11px] font-bold border-2 transition-all ${isOccupied ? 'bg-gray-100 border-gray-100 text-gray-400' :
                                                isSelected ? 'bg-primary border-primary text-white shadow-md' :
                                                    'bg-white border-gray-50 text-primary hover:border-primary'
                                            }`}
                                    >{h}</button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Botones de acción corregidos */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-500 rounded-kuxtal font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                        <ArrowLeft size={18} /> Volver atrás
                    </button>

                    <button
                        onClick={handleAgendar}
                        disabled={!fechaSeleccionada || !horaSeleccionada || isLoading}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-kuxtal font-bold text-sm transition-all ${fechaSeleccionada && horaSeleccionada && !isLoading
                                ? 'bg-primary text-white shadow-lg active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? 'Cargando...' : 'Confirmar cita'}
                        {!isLoading && <CheckCircle size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgendarCita;
