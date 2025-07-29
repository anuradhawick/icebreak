data "external" "build" {

  program = ["python", "build.py"]
  query = {
    install_command   = var.install_command
    build_command     = var.build_command
    webapp_dir        = var.webapp_dir
    build_destination = var.build_destination
    api_url           = aws_api_gateway_stage.icebreak_api.invoke_url
  }
  working_dir = path.module
}

resource "null_resource" "s3_upload" {
  triggers = {
    compiled_code_hash = data.external.build.result.hash
    build_file_hash    = filesha1("./build.py")
  }

  provisioner "local-exec" {
    command = "/bin/bash ./upload.sh ${var.build_destination} ${aws_s3_bucket.apps_bucket.id} ${var.webapp_name}"
  }

  depends_on = [
    aws_s3_bucket.apps_bucket
  ]
}

resource "null_resource" "cloudfront_invalidate" {
  triggers = {
    compiled_code_hash = data.external.build.result.hash
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.s3_distribution.id} --paths '/*'"
  }

  depends_on = [
    null_resource.s3_upload,
  ]
}
