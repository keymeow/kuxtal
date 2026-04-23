import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ChevronLeft, Calendar, Clock, UserCircle,
    XCircle, FileText, CheckCircle2, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TABS = [
    { key: 'proximas', label: 'Próximas' },
    { key: 'pasadas', label: 'Pasadas' },
    { key: 'canceladas', label: 'Canceladas' },
];

const estadoBadge = {
    proximas: 'bg-green-100 text-green-700',
    pasadas: 'bg-secondary/60 text-textos',
    canceladas: 'bg-red-100 text-red-600',
};
const estadoLabel = {
    proximas: 'Programada',
    pasadas: 'Completada',
    canceladas: 'Cancelada',
};

const MisCitas = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [citas, setCitas] = useState([]);
    const [tabActiva, setTabActiva] = useState('proximas');
    const [vistaActual, setVistaActual] = useState('lista');
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');
    const [alertaExito, setAlertaExito] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ── Datos ────────────────────────────────────────────────────
    const fetchCitas = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/api/citas/mis-citas', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCitas(res.data);
        } catch (error) {
            console.error('Error cargando citas', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCitas(); }, [token]);

    // ── Filtrado ─────────────────────────────────────────────────
    const ahora = new Date();
    const proximas = citas.filter(c => c.estado === 'programada' && new Date(c.fecha_hora_inicio) >= ahora);
    const pasadas = citas.filter(c => c.estado === 'completada' || (c.estado === 'programada' && new Date(c.fecha_hora_inicio) < ahora));
    const canceladas = citas.filter(c => c.estado === 'cancelada');
    const citasFiltradas = tabActiva === 'proximas' ? proximas : tabActiva === 'pasadas' ? pasadas : canceladas;

    // ── Acciones ─────────────────────────────────────────────────
    const handleVerDetalle = (cita) => { setCitaSeleccionada(cita); setVistaActual('detalle'); };
    const handleIrCancelar = (cita) => { setCitaSeleccionada(cita); setVistaActual('cancelar'); };

    const confirmarCancelacion = async () => {
        if (!motivoCancelacion) return alert('Selecciona un motivo');
        try {
            await axios.put(
                `http://localhost:4000/api/citas/${citaSeleccionada.id}/cancelar`,
                { motivo: motivoCancelacion },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAlertaExito('¡Cita cancelada exitosamente!');
            setTimeout(() => { setAlertaExito(false); setVistaActual('lista'); fetchCitas(); }, 2000);
        } catch (error) {
            console.error('Error al cancelar', error);
        }
    };

    const handleOcultarCita = async (id) => {
        try {
            await axios.put(`http://localhost:4000/api/citas/${id}/ocultar`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCitas();
        } catch (error) {
            console.error('Error al ocultar', error);
        }
    };

    const handleReagendar = (cita) => {
        const docData = { id: cita.id_especialista, nombre: cita.doctor_nombre, especialidad: cita.especialidad };
        navigate('/agendar/nutricion', { state: { doctor: docData } });
    };

    // ── Formato ──────────────────────────────────────────────────
    const formatearFecha = (iso) =>
        new Date(iso).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formatearHora = (iso) =>
        new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    // ════════════════════════════════════════════════════════════
    // VISTA 1 — LISTA
    // ════════════════════════════════════════════════════════════
    if (vistaActual === 'lista') return (
        <div className="animate-in fade-in duration-500 pb-24 relative">

            {/* Header */}
            <section className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-textos mb-2">Mis Citas</h1>
                <p className="text-textos/60">Gestiona y consulta tus encuentros con nuestros especialistas.</p>
            </section>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-surface-low rounded-kuxtal w-fit mb-10">
                {TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setTabActiva(key)}
                        className={`px-6 py-2.5 rounded-[20px] text-sm font-bold transition-all ${tabActiva === key
                                ? 'bg-primary text-white shadow-soft'
                                : 'text-textos/60 hover:bg-white/60'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Cards */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
                </div>
            ) : citasFiltradas.length === 0 ? (
                <div className="bg-surface rounded-kuxtal p-10 shadow-soft flex flex-col items-center text-center">
                    <div className="bg-secondary/40 p-4 rounded-full mb-4">
                        <Calendar size={28} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <p className="font-bold text-textos mb-1">No tienes citas en esta sección</p>
                    <p className="text-sm text-textos/50">Cuando tengas citas aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {citasFiltradas.map(cita => (
                        <div
                            key={cita.id}
                            className="bg-surface rounded-kuxtal p-6 shadow-soft flex flex-col gap-5 hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Cabecera de la card */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-secondary rounded-[16px] flex items-center justify-center text-primary font-black text-xl uppercase shrink-0">
                                        {cita.doctor_nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-textos leading-tight">{cita.doctor_nombre}</h3>
                                        <p className="text-sm text-textos/60">{cita.especialidad}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${estadoBadge[tabActiva]}`}>
                                        {estadoLabel[tabActiva]}
                                    </span>
                                    {tabActiva === 'canceladas' && (
                                        <button onClick={() => handleOcultarCita(cita.id)} className="text-textos/30 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Fecha y hora */}
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-surface-low">
                                <div className="flex items-center gap-3">
                                    <Calendar size={20} className="text-primary/60" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-[11px] text-textos/40 font-medium mb-0.5">Fecha</p>
                                        <p className="text-sm font-bold text-textos capitalize">
                                            {new Date(cita.fecha_hora_inicio).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={20} className="text-primary/60" strokeWidth={1.5} />
                                    <div>
                                        <p className="text-[11px] text-textos/40 font-medium mb-0.5">Hora</p>
                                        <p className="text-sm font-bold text-textos">{formatearHora(cita.fecha_hora_inicio)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex flex-wrap gap-3">
                                {tabActiva === 'proximas' && (
                                    <>
                                        <button
                                            onClick={() => handleVerDetalle(cita)}
                                            className="flex-1 min-w-[120px] bg-gradient-to-b from-primary to-primary-dark text-white py-3 rounded-full font-bold text-sm shadow-soft hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            onClick={() => handleReagendar(cita)}
                                            className="flex-1 min-w-[120px] bg-surface-low text-textos font-bold text-sm rounded-full hover:bg-secondary/50 transition-colors py-3"
                                        >
                                            Reprogramar
                                        </button>
                                        <button
                                            onClick={() => handleIrCancelar(cita)}
                                            className="w-full bg-red-50 text-red-500 py-3 rounded-kuxtal font-bold text-sm hover:bg-red-100 transition-colors"
                                        >
                                            Cancelar Cita
                                        </button>
                                    </>
                                )}
                                {tabActiva === 'pasadas' && (
                                    <>
                                        <button
                                            onClick={() => handleVerDetalle(cita)}
                                            className="flex-1 bg-surface-low text-textos font-bold text-sm rounded-full hover:bg-secondary/50 transition-colors py-3"
                                        >
                                            Ver Información
                                        </button>
                                        <button
                                            onClick={() => handleReagendar(cita)}
                                            className="flex-1 bg-gradient-to-b from-primary to-primary-dark text-white py-3 rounded-full font-bold text-sm shadow-soft hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Agendar de nuevo
                                        </button>
                                    </>
                                )}
                                {tabActiva === 'canceladas' && (
                                    <button
                                        onClick={() => handleVerDetalle(cita)}
                                        className="w-full bg-surface-low text-textos font-bold text-sm rounded-full hover:bg-secondary/50 transition-colors py-3"
                                    >
                                        Ver Información
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => navigate('/nutricion')}
                className="fixed bottom-8 right-8 bg-gradient-to-b from-primary to-primary-dark text-white p-5 rounded-full shadow-soft flex items-center gap-3 group hover:pr-6 active:scale-90 transition-all duration-300 overflow-hidden"
            >
                <Plus size={24} strokeWidth={2} className="shrink-0" />
                <span className="max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap font-bold text-sm transition-all duration-500">
                    Agendar Cita
                </span>
            </button>
        </div>
    );

    // ════════════════════════════════════════════════════════════
    // VISTA 2 — DETALLE
    // ════════════════════════════════════════════════════════════
    if (vistaActual === 'detalle') return (
        <div className="max-w-2xl animate-in slide-in-from-right duration-300 pb-24">
            <button
                onClick={() => setVistaActual('lista')}
                className="flex items-center gap-2 text-textos/60 hover:text-primary font-semibold text-sm mb-8 transition-colors"
            >
                <ChevronLeft size={18} /> Volver a Mis Citas
            </button>

            <h1 className="text-3xl font-extrabold tracking-tight text-textos mb-8">Detalle de la Cita</h1>

            <div className="bg-surface rounded-kuxtal p-8 shadow-soft space-y-6">
                {/* Doctor */}
                <div className="flex items-center gap-4 pb-6 border-b border-surface-low">
                    <div className="w-16 h-16 bg-secondary rounded-[16px] flex items-center justify-center text-primary font-black text-2xl uppercase">
                        {citaSeleccionada.doctor_nombre.charAt(0)}
                    </div>
                    <div>
                        <p className="text-[11px] text-textos/40 font-bold uppercase tracking-widest mb-1">Especialista</p>
                        <h2 className="text-xl font-bold text-textos">{citaSeleccionada.doctor_nombre}</h2>
                        <p className="text-sm text-primary font-semibold">{citaSeleccionada.especialidad}</p>
                    </div>
                </div>

                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <Calendar size={22} className="text-primary/60 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-[11px] text-textos/40 font-bold uppercase tracking-widest mb-1">Fecha</p>
                            <p className="font-bold text-textos capitalize">{formatearFecha(citaSeleccionada.fecha_hora_inicio)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock size={22} className="text-primary/60 mt-0.5" strokeWidth={1.5} />
                        <div>
                            <p className="text-[11px] text-textos/40 font-bold uppercase tracking-widest mb-1">Hora</p>
                            <p className="font-bold text-textos">{formatearHora(citaSeleccionada.fecha_hora_inicio)} hrs.</p>
                        </div>
                    </div>
                </div>

                {/* Motivo cancelación */}
                {citaSeleccionada.motivo_cancelacion && (
                    <div className="bg-red-50 p-4 rounded-kuxtal">
                        <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-1">Motivo de cancelación</p>
                        <p className="text-sm text-red-700">{citaSeleccionada.motivo_cancelacion}</p>
                    </div>
                )}
            </div>

            {/* Acciones (solo si está programada y es futura) */}
            {citaSeleccionada.estado === 'programada' && new Date(citaSeleccionada.fecha_hora_inicio) >= ahora && (
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setVistaActual('cancelar')}
                        className="flex-1 py-4 bg-red-50 text-red-500 rounded-full font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        Cancelar cita
                    </button>
                    <button
                        onClick={() => handleReagendar(citaSeleccionada)}
                        className="flex-1 py-4 bg-gradient-to-b from-primary to-primary-dark text-white rounded-full font-bold text-sm shadow-soft hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Reagendar
                    </button>
                </div>
            )}
        </div>
    );

    // ════════════════════════════════════════════════════════════
    // VISTA 3 — CANCELAR
    // ════════════════════════════════════════════════════════════
    if (vistaActual === 'cancelar') return (
        <div className="max-w-2xl animate-in slide-in-from-bottom duration-300 pb-24 relative">
            {alertaExito && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-kuxtal font-bold flex items-center gap-2 shadow-soft z-50 animate-bounce">
                    <CheckCircle2 size={20} /> {alertaExito}
                </div>
            )}

            <button
                onClick={() => setVistaActual('lista')}
                className="flex items-center gap-2 text-textos/60 hover:text-primary font-semibold text-sm mb-8 transition-colors"
            >
                <ChevronLeft size={18} /> Volver
            </button>

            {/* Cabecera */}
            <div className="flex flex-col items-center text-center mb-10">
                <div className="bg-red-50 p-5 rounded-full mb-4">
                    <XCircle size={40} className="text-red-500" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-textos mb-2">Cancelar Cita</h1>
                <p className="text-textos/60 max-w-md">
                    Estás a punto de cancelar tu cita con{' '}
                    <span className="font-bold text-textos">{citaSeleccionada.doctor_nombre}</span>{' '}
                    el {formatearFecha(citaSeleccionada.fecha_hora_inicio)}.
                </p>
            </div>

            <div className="bg-surface rounded-kuxtal p-8 shadow-soft space-y-6">
                {/* Motivo */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-textos">Motivo principal *</label>
                    <select
                        value={motivoCancelacion}
                        onChange={(e) => setMotivoCancelacion(e.target.value)}
                        className="w-full bg-surface-low border-none rounded-[20px] px-6 py-4 text-textos focus:ring-2 focus:ring-red-400/30 outline-none appearance-none"
                    >
                        <option value="">Selecciona un motivo...</option>
                        <option value="Problemas de salud">Problemas de salud</option>
                        <option value="Conflicto de horario">Conflicto de horario / Clases</option>
                        <option value="Olvido">Olvidé la cita</option>
                        <option value="Otro">Otro motivo</option>
                    </select>
                </div>

                {/* Detalles opcionales */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-textos flex items-center gap-2">
                        <FileText size={16} strokeWidth={1.5} /> Detalles adicionales
                    </label>
                    <textarea
                        placeholder="Cuéntanos más (opcional)..."
                        className="w-full bg-surface-low border-none rounded-[20px] px-6 py-4 text-textos placeholder:text-textos/30 focus:ring-2 focus:ring-red-400/30 outline-none min-h-[120px] resize-none"
                    />
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <button
                    onClick={confirmarCancelacion}
                    className="w-full py-4 bg-red-500 text-white rounded-full font-bold text-sm shadow-soft hover:bg-red-600 active:scale-95 transition-all"
                >
                    Confirmar Cancelación
                </button>
                <button
                    onClick={() => setVistaActual('lista')}
                    className="w-full py-4 text-textos/50 font-bold text-sm hover:text-textos transition-colors"
                >
                    No, regresar
                </button>
            </div>
        </div>
    );
};

export default MisCitas;
