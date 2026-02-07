pipeline {
    agent any

    environment {
        IMAGE_NAME = "instantprachi/jenkins-demo"
        IMAGE_TAG  = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Docker image successfully built and pushed to Docker Hub"
        }
        failure {
            echo "Pipeline failed"
        }
    }
}

