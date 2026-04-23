import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserCircle, ShieldCheck, ChevronRight, X, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const InfoEspecialista = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [especialista, setEspecialista] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:4000/api/especialistas/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const doc = res.data;
                setEspecialista({
                    nombre: `Dra. ${doc.nombre} ${doc.apellido_paterno}`,
                    especialidad: doc.especialidad,
                    cedula: doc.cedula_profesional,
                    bio: doc.bio_extracto
                });
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [id, token]);

    if (loading) return <div className="text-center py-20">Cargando...</div>;
    if (!especialista) return <div className="text-center py-20">Especialista no encontrado</div>;

    return (
        <div className="max-w-md mx-auto py-8 px-4 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-secondary p-1 rounded-full mb-4 ring-4 ring-white shadow-soft">
                    <UserCircle size={100} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-textos leading-tight">{especialista.nombre}</h1>
                <p className="text-sm font-semibold text-primary">{especialista.especialidad}</p>
            </div>

            <div className="space-y-6">
                {/* Caja de Datos Oficiales */}
                <div className="bg-surface p-6 rounded-3xl shadow-soft space-y-6">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <ShieldCheck size={18} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Cédula Profesional</h3>
                        </div>
                        <p className="text-sm font-mono text-textos bg-secondary/50 p-2 rounded-lg inline-block">
                            {especialista.cedula}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <Info size={18} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Biografía y Enfoque</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            {especialista.bio}
                        </p>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-kuxtal font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                        <X size={18} /> Cerrar
                    </button>
                    <button
                        onClick={() => navigate('/agendar/nutricion')}
                        className="flex-1 py-4 bg-primary text-white rounded-kuxtal font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                        Agendar cita <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfoEspecialista;
