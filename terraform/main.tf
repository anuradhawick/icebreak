provider "aws" {
  region = "ap-southeast-1"
  alias  = "default"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>6.6.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "~>3.2.4"
    }

    external = {
      source  = "hashicorp/external"
      version = "~>2.3.5"
    }
  }
}