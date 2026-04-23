const pool = require('../db');

const getDisponibilidad = async (req, res) => {
    try {
        const { id_especialista, fecha } = req.query;
        if (!id_especialista || !fecha) return res.status(400).json({ message: 'Faltan parámetros' });

        const query = `
            SELECT fecha_hora_inicio FROM citas 
            WHERE id_especialista = $1 AND DATE(fecha_hora_inicio AT TIME ZONE 'America/Mexico_City') = $2 AND estado != 'cancelada'
            `;
        const { rows } = await pool.query(query, [id_especialista, fecha]);
        const horasOcupadas = rows.map(cita => {
            return new Date(cita.fecha_hora_inicio).toLocaleTimeString('es-MX', {
                hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Mexico_City'
            });
        });
        res.json({ horasOcupadas });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const agendarCita = async (req, res) => {
    try {
        const { id_especialista, fecha, hora, motivo_consulta } = req.body;
        const id_paciente = req.user.id;
        const fechaHoraInicio = new Date(`${fecha}T${hora}:00-06:00`);
        const fechaHoraFin = new Date(fechaHoraInicio.getTime() + 30 * 60000);

        const checkQuery = `SELECT id FROM citas WHERE id_especialista = $1 AND fecha_hora_inicio = $2 AND estado != 'cancelada'`;
        const checkResult = await pool.query(checkQuery, [id_especialista, fechaHoraInicio]);
        if (checkResult.rows.length > 0) return res.status(409).json({ message: 'Horario no disponible.' });

        const insertQuery = `
            INSERT INTO citas (id_paciente, id_especialista, fecha_hora_inicio, fecha_hora_fin, motivo_consulta, estado)
            VALUES ($1, $2, $3, $4, $5, 'programada') RETURNING id
        `;
        const result = await pool.query(insertQuery, [id_paciente, id_especialista, fechaHoraInicio, fechaHoraFin, motivo_consulta || 'Consulta']);
        res.status(201).json({ message: 'Cita agendada con éxito', citaId: result.rows[0].id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al agendar' });
    }
};

// --- NUEVAS FUNCIONES PARA "MIS CITAS" ---

const getMisCitas = async (req, res) => {
    try {
        const id_paciente = req.user.id;
        // Hacemos JOIN para traer el nombre de la doctora y su consultorio
        const query = `
            SELECT c.id, c.id_especialista, c.fecha_hora_inicio, c.estado, c.motivo_cancelacion,
            u.nombre AS doctor_nombre, ep.especialidad
            FROM citas c
            JOIN usuarios u ON c.id_especialista = u.id
            JOIN especialistas_perfil ep ON u.id = ep.id_usuario
            WHERE c.id_paciente = $1 AND c.visible_paciente = true
            ORDER BY c.fecha_hora_inicio DESC
        `;
        const { rows } = await pool.query(query, [id_paciente]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al obtener tus citas' });
    }
};

const cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const id_paciente = req.user.id;

        const query = `
            UPDATE citas 
            SET estado = 'cancelada', motivo_cancelacion = $1 
            WHERE id = $2 AND id_paciente = $3
            RETURNING id
        `;
        const result = await pool.query(query, [motivo, id, id_paciente]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Cita no encontrada o no autorizada' });
        res.json({ message: 'Cita cancelada correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al cancelar' });
    }
};

const ocultarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const id_paciente = req.user.id;

        const query = `
            UPDATE citas 
            SET visible_paciente = false 
            WHERE id = $1 AND id_paciente = $2
            RETURNING id
        `;
        const result = await pool.query(query, [id, id_paciente]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Cita no encontrada' });
        res.json({ message: 'Cita eliminada de tu vista' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error al ocultar cita' });
    }
};

module.exports = { getDisponibilidad, agendarCita, getMisCitas, cancelarCita, ocultarCita };
