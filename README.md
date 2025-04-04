
# Terreta Hub - Plataforma Comunitaria

## Descripción General
Terreta Hub es una plataforma comunitaria bilingüe (español e inglés) diseñada para conectar personas interesadas en tecnología, cultura, emprendimiento y más. La plataforma permite a los usuarios interactuar, compartir conocimiento, publicar proyectos y participar en eventos, todo dentro de un ecosistema que fomenta la participación mediante un sistema de gamificación basado en niveles y experiencia.

## Funcionalidades Principales

### Sistema de Usuarios
- **Autenticación completa**: Registro e inicio de sesión con email/contraseña
- **Perfiles personalizables**: Los usuarios pueden añadir avatar, biografía, enlaces a redes sociales, categorías de interés
- **Sistema de experiencia**: Los usuarios ganan XP mediante diversas actividades y suben de nivel
- **Niveles de usuarios**: 13 niveles desde Novato hasta Leyenda, con el nivel Admin para administradores

### Módulo de Contenido
- **Artículos**: Publicación y consumo de artículos sobre diversos temas
- **Vídeos**: Integración con plataformas externas para compartir contenido audiovisual
- **Guías**: Tutoriales paso a paso para aprender nuevas habilidades
- **Recursos**: Enlaces a herramientas, plantillas y otros recursos útiles

### Foro de Discusión
- **Debates por categorías**: General, Legal, Tecnología, Finanzas, Salud, Audiovisual, Eventos
- **Sistema de votos**: Valoración positiva y negativa de debates y comentarios
- **Comentarios anidados**: Posibilidad de responder a debates y comentarios específicos

### Proyectos
- **Showcase de proyectos**: Los usuarios pueden publicar sus proyectos con imágenes y descripciones
- **Categorización**: Los proyectos pueden categorizarse por tipo y tecnologías
- **Visibilidad comunitaria**: Exploración y descubrimiento de proyectos de otros usuarios

### Eventos
- **Calendario de eventos**: Listado de próximos eventos y eventos pasados
- **Registro**: Posibilidad de registrarse para asistir a eventos
- **Información detallada**: Fechas, ubicaciones, precios y enlaces externos

### Sistema de Dominios
- **Espacios personalizados**: Los usuarios pueden reclamar dominios personalizados dentro de la plataforma
- **Estados de dominios**: Disponible, Reservado, En uso
- **Navegación intuitiva**: Búsqueda y exploración de dominios disponibles

### Panel de Administración
- **Gestión de usuarios**: Ver, editar y gestionar usuarios
- **Gestión de experiencia**: Otorgar XP, cambiar niveles de usuario
- **Gestión de contenido**: Aprobar, editar o eliminar contenido
- **Gestión de dominios**: Administrar los dominios del sistema

### Multilenguaje
- **Soporte bilingüe**: Interfaz completamente disponible en español e inglés
- **Cambio de idioma sencillo**: Posibilidad de cambiar entre idiomas en cualquier página

## Tecnologías Utilizadas
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Autenticación, Almacenamiento)
- **Despliegue**: Vercel

## Niveles y Privilegios de Usuario

| Nivel | Nombre | XP Requerida | Privilegios |
|-------|--------|--------------|-------------|
| 1 | Novato | 0 | Acceso básico de lectura, edición de perfil |
| 2 | Iniciado | 100 | Comentarios, votos en contenido |
| 3 | Aprendiz | 300 | Acceso a más recursos comunitarios |
| 4 | Aficionado | 600 | Creación de debates, mayor visibilidad |
| 5 | Explorador | 1000 | Participación en eventos especiales |
| 6 | Artesano | 1500 | Características adicionales de perfil |
| 7 | Especialista | 2200 | Mayor reconocimiento en plataforma |
| 8 | Experto | 3000 | Moderación básica de contenido |
| 9 | Maestro | 4000 | Influencia en decisiones comunitarias |
| 10 | Sabio | 5500 | Gestión de contenido, herramientas avanzadas |
| 11 | Virtuoso | 7500 | Reconocimiento especial |
| 12 | Leyenda | 10000 | Privilegios exclusivos, nivel máximo regular |
| 13 | Admin | - | Control total de la plataforma |

## Funciones por Página

### Página de Inicio
- Presentación de la plataforma
- Secciones destacadas
- Navegación a las principales áreas

### Página de Perfil
- Visualización y edición de datos personales
- Historial de participación
- Nivel y progreso de experiencia
- Proyectos publicados

### Página de Contenido
- Filtrado por categorías y tipos
- Visualización de artículos, videos, guías y recursos
- Herramientas de búsqueda

### Página del Foro
- Creación de debates
- Filtrado por categorías
- Participación mediante comentarios y votos

### Página de Eventos
- Calendario de próximos eventos
- Historial de eventos pasados
- Registro a eventos

### Página de Dominios
- Exploración de dominios disponibles
- Búsqueda de dominios específicos
- Reclamación de dominios

### Página de Proyectos
- Galería de proyectos comunitarios
- Formulario de creación de proyectos
- Visualización detallada de proyectos

### Página de Administración
- Gestión de usuarios
- Gestión de experiencia
- Gestión de feedback
- Gestión de dominios

## Instalación y Configuración

### Requisitos Previos
- Node.js 16+
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación
1. Clonar el repositorio: `git clone <URL_DEL_REPOSITORIO>`
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno (ver archivo .env.example)
4. Iniciar servidor de desarrollo: `npm run dev`

## Expectativas Futuras

### Corto Plazo
- Mejora del sistema de notificaciones
- Implementación de chat en tiempo real
- Optimización del rendimiento en dispositivos móviles

### Medio Plazo
- Integración con más proveedores de autenticación
- Implementación de sistema de mensajería privada
- Creación de API pública para desarrolladores

### Largo Plazo
- Implementación de marketplace interno
- Sistema de monetización para creadores de contenido
- Expansión a más idiomas y regiones

## Contribución
Las contribuciones son bienvenidas. Por favor, lee el archivo CONTRIBUTING.md para conocer el proceso de envío de pull requests.

## Licencia
[Especificar licencia]

## Contacto
[Información de contacto del proyecto]
