# 1. Usar una imagen base de Node (la misma versión que usas en tu PC)
FROM node:20-alpine

# 2. Crear carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/ 

# 4. Instalar dependencias
RUN npm ci

# 5. Generar cliente de Prisma (Si usas prisma)
RUN npx prisma generate

# 6. Copiar el resto del código
COPY . .

# 7. Exponer el puerto (cambia el 3000 si tu backend usa otro)
EXPOSE 3000

# 8. Comando para iniciar
CMD ["npm", "start"]