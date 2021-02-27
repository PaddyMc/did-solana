variable "do_token" {
  default = ""
}

variable "ssh_key_fingerprint" {
  default = ""
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_droplet" "did"{
  image = "ubuntu-18-04-x64"
  name = "node1"
  region = "ams3"
  size = "s-4vcpu-8gb"
  ssh_keys = [var.ssh_key_fingerprint]

  provisioner "file" {
    connection {
      host	  = digitalocean_droplet.did.ipv4_address
      type	  = "ssh"
      user	  = "root"
      private_key = file("~/.ssh/id_rsa")
    }

    source      = "./frontend/build"
    destination = "/root"
  }

  provisioner "remote-exec" {
    connection {
      host	  = digitalocean_droplet.did.ipv4_address
      type	  = "ssh"
      user	  = "root"
      private_key = file("~/.ssh/id_rsa")
    }

    inline = [
       "snap install serve",
    ]
  }
}
 
output "didaddr"{
  value = digitalocean_droplet.did.ipv4_address
}
