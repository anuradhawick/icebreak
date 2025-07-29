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
	fmt.Println("Event Received:", req)
	var body StartTimerRequest

	if err := json.Unmarshal([]byte(req.Body), &body); err != nil {
		responseStruct := ErrorResponse{Error: "Invalid request body"}
		responseBytes, _ := json.Marshal(responseStruct)

		fmt.Printf("Error unmarshalling request body: %v\n", err)

		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(responseBytes),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	from := body.From
	duration := body.Duration
	id, err := gonanoid.New(8)

	if err != nil {
		panic(err)
	}

	item := DynamoTimerEntry{
		ID:       id,
		From:     from,
		Duration: duration,
		TTL:      from + duration + 60*60*24*3, // 3 days TTL
	}
	itemMap, err := attributevalue.MarshalMap(item)

	if err != nil {
		panic("Failed to marshal item: " + err.Error())
	}

	_, err = DynamoClient.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &dynamodbTableName,
		Item:      itemMap,
	})

	if err != nil {
		panic("Failed to put item in DynamoDB: " + err.Error())
	}

	fmt.Printf("Starting timer from %d with duration %d\n", from, duration)

	responseStruct := StartTimerResponse{ID: "ID"}
	responseBytes, _ := json.Marshal(responseStruct)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBytes),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}

func GetTimer(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Println("Event Received:", req)
	timerID := req.PathParameters["id"]

	if timerID == "" {
		responseStruct := ErrorResponse{Error: "Timer ID is required"}
		responseBytes, _ := json.Marshal(responseStruct)

		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(responseBytes),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	timerIDMap, err := attributevalue.MarshalMap(map[string]string{"id": timerID})

	if err != nil {
		panic("Failed to marshal timer ID: " + err.Error())
	}

	res, err := DynamoClient.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &dynamodbTableName,
		Key:       timerIDMap,
	})

	if err != nil {
		responseStruct := ErrorResponse{Error: "Failed to get timer from DynamoDB"}
		responseBytes, _ := json.Marshal(responseStruct)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(responseBytes),
			Headers:    map[string]string{"Content-Type": "application/json"},
		}, nil
	}

	var item DynamoTimerEntry

	if err := attributevalue.UnmarshalMap(res.Item, &item); err != nil {
		panic("Failed to unmarshal item: " + err.Error())
	}

	responseStruct := GetTimerResponse{From: item.From, Duration: item.Duration}
	responseBytes, _ := json.Marshal(responseStruct)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBytes),
		Headers:    map[string]string{"Content-Type": "application/json"},
	}, nil
}
