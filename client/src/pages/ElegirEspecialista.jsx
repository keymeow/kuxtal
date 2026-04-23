import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Heart, UserCircle, Info, ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ElegirEspecialista = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [filtroActivo, setFiltroActivo] = useState('Todas');
    const [favoritos, setFavoritos] = useState([]);
    const [especialistas, setEspecialistas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEspecialistas = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:4000/api/especialistas?especialidad=Nutrición',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEspecialistas(res.data.map(doc => ({
                    id: doc.id,
                    nombre: `Dra. ${doc.nombre} ${doc.apellido_paterno}`,
                    especialidad: doc.especialidad,
                    cedula: doc.cedula_profesional,
                    bio: doc.bio_extracto
                })));
            } catch (err) {
                console.error('Error al cargar especialistas:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEspecialistas();
    }, [token]);

    const toggleFavorito = (id) => {
        setFavoritos(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    if (loading) return <div className="text-center py-20">Cargando especialistas...</div>;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50/50 pb-32">
            {/* Topbar */}
            <div className="bg-white/80 backdrop-blur-md px-4 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-glass">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-textos">Elegir Especialista</h1>
            </div>

            <div className="px-4 py-6">
                <div className="relative mb-6">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Buscar especialista..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-kuxtal shadow-sm outline-none focus:ring-2 focus:ring-primary text-sm" />
                </div>

                <div className="flex gap-2 mb-8">
                    {['Todas', 'Favoritos'].map(filtro => (
                        <button key={filtro} onClick={() => setFiltroActivo(filtro)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${filtroActivo === filtro ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}>
                            {filtro}
                        </button>
                    ))}
                </div>

                {/* Tarjetas de Especialistas */}
                <div className="space-y-6">
                    {especialistas.map((doc) => {
                        const esFavorito = favoritos.includes(doc.id);
                        if (filtroActivo === 'Favoritos' && !esFavorito) return null;

                        return (
                            <div key={doc.id} className="bg-surface p-5 rounded-3xl shadow-soft relative flex flex-col gap-4">
                                <button onClick={() => toggleFavorito(doc.id)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50">
                                    <Heart size={22} className={`${esFavorito ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                                </button>

                                <div className="flex items-center gap-4">
                                    <UserCircle size={48} className="text-secondary shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-textos text-lg leading-tight">{doc.nombre}</h3>
                                        <p className="text-sm font-semibold text-primary">{doc.especialidad}</p>
                                    </div>
                                </div>

                                {/* Botones de la Tarjeta */}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => navigate(`/doctores/nutricion/info/${doc.id}`)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-primary rounded-xl font-bold text-xs hover:bg-primary/10 transition-colors"
                                    >
                                        <Info size={14} /> Información
                                    </button>
                                    <button
                                        onClick={() => navigate('/agendar/nutricion', { state: { doctor: doc } })}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-bold text-xs shadow-md hover:opacity-90 transition-all"
                                    >
                                        Agendar cita <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTONES DE NAVEGACIÓN INFERIOR */}
                <div className="mt-12 space-y-3">
                    <button onClick={() => navigate(-1)} className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 text-gray-600 rounded-kuxtal font-bold shadow-sm hover:bg-gray-50 transition-colors">
                        Atrás
                    </button>
                    <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-kuxtal font-bold shadow-sm hover:bg-red-100 transition-colors">
                        <X size={20} /> Cancelar cita
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElegirEspecialista;
