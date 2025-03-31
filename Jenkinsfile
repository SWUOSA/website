pipeline {
    agent any
    
    environment {
        APP_NAME = 'swuosa'
        CONTAINER_NAME = 'swuosa-web'
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install -g pnpm'
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('Build') {
            steps {
                sh 'cd apps/host && pnpm build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${APP_NAME}:latest .'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker stop ${CONTAINER_NAME} || true'
                sh 'docker rm ${CONTAINER_NAME} || true'
                
                sh '''
                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${HOST_PORT}:${CONTAINER_PORT} \
                    -v $(pwd)/.env.production:/app/.env:ro \
                    --restart unless-stopped \
                    ${APP_NAME}:latest
                '''
                
                sh 'docker image prune -f'
            }
        }
    }
    
    post {
        success {
            echo '部署成功! 应用现在可以通过 http://localhost:${HOST_PORT} 访问'
        }
        failure {
            echo '部署失败，请查看日志了解详情'
        }
        always {
            echo '清理工作区...'
            cleanWs()
        }
    }
} 