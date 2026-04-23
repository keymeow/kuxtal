import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ChevronLeft, ChevronRight, Ruler, Weight, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/images/logoazul.png';

// --- COMPONENTES REUTILIZABLES DEL PERFIL ---
const ChipGroup = ({ options, selected, onToggle, multiple = true }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const isSelected = multiple ? selected.includes(opt) : selected === opt;
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

const Section = ({ title, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{title}</h3>
            <div className="flex-1 h-px bg-gray-100" />
        </div>
        {children}
    </div>
);

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-textos">{label}</label>
        {children}
    </div>
);

const inputClass = "w-full px-4 py-3.5 bg-secondary text-textos rounded-kuxtal outline-none focus:ring-2 focus:ring-primary transition-all duration-200 text-sm";

// --- COMPONENTE PRINCIPAL ---
const SignUp = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const DOMINIO_REQUERIDO = '@cua.uam.mx';

    const [formData, setFormData] = useState({
        // Paso 1: Personales
        nombre: '', apPaterno: '', apMaterno: '', correo: '', tipoUsuario: 'alumno',
        // Paso 2: Seguridad
        password: '', confirmPassword: '',
        // Paso 3: Perfil Médico
        sexoBiologico: '', genero: [], altura: '', peso: '', tipoSangre: '',
        alergias: [], alergiasOtras: '', padecimientos: [], padecimientosOtras: '',
        antecedentes: [], antecedentesOtras: '', sustancias: [], sustanciasOtras: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const setField = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

    const toggleMulti = (key, val) => {
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val],
        }));
    };

    // --- VALIDACIONES DE PASOS ---
    const handleNextStep1 = () => {
        const { nombre, apPaterno, correo } = formData;
        if (!nombre.trim() || !apPaterno.trim() || !correo.trim()) {
            return setError('Por favor, completa el nombre, apellido paterno y correo para continuar.');
        }
        if (!correo.toLowerCase().endsWith(DOMINIO_REQUERIDO)) {
            return setError(`El correo debe ser institucional (${DOMINIO_REQUERIDO}).`);
        }
        setError('');
        setStep(2);
    };

    const handleNextStep2 = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return setError('La contraseña debe tener: min. 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden.');
        }
        setError('');
        setStep(3); // Avanza al perfil médico
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar campos críticos del perfil médico
        if (!formData.sexoBiologico || !formData.altura || !formData.peso || !formData.tipoSangre) {
            return setError('Por favor completa los datos físicos (Sexo, Altura, Peso, Sangre).');
        }

        try {
            // Mandamos toda la data junta al backend
            await axios.post('http://localhost:4000/api/auth/signup', formData);
            setIsSuccess(true);
            setTimeout(() => navigate('/login'), 3500); // Redirige tras mostrar el mensaje de éxito
        } catch (err) {
            setError(err.response?.data?.message || 'Hubo un error al crear la cuenta.');
        }
    };

    // Listas de opciones
    const opcionesSexo = ['Masculino', 'Femenino'];
    const opcionesGenero = ['Masculino', 'Femenino', 'Transgénero', 'Otro'];
    const opcionesSangre = ['O+', 'A+', 'B+', 'O−', 'A−', 'AB+', 'AB−', 'B−'];
    const opcionesAlergias = ['Penicilina', 'AINEs', 'Aspirina', 'Sulfonamidas', 'Ibuprofeno', 'Látex'];
    const opcionesPadecimientos = ['Diabetes', 'Hipertensión', 'Asma', 'Depresión', 'Obesidad'];
    const opcionesAntecedentes = ['Diabetes', 'Hipertensión', 'Asma', 'Depresión', 'Cáncer'];
    const opcionesSustancias = ['Alcohol', 'Tabaco', 'Drogas'];

    // Pantalla de Éxito
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-blanco flex items-center justify-center px-6 text-center">
                <div className="max-w-sm w-full p-8 bg-secondary/30 rounded-kuxtal border border-primary/20 animate-in zoom-in duration-300">
                    <CheckCircle2 size={64} className="text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-textos mb-2">¡Cuenta creada con éxito!</h2>
                    <p className="text-gray-500 mb-6">Tu perfil médico ha sido guardado. Ya puedes iniciar sesión.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-primary text-white p-4 rounded-kuxtal font-bold shadow-soft transition-all hover:scale-[1.02]">
                        Ir al Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blanco flex flex-col items-center justify-center px-6 py-10">
            <div className={`w-full ${step === 3 ? 'max-w-lg' : 'max-w-md'} transition-all duration-300`}>

                {/* Cabecera dinámica según el paso */}
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Kuxtal Logo" className="w-20 mb-3" />
                    <h2 className="text-xl font-bold text-textos">
                        {step === 1 && 'Paso 1: Datos Personales'}
                        {step === 2 && 'Paso 2: Seguridad'}
                        {step === 3 && 'Paso 3: Perfil Médico'}
                    </h2>
                    {step === 3 && <p className="text-xs text-gray-400 mt-1">Requerido para el expediente clínico</p>}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-kuxtal mb-4 text-xs border border-red-100 text-center animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* --- PASO 1: DATOS PERSONALES --- */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left">
                            <Field label="Nombre(s)">
                                <input name="nombre" value={formData.nombre} onChange={handleChange} required type="text" placeholder="Ej. Peter" className={inputClass} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Apellido Paterno">
                                    <input name="apPaterno" value={formData.apPaterno} onChange={handleChange} required type="text" placeholder="Parker" className={inputClass} />
                                </Field>
                                <Field label="Apellido Materno">
                                    <input name="apMaterno" value={formData.apMaterno} onChange={handleChange} type="text" placeholder="Materno" className={inputClass} />
                                </Field>
                            </div>
                            <Field label="Correo Institucional">
                                <input name="correo" value={formData.correo} onChange={handleChange} required type="email" placeholder="usuario@cua.uam.mx" className={inputClass} />
                            </Field>
                            <Field label="Tipo de Usuario">
                                <select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} className={`${inputClass} bg-white border border-gray-200`}>
                                    <option value="alumno">Alumno</option>
                                    <option value="academico">Académico</option>
                                    <option value="trabajador">Trabajador</option>
                                </select>
                            </Field>
                            <button type="button" onClick={handleNextStep1} className="w-full bg-primary text-blanco py-3.5 rounded-kuxtal font-bold shadow-soft hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2">
                                Siguiente
                            </button>
                        </div>
                    )}

                    {/* --- PASO 2: SEGURIDAD --- */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right">
                            <Field label="Crea tu contraseña">
                                <div className="relative">
                                    <input name="password" value={formData.password} onChange={handleChange} required type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </Field>
                            <Field label="Confirma tu contraseña">
                                <div className="relative">
                                    <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={inputClass} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </Field>
                            <button type="button" onClick={handleNextStep2} className="w-full bg-primary text-blanco py-3.5 rounded-kuxtal font-bold shadow-soft hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2">
                                Continuar al Perfil Médico
                            </button>
                            <button type="button" onClick={() => { setStep(1); setError(''); }} className="w-full flex items-center justify-center gap-1.5 text-gray-400 text-sm hover:text-primary py-1">
                                <ChevronLeft size={15} /> Regresar
                            </button>
                        </div>
                    )}

                    {/* --- PASO 3: PERFIL MÉDICO --- */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-bottom pb-10">
                            <Section title="Detalles Físicos">
                                <Field label="Sexo biológico">
                                    <ChipGroup options={opcionesSexo} selected={formData.sexoBiologico} onToggle={(v) => setField('sexoBiologico', v)} multiple={false} />
                                </Field>
                                <Field label="Género">
                                    <ChipGroup options={opcionesGenero} selected={formData.genero} onToggle={(v) => toggleMulti('genero', v)} />
                                </Field>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Altura (cm)">
                                        <div className="relative">
                                            <Ruler size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="number" value={formData.altura} onChange={handleChange} name="altura" placeholder="179" className={`${inputClass} pl-10`} />
                                        </div>
                                    </Field>
                                    <Field label="Peso (kg)">
                                        <div className="relative">
                                            <Weight size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="number" value={formData.peso} onChange={handleChange} name="peso" placeholder="70" className={`${inputClass} pl-10`} />
                                        </div>
                                    </Field>
                                </div>
                                <Field label="Tipo de sangre">
                                    <ChipGroup options={opcionesSangre} selected={formData.tipoSangre} onToggle={(v) => setField('tipoSangre', v)} multiple={false} />
                                </Field>
                            </Section>

                            <Section title="Alergias a medicamentos">
                                <ChipGroup options={opcionesAlergias} selected={formData.alergias} onToggle={(v) => toggleMulti('alergias', v)} />
                                <Field label="Otras (especifica)">
                                    <input type="text" name="alergiasOtras" value={formData.alergiasOtras} onChange={handleChange} placeholder="Ej. Penicilina..." className={inputClass} />
                                </Field>
                            </Section>

                            <Section title="Padecimientos">
                                <ChipGroup options={opcionesPadecimientos} selected={formData.padecimientos} onToggle={(v) => toggleMulti('padecimientos', v)} />
                            </Section>

                            <Section title="Antecedentes familiares">
                                <ChipGroup options={opcionesAntecedentes} selected={formData.antecedentes} onToggle={(v) => toggleMulti('antecedentes', v)} />
                            </Section>

                            <Section title="Consumo de sustancias">
                                <ChipGroup options={opcionesSustancias} selected={formData.sustancias} onToggle={(v) => toggleMulti('sustancias', v)} />
                            </Section>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-kuxtal border border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50">
                                    Atrás
                                </button>
                                <button type="submit" className="flex-1 py-3.5 rounded-kuxtal bg-primary text-white font-bold text-sm shadow-soft hover:opacity-90 flex items-center justify-center gap-2">
                                    Crear Cuenta <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer (Solo visible en pasos 1 y 2) */}
                {step < 3 && (
                    <p className="mt-7 text-center text-sm text-gray-400">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline transition-all duration-200">
                            Inicia sesión
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default SignUp;
