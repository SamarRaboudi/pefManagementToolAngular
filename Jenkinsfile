pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS'
        PATH = "$NODEJS_HOME/bin:${env.PATH}"
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO = 'raboudisamar25094/docker-frontend'
        APP_NAME = 'my-app'
    }

    stages {
        stage('Setup Node.js') {
            steps {
                script {
                    tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                }
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Unit Test') {
            steps {
                 sh 'npm run test -- --coverage' 
            }
        }
        stage('Sonarqube Analysis') {
            environment {
                SONARQUBE_PROJECT_KEY = "pfeManagementToolFront"
                SCANNER_HOME = tool 'sonar-scanner'
            }
            steps {
                echo "======SONARQUBE========="
                withSonarQubeEnv('sq1') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \\
                        -D sonar.login=admin \\
                        -D sonar.password=0000 \\
                        -D sonar.projectKey=${SONARQUBE_PROJECT_KEY} \\
                        -D"sonar.sources=." \\
                        -Dsonar.genericcoverage.reportVersion=1 \\
                        -Dsonar.genericcoverage.reportPaths=coverage.xml 
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "======Build Docker Image========="
 
                sh 'docker build -t raboudisamar25094/docker-frontend:latest -f docker/Dockerfile .'
        }
        }
        stage('Docker Login and Push') {
            steps {
                echo "====== Docker Push========="
                withCredentials([usernamePassword(credentialsId: '5f65d1a1-0d8f-44e2-918b-2e4ec34c08bb', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'
                    sh 'docker tag $DOCKER_REPO:latest $DOCKER_REPO:latest'
                    sh 'docker push $DOCKER_REPO:latest'
                }
            }
        }
        stage('Pull docker image') {
            steps {
                echo "====== Docker Pull========="
                withCredentials([usernamePassword(credentialsId: '5f65d1a1-0d8f-44e2-918b-2e4ec34c08bb', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker pull $DOCKER_REPO'
                }
            }
        }
        stage('Run docker image') {
            steps {
                echo "====== Docker Run========="
                withCredentials([usernamePassword(credentialsId: '5f65d1a1-0d8f-44e2-918b-2e4ec34c08bb', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker run -d $DOCKER_REPO'
                }
            }
        }    
    }
}
