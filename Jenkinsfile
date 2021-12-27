pipeline {
	agent {
	    docker {
	        image 'docker-in-docker-nodejs:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
	    }
	}
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
                sh 'python3 lcov_cobertura.py coverage/lcov.info --base-dir src/ --output coverage/coverage.xml'
            }
        }
        stage('Build docker image') {
            steps {
                sh 'docker build --rm -t cjww-development/ddns-update-scheduler .'
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
