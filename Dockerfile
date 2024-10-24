# Step 1: Build the React application
FROM node:22.9.0 AS build

# Working directory 설정
WORKDIR /app

# 패키지 파일 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
