# Node.js 기반 이미지 선택
FROM node:18

# 작업 디렉토리 생성
WORKDIR /app

# package.json / package-lock.json 있으면 복사
COPY package*.json ./

# 의존성 설치 (없으면 건너뜀)
RUN npm install || true

# 나머지 파일 복사
COPY . .

# 시그널링 서버 실행 (8081포트 사용)
EXPOSE 8081
CMD ["node", "signaling-server.js"]
