variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance"
  type        = string
}

variable "ssh_key_file_location" {
  description = "ssh_key_file_location"
  type        = string
}