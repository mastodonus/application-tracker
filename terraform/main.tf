# Create the VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "application-tracker-vpc"
  }
}

# Create gateway allowing traffic into the VPC
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "application-tracker-igw"
  }
}

# Create a subnet within the VPC
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "application-tracker-public"
  }
}

# Provide a default route to the internet for the public subnet
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "application-tracker-public-rt"
  }
}

# Associate the the route table with the vpcs subnet
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# create a security group. Allow me to SSH, allow internet to hit port 3000
resource "aws_security_group" "ec2" {
  name   = "application-tracker-ec2-sg"
  vpc_id = aws_vpc.main.id

  # Allow SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow API
  ingress {
    description = "API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow frontend
  ingress {
    description = "Client"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "main" {
  key_name   = "application-tracker-key"
  public_key = file(var.ssh_key_file_location)
}

data "aws_ami" "amazon_linux" {
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  owners = ["amazon"]
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = aws_key_pair.main.key_name

  user_data = file("${path.module}/user_data.sh")

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  tags = {
    Name = "application-tracker"
  }
}

resource "aws_ebs_volume" "postgres_data" {
  availability_zone = aws_instance.app.availability_zone
  size              = 20
  type              = "gp3"

  tags = {
    Name = "application-tracker-postgres"
  }
}

resource "aws_volume_attachment" "postgres_attach" {
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.postgres_data.id
  instance_id = aws_instance.app.id
}

resource "aws_route53_zone" "app" {
  name = "mastodonus.com"
}

resource "aws_route53_record" "client" {
  zone_id = aws_route53_zone.app.id
  name    = "application-tracker"
  type    = "A"
  ttl     = 60
  records = [aws_instance.app.public_ip]
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.app.id
  name    = "api.application-tracker"
  type    = "A"
  ttl     = 60
  records = [aws_instance.app.public_ip]
}