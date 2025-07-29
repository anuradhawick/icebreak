terraform {
  backend "s3" {
    bucket       = "terraform-states-anuradhawick"
    key          = "icebreak"
    region       = "ap-southeast-1"
    use_lockfile = true
  }
}