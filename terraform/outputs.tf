output "ec2_public_ip" {
  description = "Public IP address of the application EC2 instance"
  value       = aws_instance.app.public_ip
}