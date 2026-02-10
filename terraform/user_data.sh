#!/bin/bash
set -e

# find the root partition and expand it
ROOT_DEV=$(findmnt -n -o SOURCE /)
echo "Root device is $ROOT_DEV"
sudo growpart $ROOT_DEV 1
sudo xfs_growfs /

# Ensure docker-compose is in PATH
export PATH=$PATH:/usr/local/bin

# Update packages
sudo dnf update -y

# Install Docker and Git
sudo dnf install -y docker git

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user
newgrp docker

# Install docker-compose (v2)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Format and mount Postgres EBS volume
if ! blkid /dev/xvdf; then
  sudo mkfs -t ext4 /dev/xvdf
fi
sudo mkdir -p /var/lib/postgresql/data
sudo mount /dev/xvdf /var/lib/postgresql/data
sudo chown -R ec2-user:ec2-user /var/lib/postgresql/data

# Persist mount across reboots
echo "/dev/xvdf /var/lib/postgresql/data ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab