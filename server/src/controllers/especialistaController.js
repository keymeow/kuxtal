const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Obtener especialistas filtrados por especialidad
exports.getEspecialistas = async (req, res) => {
    const { especialidad } = req.query;

    try {
        let query = `
            SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno,
            ep.cedula_profesional, ep.especialidad, ep.bio_extracto
            FROM usuarios u
            JOIN especialistas_perfil ep ON u.id = ep.id_usuario
            WHERE u.rol = 'especialista'
        `;
        const params = [];

        if (especialidad) {
            query += ` AND ep.especialidad = $1`;
            params.push(especialidad);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener especialistas" });
    }
};

// Obtener un especialista por ID
exports.getEspecialistaById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
                SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno,
                ep.cedula_profesional, ep.especialidad, ep.bio_extracto
                FROM usuarios u
                JOIN especialistas_perfil ep ON u.id = ep.id_usuario
                WHERE u.id = $1 AND u.rol = 'especialista'
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Especialista no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al obtener el especialista" });
    }
};
