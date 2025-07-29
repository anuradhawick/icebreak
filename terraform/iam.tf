data "aws_iam_policy_document" "go_lambda_api_function_policy" {
  statement {
    actions = [
      "dynamodb:*",
    ]

    resources = [
      aws_dynamodb_table.timers_table.arn
    ]
  }
}
