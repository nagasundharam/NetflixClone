===================   REACT DEPLOY WITH TERRAFORM ANSIBLE AND JENKINS ============================


###### PROJECT OVERVIEW ######
      
    This project automates the deployment of a React application using Jenkins, Terraform, and Ansible

        => Jenkins handles the CI/CD pipeline, triggering on GitHub code pushes.

        => Terraform provisions the required AWS infrastructure (EC2, key pair, security groups).

        => Ansible configures the EC2 instance and deploys the built React app through Nginx.
    
###### ARCHITECTURE / WORKFLOW ######

![Architecture Diagram](./images/image.png)

      
===>  GitHub — Stores source code, Jenkinsfile, Terraform, and Ansible scripts.

===>  Jenkins — Automates build & deployment pipeline.

===>  Terraform — Creates AWS EC2 instance and networking setup.

===>  Ansible — Installs Nginx, sets up SSL, and deploys React build.

===>  Nginx — Serves the React app over HTTPS.

###### Workflow Steps ######
===>  Developer pushes code → GitHub Webhook triggers Jenkins.

===>  Jenkins:

        ===>  Pulls the repository.

        ===>  Runs Terraform to create EC2 instance.

        ===>  Executes Ansible to configure the server and deploy files.

        ===>  Terraform provisions EC2 + security groups.

        ===>   Ansible installs Nginx, deploys React build, and configures SSL.

        ===>   App accessible via https://<EC2-public-IP>/

###### Tools Used ######

       
===>  Jenkins  -    CI/CD Orchestration

===>  Terraform	 -  Infrastructure as Code (AWS provisioning)

===>  Ansible    -  Configuration and Deployment

===>  Nginx     -   Web Server with SSL

===>  GitHub	-    Source Control & Webhook trigger

===>  React	-       Frontend Application

###### Prerequisities ######


===>  AWS account & access keys configured in Jenkins

===>  Jenkins with:

       ===> Terraform & Ansible installed

       ===> AWS credentials stored as global credentials

       ===> SSH private key added under system credentials

       ==> Domain & SSL certificate (optional but recommended)


###### Folder Structure ######


                react-deploy/
                ├── Jenkinsfile
                ├── terraform/
                │   ├── main.tf
                │   ├── variables.tf
                │   ├── outputs.tf
                │   └── provider.tf
                ├── ansible/
                │   ├── inventory
                │   ├── site.yml
                │   └── roles/
                │       ├── nginx/
                │       └── deploy/
                └── react-app/
                ├── build/
                └── src/

###### Jenkins Pipeline Stages ######

===> Checkout — Pulls repository from GitHub

===> Terraform Init/Apply — Provisions EC2 instance

===> Ansible Deploy — Installs Nginx & deploys app

===> Post Deployment — Display public IP / DNS


###### SSL Configuration ######

====> Certificates placed in /etc/pki/nginx/

        ===> server.crt → Public certificate

        ===> server.key → Private key

        ===> Nginx configuration ensures HTTPS redirection

###### Troubleshooting ######

Jenkins job stuck? → Check console output for missing credentials.

EC2 not reachable? → Verify security group ports (80/443).

SSL error? → Ensure correct file permissions for certs.

###### Access ######

https://<your-ec2-public-ip>/


###### Jenkins Docker File #####

        FROM jenkins/jenkins:lts

        USER root

        RUN apt-get update && apt-get install -y docker.io && apt-get clean

        VOLUME /var/jenkins_home

        EXPOSE 8080 50000

        USER jenkins


###### Build the Docker Image ######

              docker build -t jenkins-custom:latest .

              ====>  -t → tags your image with a name (jenkins-custom).

              ====>   . → means build using the current directory.


        ######  Runs the Jenkins Container ######

                docker run -d \
                --name jenkins \
                -p 8080:8080 \
                -p 50000:50000 \
                -v jenkins_home:/var/jenkins_home \
                -v /var/run/docker.sock:/var/run/docker.sock \
                jenkins-custom:latest

              
                -d              ------  Run in detached mode
                --name jenkins	 -----  Assigns container name
                -p 8080:8080    ------  Maps Jenkins web interface
                -p 50000:50000	------  Connects Jenkins agents
                -v jenkins_home:/var/jenkins_home  -----	Persistent Jenkins data
                -v /var/run/docker.sock:/var/run/docker.sock  -	Allows Jenkins to control Docker  host

        ====== Verify Installation ======

        <!-- Check container status: -->

                === > docker ps

        <!-- View logs: -->

                === > docker logs -f jenkins
        
        <!-- Access Jenkins UI: -->

                === > Open your browser → http://<your-server-ip>:8080
        <!-- Get initial admin password: -->

                === > docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   
        <!-- Verify Installed Tools Inside Container -->

                ===> docker exec -it jenkins bash


        <!-- Inside the container, check tools: -->

                ==> terraform -version
                ==> ansible --version
                ==> docker --version
                ==> aws --version

        Commands for building
                $ docker build -t <name> .	    Build an image

                $ docker run -d -p <host:container> <image>	Run a container

                $ docker ps	                    List running containers

                $ docker exec -it <container> bash  Access shell inside container

                $ docker logs <container>           View logs

                $ docker stop <container>           Stop container

                $ docker rm <container>             Remove container

                $ docker rmi <image>                Remove image
                