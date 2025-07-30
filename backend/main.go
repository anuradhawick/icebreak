package main

import (
	"context"

	"github.com/D-Andreev/lambdamux"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var dynamoClient DynamoAPI
var defaultHeaders = map[string]string{"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic("unable to load SDK config, " + err.Error())
	}
	dynamoClient = dynamodb.NewFromConfig(cfg)
}

func main() {
	router := lambdamux.NewLambdaMux()

	// Start the timer
	router.POST("/timer", StartTimer)
	router.GET("/timer/:id", GetTimer)

	lambda.Start(router.Handle)
}
