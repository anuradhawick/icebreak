resource "aws_api_gateway_rest_api" "icebreak_api" {
  name = "${var.webapp_name}-api"
}

resource "aws_api_gateway_resource" "icebreak_root" {
  parent_id   = aws_api_gateway_rest_api.icebreak_api.root_resource_id
  path_part   = "{proxy+}"
  rest_api_id = aws_api_gateway_rest_api.icebreak_api.id
}

resource "aws_api_gateway_method" "icebreak_root" {
  authorization = "NONE"
  http_method   = "GET"
  resource_id   = aws_api_gateway_resource.icebreak_root.id
  rest_api_id   = aws_api_gateway_rest_api.icebreak_api.id
}

resource "aws_api_gateway_integration" "icebreak_root" {
  http_method             = aws_api_gateway_method.icebreak_root.http_method
  resource_id             = aws_api_gateway_resource.icebreak_root.id
  rest_api_id             = aws_api_gateway_rest_api.icebreak_api.id
  type                    = "AWS_PROXY"
  uri                     = module.go_lambda_api_function.invoke_arn
  integration_http_method = "POST"
}

resource "aws_api_gateway_integration_response" "icebreak_root" {
  http_method = aws_api_gateway_method.icebreak_root.http_method
  resource_id = aws_api_gateway_resource.icebreak_root.id
  rest_api_id = aws_api_gateway_rest_api.icebreak_api.id
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}

module "cors_icebreak_root" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.icebreak_api.id
  api_resource_id = aws_api_gateway_resource.icebreak_root.id
}

resource "aws_api_gateway_deployment" "icebreak_api" {
  rest_api_id = aws_api_gateway_rest_api.icebreak_api.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.icebreak_root.id,
      aws_api_gateway_method.icebreak_root.id,
      aws_api_gateway_integration.icebreak_root.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "icebreak_api" {
  deployment_id = aws_api_gateway_deployment.icebreak_api.id
  rest_api_id   = aws_api_gateway_rest_api.icebreak_api.id
  stage_name    = "${var.webapp_name}-prod"
}
