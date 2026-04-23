import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ruler, Weight, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Componente reutilizable de chips de selección
const ChipGroup = ({ options, selected, onToggle, multiple = true }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const isSelected = multiple
                ? selected.includes(opt)
                : selected === opt;
            return (
                <button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(opt)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${isSelected
                            ? 'bg-primary text-white border-primary shadow-soft'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
                        }`}
                >
                    {opt}
                </button>
            );
        })}
    </div>
);

// Sección con título y línea divisora
const Section = ({ title, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</h3>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
        {children}
    </div>
);

// Campo de formulario con label
const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-textos">{label}</label>
        {children}
    </div>
);

const inputClass =
    'w-full px-4 py-3.5 bg-secondary text-textos rounded-kuxtal outline-none focus:ring-2 focus:ring-primary transition-all duration-200 text-sm';

// ──────────────────────────────────────────────
const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState({
        nombre: user?.nombre || '',
        apPaterno: user?.apPaterno || '',
        apMaterno: user?.apMaterno || '',
        sexoBiologico: '',
        genero: [],
        altura: '',
        peso: '',
        tipoSangre: '',
        // multi-chip + campo "otras"
        alergias: [],
        alergiasOtras: '',
        padecimientos: [],
        padecimientosOtras: '',
        antecedentes: [],
        antecedentesOtras: '',
        sustancias: [],
        sustanciasOtras: '',
    });

    const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

    // Toggle para multi-select
    const toggleMulti = (key, val) => {
        setForm((prev) => ({
            ...prev,
            [key]: prev[key].includes(val)
                ? prev[key].filter((v) => v !== val)
                : [...prev[key], val],
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // TODO: conectar con PUT /api/users/profile cuando el endpoint esté listo
        alert('Perfil guardado (pendiente de conexión con el servidor)');
        navigate('/');
    };

    // Opciones de los chips
    const opcionesSexo = ['Masculino', 'Femenino'];
    const opcionesGenero = ['Masculino', 'Femenino', 'Transgénero', 'Otro'];
    const opcionesSangre = ['O+', 'A+', 'B+', 'O−', 'A−', 'AB+', 'AB−', 'B−'];
    const opcionesAlergias = ['Penicilina', 'AINEs', 'Aspirina', 'Sulfonamidas', 'Ibuprofeno', 'Látex'];
    const opcionesPadecimientos = ['Diabetes', 'Hipertensión', 'Asma', 'Depresión', 'Obesidad'];
    const opcionesAntecedentes = ['Diabetes', 'Hipertensión', 'Asma', 'Depresión', 'Cáncer'];
    const opcionesSustancias = ['Alcohol', 'Tabaco', 'Drogas'];

    return (
        <div className="max-w-lg mx-auto pb-10">
            {/* Encabezado */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-textos">Información del paciente</h1>
                        <p className="text-xs text-gray-400">Completa tu perfil médico</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* ── DATOS PERSONALES ── */}
                <Section title="Detalles del paciente">
                    <Field label="Nombre(s)">
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => set('nombre', e.target.value)}
                            placeholder="Peter"
                            className={inputClass}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Apellido paterno">
                            <input
                                type="text"
                                value={form.apPaterno}
                                onChange={(e) => set('apPaterno', e.target.value)}
                                placeholder="Parker"
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Apellido materno">
                            <input
                                type="text"
                                value={form.apMaterno}
                                onChange={(e) => set('apMaterno', e.target.value)}
                                placeholder="Parker"
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    <Field label="Sexo biológico">
                        <ChipGroup
                            options={opcionesSexo}
                            selected={form.sexoBiologico}
                            onToggle={(v) => set('sexoBiologico', v)}
                            multiple={false}
                        />
                    </Field>

                    <Field label="Género">
                        <ChipGroup
                            options={opcionesGenero}
                            selected={form.genero}
                            onToggle={(v) => toggleMulti('genero', v)}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Altura (cm)">
                            <div className="relative">
                                <Ruler size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="number"
                                    value={form.altura}
                                    onChange={(e) => set('altura', e.target.value)}
                                    placeholder="179"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </Field>
                        <Field label="Peso (kg)">
                            <div className="relative">
                                <Weight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="number"
                                    value={form.peso}
                                    onChange={(e) => set('peso', e.target.value)}
                                    placeholder="70"
                                    className={`${inputClass} pl-10`}
                                />
                            </div>
                        </Field>
                    </div>

                    <Field label="Tipo de sangre">
                        <ChipGroup
                            options={opcionesSangre}
                            selected={form.tipoSangre}
                            onToggle={(v) => set('tipoSangre', v)}
                            multiple={false}
                        />
                    </Field>
                </Section>

                {/* ── ALERGIAS ── */}
                <Section title="Alergias a medicamentos">
                    <p className="text-sm text-gray-400 -mt-2">¿Eres alérgico a algún medicamento o fármaco?</p>
                    <ChipGroup
                        options={opcionesAlergias}
                        selected={form.alergias}
                        onToggle={(v) => toggleMulti('alergias', v)}
                    />
                    <Field label="Otras (especifica)">
                        <input
                            type="text"
                            value={form.alergiasOtras}
                            onChange={(e) => set('alergiasOtras', e.target.value)}
                            placeholder="Ej. Penicilina, Ibuprofeno..."
                            className={inputClass}
                        />
                    </Field>
                </Section>

                {/* ── PADECIMIENTOS ── */}
                <Section title="Padecimientos">
                    <ChipGroup
                        options={opcionesPadecimientos}
                        selected={form.padecimientos}
                        onToggle={(v) => toggleMulti('padecimientos', v)}
                    />
                    <Field label="Otras (especifica)">
                        <input
                            type="text"
                            value={form.padecimientosOtras}
                            onChange={(e) => set('padecimientosOtras', e.target.value)}
                            placeholder="Ej. Hipotiroidismo..."
                            className={inputClass}
                        />
                    </Field>
                </Section>

                {/* ── ANTECEDENTES FAMILIARES ── */}
                <Section title="Antecedentes familiares">
                    <p className="text-sm text-gray-400 -mt-2">¿Algún familiar directo ha padecido alguna de estas enfermedades?</p>
                    <ChipGroup
                        options={opcionesAntecedentes}
                        selected={form.antecedentes}
                        onToggle={(v) => toggleMulti('antecedentes', v)}
                    />
                    <Field label="Otras (especifica)">
                        <input
                            type="text"
                            value={form.antecedentesOtras}
                            onChange={(e) => set('antecedentesOtras', e.target.value)}
                            placeholder="Ej. Cáncer, Alzheimer..."
                            className={inputClass}
                        />
                    </Field>
                </Section>

                {/* ── CONSUMO DE SUSTANCIAS ── */}
                <Section title="Consumo de sustancias">
                    <p className="text-sm text-gray-400 -mt-2">¿Consumes alguna de las siguientes sustancias?</p>
                    <ChipGroup
                        options={opcionesSustancias}
                        selected={form.sustancias}
                        onToggle={(v) => toggleMulti('sustancias', v)}
                    />
                    <Field label="Otras (especifica)">
                        <input
                            type="text"
                            value={form.sustanciasOtras}
                            onChange={(e) => set('sustanciasOtras', e.target.value)}
                            placeholder="Ej. Suplementos, medicamentos..."
                            className={inputClass}
                        />
                    </Field>
                </Section>

                {/* ── BOTONES ── */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 py-3.5 rounded-kuxtal border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3.5 rounded-kuxtal bg-primary text-white font-bold text-sm shadow-soft hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Guardar
                        <ChevronRight size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
