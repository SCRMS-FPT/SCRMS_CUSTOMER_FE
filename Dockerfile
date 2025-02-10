# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy các file cấu hình và cài đặt dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ source code và build ứng dụng
COPY . .
RUN npm run build

# Stage 2: Chạy ứng dụng với Nginx
FROM nginx:alpine
# Copy file build (Vite mặc định xuất ra folder 'dist') vào thư mục của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx (tùy chọn: nếu bạn muốn cấu hình custom)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
