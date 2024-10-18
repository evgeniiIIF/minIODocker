# Используем официальный образ Node.js
FROM node:16 AS build

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app/

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем React приложение
RUN npm run build

# Используем Nginx для раздачи статики
FROM nginx:alpine

# Копируем собранное приложение в директорию Nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]