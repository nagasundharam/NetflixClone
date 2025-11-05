variable "region" {  default = "ap-south-1" }

variable "key_name" { default = "react-deploy-key" }

variable "public_key_path" { default = "~/.ssh/id_ed25519.pub" }

variable "instance_type" { default = "t3.micro" }

variable "domain_name" { default = "" }
variable "private_key_path" {
  description = "Path to the private key for remote SSH connection"
  type        = string
}
