# Media Rental Frontend

Sistema de gestión de alquiler de medios publicitarios desarrollado con Nuxt y Vue .

## Requisitos

- Node.js >= 18.x
- npm o yarn
- Backend Laravel ejecutándose (API REST)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SrgP2003/media-rentall-frontend
cd media-rentall-frontend

# Instalar dependencias
npm install
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

**Variables disponibles:**
- `NUXT_PUBLIC_API_BASE`: URL base de la API de Laravel

## Comandos

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Generar sitio estático
npm run generate
```

## Decisiones Técnicas

### Autenticación
- **Laravel Sanctum con tokens Bearer**: Se optó por tokens personales en lugar de cookies para mayor flexibilidad y compatibilidad con APIs.
- **Plugin `$api`**: Interceptor global que agrega automáticamente el header `Authorization` en todas las peticiones autenticadas.
- **Persistencia con localStorage**: El token se guarda en localStorage para mantener la sesión entre recargas.

### Arquitectura
- **Composables**: Se utilizan composables de Vue (`useAuth`, `useMedia`, `useBookings`, `useCustomers`) para encapsular la lógica de negocio y reutilización de código.
- **Estructura de carpetas**: Organización según convenciones de Nuxt con `app/` como directorio raíz.
- **Middleware**: Sistema de rutas protegidas mediante middleware `auth` que valida la existencia del token.

### UI/UX
- **Componentes reutilizables**: Sistema de componentes UI (`SelectInput`, `DateInput`, `Pagination`) para mantener consistencia visual.
- **Tailwind CSS**: Framework CSS utility-first para estilos rápidos y responsivos.
- **Diseño responsive**: Grid system adaptativo para diferentes tamaños de pantalla.

### Gestión de Estado
- **useState de Nuxt**: Para estado global simple (token, usuario) sin necesidad de librerías externas.
- **Refs reactivos**: Para estado local en composables y componentes.

### Manejo de Errores
- **Interceptores de respuesta**: Captura automática de errores 401 (redirige a login), 403 y 422.
- **Feedback visual**: Mensajes de error y estados de carga en las operaciones CRUD.

### Performance
- **Paginación**: Carga de datos por páginas para optimizar rendimiento.
- **Filtros reactivos**: Sistema de filtros con watch para actualización automática.