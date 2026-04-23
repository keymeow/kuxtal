import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Salad, Sparkles, ListChecks, ArrowRight, Calendar, MapPin } from 'lucide-react';

const Nutricion = () => {
    const navigate = useNavigate();

    const beneficios = [
        {
            titulo: 'Optimización Energética',
            desc: 'Mantén niveles constantes de energía durante tus clases y laboratorios.',
        },
        {
            titulo: 'Mejora Cognitiva',
            desc: 'Nutrientes específicos que apoyan la memoria y la concentración en exámenes.',
        },
        {
            titulo: 'Prevención',
            desc: 'Evita enfermedades crónicas relacionadas con el sedentarismo y el estrés.',
        },
        {
            titulo: 'Hábitos Duraderos',
            desc: 'Aprende a elegir y preparar alimentos de forma económica y saludable.',
        },
    ];

    const pasos = [
        {
            num: '1',
            titulo: 'Cuestionario Inicial',
            desc: 'Completa tu perfil de salud y hábitos diarios en línea.',
        },
        {
            num: '2',
            titulo: 'Elegir Especialista',
            desc: 'Selecciona al nutriólogo disponible que mejor se adapte a tu horario.',
        },
        {
            num: '3',
            titulo: 'Agendar Cita',
            desc: 'Confirma el día y hora para tu primera sesión presencial.',
        },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            {/* ── Hero Header ─────────────────────────────────────────── */}
            <section className="mb-10">
                <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">
                    Servicios de Salud UAM
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-textos tracking-tight leading-tight mb-4">
                    Consulta de <br />
                    <span className="text-primary">Nutrición</span>
                </h1>
                <p className="text-textos/70 max-w-2xl text-base leading-relaxed">
                    Mejora tu rendimiento académico y bienestar general a través de una alimentación
                    consciente y personalizada. Nuestro equipo de especialistas está listo para acompañarte.
                </p>
            </section>

            {/* ── Bento Grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ── Columna izquierda: Contenido principal ─────────────── */}
                <div className="lg:col-span-8 bg-surface rounded-kuxtal p-8 md:p-10 shadow-soft">

                    {/* ¿Qué es? */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-kuxtal-sm bg-secondary flex items-center justify-center text-primary">
                                <Salad size={20} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">¿Qué es?</h2>
                        </div>
                        <p className="text-textos/70 leading-relaxed">
                            Es un servicio integral diseñado para la comunidad de la UAM Cuajimalpa, donde
                            profesionales de la salud evalúan tus hábitos alimenticios actuales, composición
                            corporal y metas personales para diseñar un plan nutricional que se adapte a tu
                            estilo de vida universitario.
                        </p>
                    </div>

                    {/* ¿Para qué ir? */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-kuxtal-sm bg-secondary flex items-center justify-center text-primary">
                                <Sparkles size={20} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">¿Para qué ir?</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {beneficios.map((b) => (
                                <div key={b.titulo} className="p-4 bg-surface-low rounded-kuxtal">
                                    <p className="font-bold text-primary mb-1">{b.titulo}</p>
                                    <p className="text-sm text-textos/70">{b.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Procedimiento */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-kuxtal-sm bg-secondary flex items-center justify-center text-primary">
                                <ListChecks size={20} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Procedimiento</h2>
                        </div>

                        <div className="space-y-4">
                            {pasos.map((paso) => (
                                <div key={paso.num} className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-full bg-secondary text-primary text-sm font-bold flex items-center justify-center shrink-0">
                                        {paso.num}
                                    </div>
                                    <div className="p-4 bg-surface-low rounded-kuxtal flex-1">
                                        <h3 className="font-bold text-textos mb-1">{paso.titulo}</h3>
                                        <p className="text-sm text-textos/70">{paso.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-12 pt-8 border-t border-surface-low flex flex-col sm:flex-row items-center justify-end gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface-low text-textos font-semibold text-sm hover:bg-secondary/50 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => navigate('/cuestionario/nutricion')}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-b from-primary to-primary-dark text-white font-bold shadow-soft hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            Agendar Cita <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Columna derecha: Contexto visual ───────────────────── */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Disponibilidades */}
                    <div className="bg-secondary rounded-kuxtal p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-textos mb-1">Próximas Disponibilidades</h3>
                            <p className="text-sm text-textos/60 mb-6">
                                Contamos con espacios libres esta semana.
                            </p>
                            <div className="space-y-3">
                                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-kuxtal flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium text-textos">
                                        <Calendar size={14} className="text-primary" />
                                        Mañana, 10:00 AM
                                    </div>
                                    <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold tracking-wider">
                                        LIBRE
                                    </span>
                                </div>
                                <div className="bg-white/50 backdrop-blur-sm p-3 rounded-kuxtal flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium text-textos">
                                        <Calendar size={14} className="text-primary" />
                                        Jueves, 04:30 PM
                                    </div>
                                    <span className="bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold tracking-wider">
                                        LIBRE
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Decorativo */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    </div>

                    {/* Ubicación */}
                    <div className="bg-surface-low rounded-kuxtal p-6">
                        <h3 className="text-lg font-bold text-textos mb-4">Ubicación</h3>
                        <div className="bg-secondary/40 rounded-kuxtal p-4 mb-4 flex items-center justify-center min-h-[80px]">
                            <MapPin size={32} className="text-primary/40" strokeWidth={1.5} />
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                            <p className="text-xs text-textos/70 leading-relaxed">
                                <span className="font-bold text-textos block mb-0.5">
                                    Clínica Universitaria — Piso 4
                                </span>
                                Unidad Cuajimalpa, Av. Vasco de Quiroga 4871, Santa Fe Cuajimalpa.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Nutricion;
