pipeline {
	options {
		ansiColor('xterm')
	}
	stages {
		stage('Setup dependencies') {
		  agent {
        docker {
          image 'cjww-development/nodejs-aws:latest'
        }
    	}
			steps {
				sh 'yarn install'
			}
		}
		stage('Build distribution') {
		  agent {
        docker {
          image 'cjww-development/nodejs-aws:latest'
        }
      }
      steps {
        sh 'yarn build'
      }
    }
    stage('Run tests') {
      agent {
        docker {
          image 'cjww-development/nodejs-aws:latest'
        }
      }
      steps {
        sh 'yarn test:ci'
        sh 'python3 lcov_cobertura.py coverage/lcov.info --base-dir src/ --output coverage/coverage.xml'
      }
    }
    stage('Build docker image') {
      agent {
        docker {
          image 'docker:latest'
          args '--network="host" -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
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
