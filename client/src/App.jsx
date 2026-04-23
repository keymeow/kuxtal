import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MiPerfil from './pages/MiPerfil';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/AppRoutes';
import UnderConstruction from './pages/UnderConstruction';
import Nutricion from './pages/Nutricion';
import CuestionarioNutricion from './pages/CuestionarioNutricion';
import ElegirEspecialista from './pages/ElegirEspecialista';
import InfoEspecialista from './pages/InfoEspecialista';
import AgendarCita from './pages/AgendarCita';
import CitaAgendada from './pages/CitaAgendada';
import MisCitas from './pages/MisCitas';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Rutas Privadas */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            {/* Home */}
                            <Route path="/" element={<Home />} />

                            {/*Mi Perfil y sus submenús */}
                            <Route path="/mi-perfil" element={<MiPerfil />} />
                            <Route path="/editar-datos-medicos" element={<Profile />} />
                            <Route path="/configuracion" element={<UnderConstruction title="Configuración de cuenta" />} />
                            <Route path="/ayuda" element={<UnderConstruction title="Ayuda y Soporte" />} />

                            {/* Módulo de Nutricion */}
                            <Route path="/nutricion" element={<Nutricion />} />
                            <Route path="/cuestionario/nutricion" element={<CuestionarioNutricion />} />
                            <Route path="/doctores/nutricion" element={<ElegirEspecialista />} />
                            <Route path="/doctores/nutricion/info/:id" element={<InfoEspecialista />} />

                            {/* Rutas para agendar */}
                            <Route path="/agendar/nutricion" element={<AgendarCita />} />
                            <Route path="/cita-agendada" element={<CitaAgendada />} />

                            {/* Módulo de Notificaciones */}
                            <Route path="/notificaciones" element={<UnderConstruction title="Notificaciones" />} />

                            {/* Botones de navegación inferior */}
                            <Route path="/mensajes" element={<UnderConstruction title="Mensajes" />} />
                            <Route path="/mis-citas" element={<MisCitas />} />
                            <Route path="/favoritos" element={<UnderConstruction title="Favoritos" />} />
                            <Route path="/historial" element={<UnderConstruction title="Mi Historial Médico" />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
