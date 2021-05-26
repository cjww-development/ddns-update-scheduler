pipeline {
	agent any
	options {
		ansiColor('xterm')
	}
	stages {
		stage('Setup dependencies') {
			steps {
				sh 'yarn install'
			}
		}
		stage('Build distribution') {
            steps {
                sh 'yarn build'
            }
        }
        stage('Run tests') {
            steps {
                sh 'yarn test:ci'
                sh 'python lcov_cobertura.py coverage/lcov.info --base-dir src/ --output coverage/coverage.xml'
            }
        }
        stage('Build docker image') {
            steps {
                sh 'docker build -t cjww-development/ddns-update-scheduler .'
            }
        }

	}
	post {
		always {
			junit 'junit.xml'
			cobertura coberturaReportFile: 'coverage/coverage.xml'
			cleanWs()
		}
	}
}
