pipeline {
  agent any

  environment {
    SSH_CRED_ID = 'jenkins-ssh-key-id'
    AWS_CREDS   = 'aws-creds'
  }

  stages {

    stage('Checkout') {
      steps {
        // Always use checkout scm or git with branch info
        git branch: 'main', url: 'https://github.com/nagasundharam/NetflixClone.git'
      }
    }

    stage('Build React') {
      steps {
        sh '''
          # Install Node.js and npm (make sure repo is updated)
          sudo apt-get update -y
          sudo apt-get install -y nodejs npm

          # Clean install dependencies
          npm ci

          # Build React app
          npm run build
        '''
      }
    }

    stage('Terraform Apply') {
      steps {
        withCredentials([[
          $class: 'AmazonWebServicesCredentialsBinding',
          credentialsId: env.AWS_CREDS
        ]]) {
          dir('terraform') {
            sh '''
              terraform init -input=false
              terraform apply -auto-approve
            '''
          }
        }
      }
    }

    stage('Ansible Deploy') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: env.SSH_CRED_ID,
          keyFileVariable: 'KEYFILE',
          usernameVariable: 'SSHUSER'
        )]) {
          sh '''
            ansible-playbook \
              -i ansible/inventories/hosts.ini ansible/playbook.yml \
              --extra-vars "ansible_ssh_private_key_file=${KEYFILE} ansible_user=${SSHUSER}"
          '''
        }
      }
    }
  }

  post {
    failure {
      echo "❌ Pipeline failed!"
    }
    success {
      echo "✅ Deployment complete!"
    }
  }
}
 