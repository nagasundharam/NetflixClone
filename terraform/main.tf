data "aws_ami" "ubuntu" {

         most_recent = true

         owners = ["099720109477"]

        filter {

        name = "name"

        values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]

        }
    }
resource "aws_vpc" "main" {

        cidr_block = "10.0.0.0/16"
        tags = { Name = "react-vpc" }
}

resource "aws_key_pair" "deployer" {

        key_name = var.key_name

        public_key = file(var.public_key_path)

}

resource "aws_internet_gateway" "igw" {

                                        
        vpc_id = aws_vpc.main.id

        tags = { Name = "react-igw" }
         }



resource "aws_subnet" "public" {

        vpc_id  = aws_vpc.main.id

        cidr_block  = "10.0.1.0/24"

        map_public_ip_on_launch = true

        availability_zone  = "${var.region}a"
}

resource "aws_route_table" "public_rt" {

        vpc_id = aws_vpc.main.id

        route {

                cidr_block = "0.0.0.0/0"

                gateway_id = aws_internet_gateway.igw.id


                }

        tags = { Name = "react-public-rt" }
}

resource "aws_route_table_association" "public_assoc" {

        subnet_id    = aws_subnet.public.id

        route_table_id  = aws_route_table.public_rt.id

        }




resource "aws_security_group" "web_sg" {

        name = "react-web-sg"

        vpc_id = aws_vpc.main.id

        ingress {

                from_port = 22

                to_port = 22
                                                  
                protocol = "tcp"

                cidr_blocks = ["0.0.0.0/0"]

                }
         ingress {

                from_port = 80
                to_port = 80

                protocol = "tcp"

                cidr_blocks = ["0.0.0.0/0"]

                }

          ingress {

                from_port  = 443

                to_port   = 443

                protocol  = "tcp"

                                                      
                cidr_blocks = ["0.0.0.0/0"]

               }








          egress {

                from_port  = 0

                to_port    = 0

                protocol   = "-1"

                cidr_blocks  = ["0.0.0.0/0"]

        }
   }


 resource "aws_instance" "web" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = aws_key_pair.deployer.key_name
  tags = { Name = "react-web-server" }

  depends_on = [aws_security_group.web_sg]
}

output "instance_public_ip"  {

         value = aws_instance.web.public_ip

        }

output "instance_public_dns" {

        value = aws_instance.web.public_ip

}



                                                          