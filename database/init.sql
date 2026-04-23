CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TIPOS ENUM
CREATE TYPE tipo_usuario_enum AS ENUM ('alumno', 'academico', 'trabajador');
CREATE TYPE rol_enum AS ENUM ('paciente', 'especialista', 'admin');
CREATE TYPE estado_cita_enum AS ENUM ('programada', 'completada', 'cancelada');

-- 1. TABLA USUARIOS
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    correo_institucional VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    tipo_usuario tipo_usuario_enum NOT NULL,
    rol rol_enum DEFAULT 'paciente',
    estatus BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA PACIENTES_PERFIL
CREATE TABLE pacientes_perfil (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_nacimiento DATE,
    sexo_biologico VARCHAR(20),
    genero VARCHAR(50),
    tipo_sangre VARCHAR(5),
    telefono VARCHAR(15)
);

-- 3. TABLA ESPECIALISTAS_PERFIL
CREATE TABLE especialistas_perfil (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    cedula_profesional VARCHAR(50) UNIQUE,
    especialidad VARCHAR(100) DEFAULT 'Nutrición',
    bio_extracto TEXT
);

-- 4. TABLA FAVORITOS
CREATE TABLE favoritos (
    id_paciente UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    id_especialista UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_agregado TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id_paciente, id_especialista)
);

-- 5. TABLA CITAS
CREATE TABLE citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_paciente UUID REFERENCES usuarios(id),
    id_especialista UUID REFERENCES usuarios(id),
    fecha_hora_inicio TIMESTAMPTZ NOT NULL,
    fecha_hora_fin TIMESTAMPTZ NOT NULL,
    estado estado_cita_enum DEFAULT 'programada',
    motivo_consulta TEXT,
    indicaciones JSONB,
    motivo_cancelacion TEXT,
    visible_paciente BOOLEAN DEFAULT true
);

-- 6. HISTORIA CLÍNICA NUTRICIÓN
CREATE TABLE historia_clinica_nutricion (
    id_usuario UUID PRIMARY KEY REFERENCES usuarios(id),
    num_comidas VARCHAR(20),
    restricciones_alimento TEXT,
    estudios_laboratorio BOOLEAN DEFAULT false,
    objetivo_nutricional TEXT
);

-- DATOS DE PRUEBA: 3 Doctoras
INSERT INTO usuarios (id, nombre, apellido_paterno, apellido_materno, correo_institucional, password_hash, tipo_usuario, rol) VALUES
('11111111-1111-1111-1111-111111111111', 'Sofía', 'Ramírez', 'López', 'sramirez@cua.uam.mx', 'hash_falso', 'academico', 'especialista'),
('22222222-2222-2222-2222-222222222222', 'Valeria', 'Torres', 'Mendoza', 'vtorres@cua.uam.mx', 'hash_falso', 'academico', 'especialista'),
('33333333-3333-3333-3333-333333333333', 'Fernanda', 'Medina', 'Castillo', 'fmedina@cua.uam.mx', 'hash_falso', 'academico', 'especialista');

-- DATOS DE PRUEBA: Perfiles clínicos
INSERT INTO especialistas_perfil (id_usuario, cedula_profesional, especialidad, bio_extracto) VALUES
('11111111-1111-1111-1111-111111111111', 'CED-UNAM-9876', 'Nutrición', 'Egresada de la UNAM. Especialista en control de peso y enfermedades metabólicas crónicas.'),
('22222222-2222-2222-2222-222222222222', 'CED-IPN-5432', 'Nutrición', 'Egresada del IPN. Enfocada en atletas de alto rendimiento y recomposición corporal.'),
('33333333-3333-3333-3333-333333333333', 'CED-ITESM-1029', 'Nutrición', 'Egresada del Tec de Monterrey. Abordaje integral para problemas gastrointestinales y salud hormonal.');