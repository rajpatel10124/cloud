pipeline {
    agent any

    environment {
        IMAGE_NAME = "instantprachi/jenkins-docker-demo"
        IMAGE_TAG  = "latest"
    }

    stages {

        stage('Clone Source Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/rajpatel10124/cloud.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
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
                                echo "Attempting Docker Hub login using company credentials"
                                echo $DOCKER_TOKEN | docker login -u $DOCKER_USER --password-stdin
                                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                            '''
                        }
                    } catch (err) {
                        echo "Docker push skipped – company credentials not provided"
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
