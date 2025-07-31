package main

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type StartTimerRequest struct {
	From     uint64 `json:"from"`
	Duration uint64 `json:"duration"`
}

type GetTimerResponse struct {
	From     uint64 `json:"from"`
	Duration uint64 `json:"duration"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type StartTimerResponse struct {
	ID string `json:"id"`
}

type DynamoTimerEntry struct {
	ID       string `dynamodbav:"id"`
	From     uint64 `dynamodbav:"from"`
	Duration uint64 `dynamodbav:"duration"`
	TTL      uint64 `dynamodbav:"ttl"`
}

type DynamoAPI interface {
	GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error)
	PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
}

func mustMarshalMap(v interface{}) map[string]types.AttributeValue {
	m, err := attributevalue.MarshalMap(v)
	if err != nil {
		panic("failed to marshal: " + err.Error())
	}
	return m
}

func mustJSON(v interface{}) string {
	b, _ := json.Marshal(v) // safe for logging only
	return string(b)
}

func writeError(status int, msg string) events.APIGatewayProxyResponse {
	b, _ := json.Marshal(ErrorResponse{Error: msg}) // safe to ignore, static struct
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Body:       string(b),
		Headers:    defaultHeaders,
	}
}

func writeSuccess(v interface{}) events.APIGatewayProxyResponse {
	b, _ := json.Marshal(v) // safe to ignore for well-formed structs
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(b),
		Headers:    defaultHeaders,
	}
}
