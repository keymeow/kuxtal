import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, UtensilsCrossed, ShieldAlert, FlaskConical } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const selectClass =
    'w-full bg-secondary border-none rounded-[20px] px-6 py-4 text-textos focus:ring-2 focus:ring-primary/20 focus:bg-surface transition-all appearance-none cursor-pointer outline-none';

const CuestionarioNutricion = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [respuestas, setRespuestas] = useState({
        objetivoNutricional: '',
        objetivoOtroTexto: '',
        numComidas: '',
        restricciones: [],
        restriccionesOtraTexto: '',
        estudiosLaboratorio: '',
    });

    const handleChange = (e) => {
        setRespuestas({ ...respuestas, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (opcion) => {
        setRespuestas((prev) => {
            const tiene = prev.restricciones.includes(opcion);
            return {
                ...prev,
                restricciones: tiene
                    ? prev.restricciones.filter((i) => i !== opcion)
                    : [...prev.restricciones, opcion],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!respuestas.objetivoNutricional || !respuestas.numComidas || !respuestas.estudiosLaboratorio) {
            alert('Por favor, completa todas las preguntas para continuar.');
            return;
        }
        const datosFinales = {
            objetivoNutricional:
                respuestas.objetivoNutricional === 'Otro'
                    ? respuestas.objetivoOtroTexto
                    : respuestas.objetivoNutricional,
            numComidas: respuestas.numComidas,
            restricciones_alimento: respuestas.restricciones.includes('Otra')
                ? [...respuestas.restricciones.filter((r) => r !== 'Otra'), respuestas.restriccionesOtraTexto].join(', ')
                : respuestas.restricciones.join(', '),
            estudiosLaboratorio: respuestas.estudiosLaboratorio === 'Sí',
        };
        try {
            await axios.post('http://localhost:4000/api/nutrition/cuestionario', datosFinales, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/doctores/nutricion');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar el cuestionario');
        }
    };

    const opcionesRestricciones = [
        'Vegano',
        'Vegetariano',
        'Intolerancia a la lactosa',
        'Alergia al gluten / Celiaquía',
        'Ninguna',
        'Otra',
    ];

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-24">

            {/* ── Header ─────────────────────────────────────────────── */}
            <section className="mb-10">
                <div className="inline-block px-3 py-1 bg-secondary text-primary text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                    Formulario Médico
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-textos mb-4">
                    Cuestionario de nutrición
                </h1>
                <p className="text-textos/60 text-lg leading-relaxed max-w-2xl">
                    Para brindarte una atención personalizada y segura, completa los siguientes datos
                    sobre tus hábitos alimenticios y objetivos de salud.
                </p>
            </section>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── Pregunta 1: Objetivo ───────────────────────────────── */}
                <div className="bg-surface rounded-kuxtal p-8 shadow-soft">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-kuxtal-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Target size={20} strokeWidth={1.5} />
                        </div>
                        <label className="text-xl font-bold text-textos leading-snug">
                            1. ¿Cuál es tu objetivo nutricional principal?
                        </label>
                    </div>
                    <select
                        name="objetivoNutricional"
                        value={respuestas.objetivoNutricional}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="Control de peso">Control de peso</option>
                        <option value="Aumento de masa muscular">Aumento de masa muscular</option>
                        <option value="Mejora de hábitos alimenticios">Mejora de hábitos alimenticios</option>
                        <option value="Rendimiento deportivo">Rendimiento deportivo</option>
                        <option value="Condiciones médicas">Condiciones médicas (ej. diabetes)</option>
                        <option value="Otro">Otro</option>
                    </select>
                    {respuestas.objetivoNutricional === 'Otro' && (
                        <input
                            type="text"
                            name="objetivoOtroTexto"
                            value={respuestas.objetivoOtroTexto}
                            onChange={handleChange}
                            placeholder="Especifica tu objetivo..."
                            required
                            className="w-full mt-4 bg-surface-low border-none rounded-[20px] px-6 py-4 text-textos placeholder:text-textos/40 focus:ring-2 focus:ring-primary/20 outline-none animate-in slide-in-from-top-2"
                        />
                    )}
                </div>

                {/* ── Pregunta 2: Comidas ────────────────────────────────── */}
                <div className="bg-surface rounded-kuxtal p-8 shadow-soft">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-kuxtal-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <UtensilsCrossed size={20} strokeWidth={1.5} />
                        </div>
                        <label className="text-xl font-bold text-textos leading-snug">
                            2. ¿Cuántas comidas realizas al día?
                        </label>
                    </div>
                    <select
                        name="numComidas"
                        value={respuestas.numComidas}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="1 a 2">1 a 2 comidas</option>
                        <option value="3">3 comidas</option>
                        <option value="4 a 5">4 a 5 comidas</option>
                        <option value="Más de 5">Más de 5 comidas</option>
                    </select>
                </div>

                {/* ── Pregunta 3: Restricciones ─────────────────────────── */}
                <div className="bg-surface rounded-kuxtal p-8 shadow-soft">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-kuxtal-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <ShieldAlert size={20} strokeWidth={1.5} />
                        </div>
                        <label className="text-xl font-bold text-textos leading-snug">
                            3. ¿Tienes alguna restricción alimentaria?
                            <span className="block text-sm font-normal text-textos/50 mt-1">
                                Puedes seleccionar varias opciones
                            </span>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {opcionesRestricciones.map((opcion) => {
                            const checked = respuestas.restricciones.includes(opcion);
                            return (
                                <label
                                    key={opcion}
                                    className={`flex items-center gap-4 p-4 rounded-kuxtal cursor-pointer transition-colors ${checked ? 'bg-primary/10' : 'bg-surface-low hover:bg-secondary/50'
                                        }`}
                                >
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => handleCheckbox(opcion)}
                                            className="peer appearance-none w-6 h-6 border-2 border-textos/20 rounded-md checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <svg
                                            className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-textos">{opcion}</span>
                                </label>
                            );
                        })}
                    </div>
                    {respuestas.restricciones.includes('Otra') && (
                        <input
                            type="text"
                            name="restriccionesOtraTexto"
                            value={respuestas.restriccionesOtraTexto}
                            onChange={handleChange}
                            placeholder="Especifica tu restricción..."
                            required
                            className="w-full mt-4 bg-surface-low border-none rounded-[20px] px-6 py-4 text-textos placeholder:text-textos/40 focus:ring-2 focus:ring-primary/20 outline-none animate-in slide-in-from-top-2"
                        />
                    )}
                </div>

                {/* ── Pregunta 4: Laboratorio ───────────────────────────── */}
                <div className="bg-surface rounded-kuxtal p-8 shadow-soft">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-kuxtal-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <FlaskConical size={20} strokeWidth={1.5} />
                        </div>
                        <label className="text-xl font-bold text-textos leading-snug">
                            4. ¿Cuentas con estudios de laboratorio recientes?
                            <span className="block text-sm font-normal text-textos/50 mt-1">
                                Últimos 3 meses
                            </span>
                        </label>
                    </div>
                    <select
                        name="estudiosLaboratorio"
                        value={respuestas.estudiosLaboratorio}
                        onChange={handleChange}
                        className={selectClass}
                    >
                        <option value="">Selecciona una respuesta</option>
                        <option value="Sí">Sí, cuento con ellos</option>
                        <option value="No">No, por el momento</option>
                    </select>
                </div>

                {/* ── Acciones ──────────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-6 pt-4 pb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-primary font-bold hover:opacity-70 transition-opacity px-6 py-3"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-b from-primary to-primary-dark text-white px-10 py-4 rounded-full font-bold shadow-soft hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group"
                    >
                        Continuar
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CuestionarioNutricion;
