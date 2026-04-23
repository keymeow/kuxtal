const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Guardar cuestionario de nutrición
exports.saveCuestionario = async (req, res) => {
    const { objetivoNutricional, numComidas, restricciones_alimento, estudiosLaboratorio } = req.body;
    const userId = req.user.id; // Viene del authMiddleware (JWT decodificado)

    try {
        // UPSERT: Si ya tiene un registro, lo actualiza; si no, lo crea
        await pool.query(
            `INSERT INTO historia_clinica_nutricion
         (id_usuario, objetivo_nutricional, num_comidas, restricciones_alimento, estudios_laboratorio)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id_usuario) DO UPDATE SET
         objetivo_nutricional = $2,
         num_comidas = $3,
         restricciones_alimento = $4,
         estudios_laboratorio = $5`,
            [userId, objetivoNutricional, numComidas, restricciones_alimento, estudiosLaboratorio]
        );

        res.status(201).json({ message: "Cuestionario guardado exitosamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error al guardar el cuestionario" });
    }
};
