# Gestor de notas: API y base de datos

Repositorio: https://github.com/kevinyule/GESTOR_NOTAS_BACKEND

API REST en Node.js y Express para crear, consultar, actualizar y eliminar elementos. La aplicación guarda los datos en PostgreSQL; en Docker Compose, el nombre del servicio `db` es el host que usa la API.

## Requisitos

- Docker Desktop con Docker Compose
- Node.js 20 o superior para ejecutar la prueba de integración desde el equipo

## Levantar los contenedores

En Windows, desde PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

En macOS o Linux:

```sh
cp .env.example .env
docker compose up --build
```

La API queda disponible en `http://localhost:3000`. Para detener los servicios, pulsa `Ctrl+C`; para iniciarlos en segundo plano usa `docker compose up --build -d`. La base de datos conserva sus datos en el volumen `postgres-data`. Para borrarlos intencionalmente, ejecuta `docker compose down --volumes`.

El servicio `app` espera a que PostgreSQL esté listo. Ambos servicios se comunican por la red `gestor-network`; la aplicación se conecta al host `db` en el puerto `5432`. La base de datos no se publica en el equipo anfitrión.

## Comprobar la comunicación

Con los contenedores activos, ejecuta:

```sh
npm ci
npm run test:integration
```

La prueba crea un elemento por la API, lo consulta desde la base de datos y lo elimina. También se puede comprobar el estado del servicio en `http://localhost:3000/health`.

## Rutas principales

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/items` | Listar elementos |
| `GET` | `/api/items/:id` | Consultar un elemento |
| `POST` | `/api/items` | Crear un elemento |
| `PUT` | `/api/items/:id` | Reemplazar un elemento |
| `DELETE` | `/api/items/:id` | Eliminar un elemento |

Ejemplo de creación:

```json
{
  "name": "Repasar redes",
  "description": "Preparar el laboratorio"
}
```

## Variables y seguridad

`.env` contiene la configuración local y no se versiona. `.env.example` sirve como plantilla: cambia ambas contraseñas antes de usarla fuera de una práctica local. Compose inicializa un usuario administrador solo para PostgreSQL y un usuario de aplicación con permisos sobre el esquema; la API utiliza el segundo. Las credenciales se entregan a los servicios desde Compose, no están escritas en el código ni en la imagen. El contenedor Node se ejecuta sin privilegios de root.

## Integración continua

GitHub Actions ejecuta el flujo en cada `push` y `pull_request`: instala las dependencias, construye las imágenes, levanta ambos servicios y valida la operación de escritura y lectura antes de apagar el entorno.
