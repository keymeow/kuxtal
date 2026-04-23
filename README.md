# 🌿 Kuxtal - Plataforma de Bienestar e Integración Saludable

**Kuxtal** (del maya: *Vida*) es una aplicación web full-stack diseñada para la gestión de salud y bienestar institucional. Permite la interacción entre pacientes (alumnos, académicos, trabajadores) y especialistas (nutriólogos, médicos, etc.).

## 🚀 Tecnologías Utilizadas

### Frontend
- React 18
- Tailwind CSS
- React Router Dom
- Lucide React
- FullCalendar

### Backend
- Node.js & Express
- PostgreSQL
- JWT (JSON Web Token)
- Bcrypt

### Ejecución Local
- El proyecto se puede levantar localmente con Node.js y PostgreSQL instalados en la máquina.

## 📦 Estructura del Proyecto

```text
├── client/              # Frontend en React
│   ├── src/components/  # Componentes reutilizables (Sidebar, Topbar, etc.)
│   ├── src/pages/       # Vistas principales (Home, Auth, Nutrition)
│   └── src/routes/      # Configuración de rutas y protección
├── server/              # Backend en Node.js
│   ├── src/controllers/ # Lógica de negocio
│   ├── src/routes/      # Definición de endpoints de la API
│   └── src/middlewares/ # Validaciones y seguridad (Auth)
├── database/            # Scripts de inicialización SQL
├── .gitignore
└── README.md
```

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- Node.js v18 o superior
- npm (incluido con Node.js)
- PostgreSQL 17
- Git

## 🚀 Guía de instalación y ejecución

### 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/keymeow/kuxtal
cd kuxtal
```



### 2. Iniciar PostgreSQL

En Windows, abre una terminal como administrador y ejecuta:

```powershell
net start postgresql-x64-17
```

Si PostgreSQL está configurado como servicio con otro nombre, usa el nombre correcto del servicio.


### 3. Crear la base de datos y ejecutar el script de inicialización

Abre una terminal de PostgreSQL o usa `psql` desde la línea de comandos:

```bash
psql -U postgres
```

Dentro de `psql`, crea la base de datos:

```sql
CREATE DATABASE kuxtal_db;
\q
```

Luego ejecuta el script de inicialización:

```bash
psql -U postgres -d kuxtal_db -f database/init.sql
```


### 4. Configurar variables de entorno para el backend

Copia el archivo de ejemplo dentro de la carpeta `server`:

```bash
cd server
copy .env.example .env
```

Abre `server/.env` y edita los valores según tu configuración:

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/kuxtal_db
JWT_SECRET=una_clave_secreta_larga_y_segura
PORT=4000
```

- `DATABASE_URL`: Ajusta la contraseña `TU_PASSWORD` a la de tu usuario `postgres`.
- `JWT_SECRET`: Debe ser una clave larga y segura.
- `PORT`: Puerto donde correrá el backend.


### 5. Instalar dependencias e iniciar el backend

Desde la carpeta `server`:

```bash
npm install       # solo la primera vez
npm run dev
```

Esto levantará el backend en:

- `http://localhost:4000`


### 6. Instalar dependencias e iniciar el frontend

Abre otra terminal y ejecuta:

```bash
cd client
npm install       # solo la primera vez
npm start
```

La aplicación abrirá automáticamente en:

- `http://localhost:3000`


## 🔧 Detalles de la conexión entre frontend y backend

- El frontend se conecta a la API del backend en `http://localhost:4000`.
- El backend usa PostgreSQL y la configuración de `server/.env` para conectarse a la base de datos.


## 🛠️ Solución de problemas comunes

- Si `npm start` usa otro puerto, revisa la consola de `create-react-app` para ver la URL correcta.
- Si PostgreSQL no se inicia, verifica que el servicio esté instalado y se ejecute correctamente.
- Si la API no responde, confirma que `DATABASE_URL` sea correcta y que `kuxtal_db` exista.


## 🔑 Funcionalidades Principales

- Registro y login de usuarios.
- Rutas protegidas por autenticación.
- Gestión de citas y perfiles de especialistas.
- Módulo de nutrición y cuestionarios.


## 📄 Licencia
Este proyecto es propiedad privada. Consulta los términos de uso institucional.
