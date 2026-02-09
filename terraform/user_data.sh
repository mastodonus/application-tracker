#!/bin/bash
sudo yum update -y
sudo amazon-linux-extras enable docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

sudo mkfs -t ext4 /dev/xvdf || true
sudo mkdir -p /var/lib/postgresql/data
sudo mount /dev/xvdf /var/lib/postgresql/data
sudo chown -R ec2-user:ec2-user /var/lib/postgresql/data