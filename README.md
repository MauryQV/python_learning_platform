# 🐍 Python Learning Platform

Una plataforma interactiva para aprender Python con ejecución de código en tiempo real, análisis automático y seguimiento de progreso personalizado.

---

##  Características

-  **Módulos interactivos** de aprendizaje Python
-  **Ejecución de código en tiempo real**
-  **Análisis automático de código** (AST)
-  **Dashboard para profesores** con métricas en vivo
-  **Dos modos**: Aprendizaje y Práctica
-  **Seguimiento de progreso** personalizado

---

##  Stack Tecnológico

### Backend
- **Express** (Node.js)
- **Supabase** (PostgreSQL + Auth)
- **Docker** (ejecución segura de código)
- **WebSockets** (tiempo real)

### Frontend
- **React** (JavaScript)
- **Tailwind CSS**

---

##  Instalación Rápida

### Prerrequisitos

Asegúrate de tener instalado:

- Node.js 18+
- Docker
- Cuenta en Supabase

### Backend Setup

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/python-learning-platform.git
   cd python-learning-platform/backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Crea un archivo `.env` en `backend/` basado en `.env.example`

4. **Ejecutar servidor:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Ir a la carpeta del frontend:**
   ```bash
   cd ../frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

---

## 📁 Estructura del Proyecto

```
python-learning-platform/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 routes/         # Endpoints de la API
│   │   ├── 📁 controllers/    # Controladores
│   │   ├── 📁 services/       # Lógica de negocio
│   │   ├── 📁 middleware/     # Middlewares
│   │   └── server.js          # Punto de entrada
│   ├── package.json
│   └── .env.example
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/     # Componentes reutilizables
│   │   ├── 📁 pages/          # Páginas de la aplicación
│   │   └── App.js             # Componente principal
│   └── package.json
│
└── README.md
```

---

##  Testing

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

---

##  Deployment

### Backend (Render/Railway)

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### Frontend (Vercel/Netlify)

1. Conectar repositorio
2. Configurar build commands
3. Deploy automático

---

##  Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un **fork** del proyecto
2. Crea una rama para tu feature:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Haz commit de tus cambios:
   ```bash
   git commit -m 'Add: AmazingFeature'
   ```
4. Sube los cambios:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abre un **Pull Request**

---





