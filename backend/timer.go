package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

var dynamodbTableName = os.Getenv("DYNAMODB_TABLE_NAME")

func StartTimer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Printf("Event Received: %s\n", mustJSON(req))
	var body StartTimerRequest

	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		responseStruct := ErrorResponse{Error: "Invalid request body"}
		responseBytes, _ := json.Marshal(responseStruct)

		fmt.Printf("Error unmarshalling request body: %v\n", err)

		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(responseBytes),
			Headers:    defaultHeaders,
		}, nil
	}

	from := body.From
	duration := body.Duration
	id, err := gonanoid.New(8)

	if err != nil {
		return writeError(500, "Failed to generate ID"), nil
	}

	item := DynamoTimerEntry{
		ID:       id,
		From:     from,
		Duration: duration,
		TTL:      from + duration + 60*60*24*3, // 3 days TTL
	}

	if _, err = dynamoClient.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &dynamodbTableName,
		Item:      mustMarshalMap(item),
	}); err != nil {
		panic("Failed to put item in DynamoDB: " + err.Error())
	}

	fmt.Printf("Starting timer from %d with duration %d\n", from, duration)
	return writeSuccess(StartTimerResponse{ID: id}), nil
}

func GetTimer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Printf("Event Received: %s\n", mustJSON(req))
	timerID := req.PathParameters["id"]

	if timerID == "" {
		return writeError(400, "Timer ID is required"), nil
	}

	key := mustMarshalMap(map[string]string{"id": timerID})
	res, err := dynamoClient.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &dynamodbTableName,
		Key:       key,
	})

	if err != nil {
		return writeError(500, "Failed to get timer from DynamoDB"), nil
	}

	if res.Item == nil {
		return writeError(404, "Timer not found"), nil
	}

	var item DynamoTimerEntry
	if err := attributevalue.UnmarshalMap(res.Item, &item); err != nil {
		return writeError(500, "Failed to parse timer data"), nil
	}

	return writeSuccess(GetTimerResponse{From: item.From, Duration: item.Duration}), nil
}
