resource "aws_api_gateway_rest_api" "webapp_api" {
  name = "${var.webapp_name}-api"
}

resource "aws_api_gateway_resource" "webapp_root" {
  parent_id   = aws_api_gateway_rest_api.webapp_api.root_resource_id
  path_part   = "{proxy+}"
  rest_api_id = aws_api_gateway_rest_api.webapp_api.id
}

resource "aws_api_gateway_method" "webapp_root" {
  resource_id   = aws_api_gateway_resource.webapp_root.id
  rest_api_id   = aws_api_gateway_rest_api.webapp_api.id
  http_method   = "ANY"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method_response" "webapp_root" {
  rest_api_id = aws_api_gateway_method.webapp_root.rest_api_id
  resource_id = aws_api_gateway_method.webapp_root.resource_id
  http_method = aws_api_gateway_method.webapp_root.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_integration" "webapp_root" {
  http_method             = aws_api_gateway_method.webapp_root.http_method
  resource_id             = aws_api_gateway_resource.webapp_root.id
  rest_api_id             = aws_api_gateway_rest_api.webapp_api.id
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = module.webapp_go_api.lambda_function_invoke_arn
}

resource "aws_api_gateway_integration_response" "webapp_root" {
  rest_api_id = aws_api_gateway_rest_api.webapp_api.id
  resource_id = aws_api_gateway_resource.webapp_root.id
  http_method = aws_api_gateway_method.webapp_root.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}

resource "aws_lambda_permission" "webapp_api_lambda_permission" {
  statement_id  = "${var.webapp_name}-AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.webapp_go_api.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.webapp_api.execution_arn}/*"
}


module "cors_webapp_root" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = aws_api_gateway_rest_api.webapp_api.id
  api_resource_id = aws_api_gateway_resource.webapp_root.id
}

resource "aws_api_gateway_deployment" "webapp_api" {
  rest_api_id = aws_api_gateway_rest_api.webapp_api.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.webapp_root.id,
      aws_api_gateway_method.webapp_root.id,
      aws_api_gateway_integration.webapp_root.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "webapp_api" {
  deployment_id = aws_api_gateway_deployment.webapp_api.id
  rest_api_id   = aws_api_gateway_rest_api.webapp_api.id
  stage_name    = "${var.webapp_name}-prod"
}
