pipeline {
  agent any

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
        echo "KEYFILE = ${KEYFILE}"
         echo "SSHUSER = ${SSHUSER}"
        ls -l ${KEYFILE}
        
        if [ -f "$KEYFILE" ]; then
          echo "Keyfile exists"
          ls -l "$KEYFILE" | awk '{print $1, $3, $4, $5}'
        else
          echo "Keyfile does NOT exist"
        fi



        echo "[web]" > ansible/inventories/hosts.ini
        echo "${INSTANCE_IP} ansible_user=${SSHUSER} ansible_ssh_private_key_file=${KEYFILE}" >> ansible/inventories/hosts.ini
        echo "✅ Using dynamic Ansible inventory:"
        cat ansible/inventories/hosts.ini

        ansible-playbook -i ansible/inventories/hosts.ini ansible/playbook.yml
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
