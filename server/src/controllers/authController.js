const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { UserBuilder } = require('../builders');


// --- FUNCIÓN DE REGISTRO ---
exports.signUp = async (req, res) => {
    const {
        nombre, apPaterno, apMaterno, correo, tipoUsuario,
        password,
        sexoBiologico, genero, altura, peso, tipoSangre,
        alergias, padecimientos
    } = req.body;

    // Validación de contraseña (no cambia)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "La contraseña no cumple con los requisitos de seguridad." });
    }

    try {
        // 1. Verificar si ya existe
        const userExists = await pool.query(
            'SELECT id FROM usuarios WHERE correo_institucional = $1', [correo]
        );
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Este correo ya está registrado en Kuxtal" });
        }

        // 2. Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. *** USO DEL PATRÓN BUILDER ***
        const userData = new UserBuilder()
            .setDatosPersonales(nombre, apPaterno, apMaterno, correo, tipoUsuario)
            .setSeguridad(passwordHash)
            .setPerfilMedico({ sexoBiologico, genero, altura, peso, tipoSangre, alergias, padecimientos })
            .build(); // lanza error si falta algo obligatorio

        // 4. Insertar usuario construido en la BD
        const newUser = await pool.query(
            `INSERT INTO usuarios 
        (nombre, apellido_paterno, apellido_materno, correo_institucional, password_hash, tipo_usuario, rol)
       VALUES ($1, $2, $3, $4, $5, $6, 'paciente') RETURNING id`,
            [
                userData.nombre,
                userData.apellido_paterno,
                userData.apellido_materno,
                userData.correo_institucional,
                userData.password_hash,
                userData.tipo_usuario
            ]
        );

        // 5. Insertar perfil médico (datos del paso 3)
        await pool.query(
            'INSERT INTO pacientes_perfil (id_usuario, sexo_biologico, tipo_sangre) VALUES ($1, $2, $3)',
            [newUser.rows[0].id, userData.perfil.sexo_biologico, userData.perfil.tipo_sangre]
        );

        res.status(201).json({ message: "Usuario creado exitosamente" });

    } catch (err) {
        console.error(err.message);
        // Si el error lo lanzó el Builder, lo enviamos como 400
        if (err.message.startsWith('UserBuilder:')) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error en el servidor al registrar" });
    }
};
// --- FUNCIÓN GET ME ---
exports.getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, apellido_paterno, apellido_materno, correo_institucional, tipo_usuario, rol FROM usuarios WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener el perfil" });
    }
};

// --- FUNCIÓN DE LOGIN ---
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario
        const userResult = await pool.query(
            'SELECT * FROM usuarios WHERE correo_institucional = $1',
            [correo]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "El usuario no existe" });
        }

        const user = userResult.rows[0];

        // 2. Comparar contraseña ingresada con el hash de la DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // 3. Crear el Token de sesión (JWT)
        const token = jwt.sign(
            { id: user.id, rol: user.rol, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // La sesión dura un día
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                rol: user.rol
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
    }
};
