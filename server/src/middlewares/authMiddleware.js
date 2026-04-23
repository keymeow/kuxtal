const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Obtener el token del encabezado (Authorization: Bearer TOKEN)
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    const token = authHeader.split(' ')[1]; // Separar 'Bearer' del token real

    try {
        // 2. Verificar el token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario en la petición
        next(); // Continuar al siguiente paso (el controlador)
    } catch (err) {
        res.status(400).json({ message: "Token no válido." });
    }
};
