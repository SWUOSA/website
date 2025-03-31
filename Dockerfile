# 使用Node.js作为基础镜像
FROM node:20-alpine AS build

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制所有文件
COPY . .

# 构建应用
RUN cd apps/host && pnpm build

# 第二阶段：运行时
FROM node:20-alpine AS runtime

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制构建阶段的node_modules和构建输出
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/host/.output ./apps/host/.output
COPY --from=build /app/package.json ./

# 复制环境变量文件
COPY --from=build /app/.env.production ./.env

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "apps/host/.output/server/index.mjs"] 