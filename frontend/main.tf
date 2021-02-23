variable "do_token" {
  default = "4090efce742de6492901b892c6612974ee1eced22e7bfc5696580ff71b6291a8"
}

variable "ssh_key_fingerprint" {
  default = "6e:36:62:ad:e6:d2:aa:97:cd:de:d1:10:e1:7e:f9:ab"
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

  provisioner "remote-exec" {
    connection {
      host	  = digitalocean_droplet.did.ipv4_address
      type	  = "ssh"
      user	  = "root"
      private_key = file("~/.ssh/id_rsa")
    }

    inline = [
	"ls",
    ]
  }
}
 
output "sentry1"{
  value = digitalocean_droplet.sentry_node_1.ipv4_address
}
