pipeline {
    agent any

    environment {
        IMAGE_NAME = "instantprachi/jenkins-docker-demo"
        IMAGE_TAG  = "latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Docker Push (Company Managed Credentials)') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(
                            credentialsId: 'dockerhub-creds',
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_TOKEN'
                        )]) {
                            sh '''
                                echo "Attempting Docker login"
                                echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin
                                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                            '''
                        }
                    } catch (err) {
                        echo "Docker push skipped – company credentials not available"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully"
        }
    }
}
