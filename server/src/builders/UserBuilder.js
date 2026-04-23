class UserBuilder {
    constructor() {
        this._user = {};
    }

    // Paso 1: Datos personales
    setDatosPersonales(nombre, apPaterno, apMaterno, correo, tipoUsuario) {
        this._user.nombre = nombre;
        this._user.apellido_paterno = apPaterno;
        this._user.apellido_materno = apMaterno;
        this._user.correo_institucional = correo;
        this._user.tipo_usuario = tipoUsuario;
        return this; // permite encadenamiento (fluent interface)
    }

    // Paso 2: Seguridad
    setSeguridad(passwordHash) {
        this._user.password_hash = passwordHash;
        return this;
    }

    // Paso 3: Perfil médico
    setPerfilMedico({ sexoBiologico, genero, altura, peso, tipoSangre, alergias, padecimientos }) {
        this._user.perfil = {
            sexo_biologico: sexoBiologico,
            genero: genero,
            altura_cm: altura,
            peso_kg: peso,
            tipo_sangre: tipoSangre,
            alergias: alergias,
            padecimientos: padecimientos,
        };
        return this;
    }

    // Construye y valida el objeto final
    build() {
        const { nombre, correo_institucional, password_hash, tipo_usuario } = this._user;
        if (!nombre || !correo_institucional || !password_hash || !tipo_usuario) {
            throw new Error('UserBuilder: faltan datos obligatorios para construir el usuario.');
        }
        return { ...this._user }; // retorna una copia del objeto construido
    }
}

module.exports = UserBuilder;