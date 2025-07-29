# AWS configuration
variable "common_tags" {
  type        = map(string)
  description = "A set of tags to attach to every created resource."
  default = {
    NAME = "IceBreak"
  }
}

## App config
variable "webapp_name" {
  type        = string
  description = "Name"
  default     = "icebreak"
}

# Build commands
variable "webapp_dir" {
  type        = string
  description = "Relative path to webapp"
  default     = "../frontend/"
}

variable "install_command" {
  type        = string
  description = "Install command to install requirements"
  default     = "pnpm install"
}


variable "build_command" {
  type        = string
  description = "Build command to build the webapp"
  default     = "pnpm run build"
}

variable "build_destination" {
  type        = string
  description = "Path to built source"
  default     = "../frontend/dist/"
}
