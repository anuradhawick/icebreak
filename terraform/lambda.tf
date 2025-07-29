module "go_lambda_api_function" {
  source                            = "terraform-aws-modules/lambda/aws"
  function_name                     = "${var.webapp_name}-api"
  cloudwatch_logs_retention_in_days = 5
  handler                           = "bootstrap"
  runtime                           = "provided.al2023"
  architectures                     = ["arm64"]
  trigger_on_package_timestamp      = false
  memory_size                       = 128
  timeout                           = 5
  attach_policy_jsons               = true
  number_of_policy_jsons            = 1

  policy_jsons = [
    data.aws_iam_policy_document.go_lambda_api_function_policy.json,
  ]

  environment_variables = {
    DYNAMODB_TABLE_NAME = aws_dynamodb_table.timers_table.name
  }

  source_path = [
    {
      path = "${path.module}/../backend/"
      commands = [
        "GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -o bootstrap .",
        ":zip",
      ]
      patterns = [
        "!.*",
        "bootstrap",
      ]
    }
  ]
}
