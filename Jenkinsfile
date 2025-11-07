pipeline {
  agent any
  
  options {
  cleanWs()
}


  environment {
    SSH_CRED_ID = 'jenkins-ssh-key-id'
    AWS_CREDS   = 'aws-creds'
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/nagasundharam/NetflixClone.git'
      }
    }

    stage('Build React') {
      steps {
        sh '''
          apt-get update -y
          apt-get install -y nodejs npm

          npm ci
          npm run build
          tar -czf /tmp/react_build.tar.gz -C dist .
      echo "✅ Build artifact created at /tmp/react_build.tar.gz"
      ls -lh /tmp/react_build.tar.gz
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
            script {
              // Capture Terraform output dynamically
              env.INSTANCE_IP = sh(
                script: "terraform output -raw instance_public_ip",
                returnStdout: true
              ).trim()
              echo "✅ Instance public IP: ${env.INSTANCE_IP}"
            }
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
        echo "[web]" > ansible/inventories/hosts.ini
        echo "${INSTANCE_IP} ansible_user=${SSHUSER}" >> ansible/inventories/hosts.ini

        echo "✅ Using dynamic Ansible inventory:"
        cat ansible/inventories/hosts.ini

        ansible-playbook -i ansible/inventories/hosts.ini ansible/playbook.yml \
          --private-key ${KEYFILE} -u ${SSHUSER}
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
