pipeline {
    agent any
    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/vivianemonteiro/testes-api-cy.git' 
            }
        }
    }
     stages {
        stage('Instalar dependências') {
            steps {
                sh 'npm install'
            }
        }
    }
     stages {
        stage('Executar testes') {
            steps {
                sh 'NO_COLOR npm cy:run'
            }
        }
    }
}
