output "api_url" {
  value       = aws_api_gateway_stage.webapp_api.invoke_url
  description = "The URL of the deployed API Gateway stage"
}

output "cloudfront_distribution_url" {
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
  description = "The url of the CloudFront distribution"
}
