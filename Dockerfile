# Etapa 1: Construcción
FROM node:20.19-bullseye AS build

WORKDIR /Front

# Copia los archivos de dependencias y las instala
COPY package*.json ./
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Ejecuta el build de Angular
RUN npm run build

# Etapa 2 (opcional): Servir con nginx o http-server si quieres un contenedor ejecutable
# FROM nginx:alpine
# COPY --from=build /app/dist/tu-nombre-app /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

