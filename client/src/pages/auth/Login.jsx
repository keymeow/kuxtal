import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/images/logoazul.png';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                correo: email,
                password: password
            });
            login(response.data.token, response.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al conectar con el servidor');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 py-12"
            style={{ background: 'linear-gradient(160deg, #ffffff 0%, #D8E9F3 100%)' }}
        >
            <div className="w-full max-w-md">
                <div className="bg-blanco rounded-kuxtal shadow-soft px-8 py-10">
                    <div className="flex flex-col items-center mb-8">
                        <img src={logo} alt="Kuxtal Logo" className="w-28 mb-5" />
                        <h1 className="text-2xl font-bold text-textos tracking-tight">Bienvenido de nuevo</h1>
                        <p className="text-sm text-gray-400 mt-1">Ingresa con tu cuenta institucional</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-kuxtal mb-5 text-sm flex items-start gap-2">
                            <span className="mt-0.5 shrink-0">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-textos mb-1.5">
                                Correo institucional
                            </label>
                            <div className="relative">
                                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-secondary text-textos rounded-kuxtal outline-none focus:ring-2 focus:ring-primary transition-all duration-200 text-sm"
                                    placeholder="usuario@cua.uam.mx"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-textos mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-secondary text-textos rounded-kuxtal outline-none focus:ring-2 focus:ring-primary transition-all duration-200 text-sm"
                                    placeholder="Tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-blanco py-3.5 rounded-kuxtal font-bold shadow-soft hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-sm mt-2"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-gray-400">
                        ¿No tienes cuenta?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline transition-all duration-200">
                            Regístrate
                        </Link>
                    </p>
                </div>
                <p className="text-center text-xs text-gray-400 mt-6">UAM Cuajimalpa · 2026</p>
            </div>
        </div>
    );
};

export default Login;
