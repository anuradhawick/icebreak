package main

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type MockDynamoAPI struct {
	GetItemFunc func(ctx context.Context, input *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error)
	PutItemFunc func(ctx context.Context, input *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
}

func (m *MockDynamoAPI) GetItem(ctx context.Context, input *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	return m.GetItemFunc(ctx, input, optFns...)
}

func (m *MockDynamoAPI) PutItem(ctx context.Context, input *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return m.PutItemFunc(ctx, input, optFns...)
}

func TestStartTimer(t *testing.T) {
	// Mock the DynamoDB client and other dependencies
	mockDynamoClient := &MockDynamoAPI{
		PutItemFunc: func(ctx context.Context, input *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}
	dynamoClient = mockDynamoClient

	// Create a sample request
	req := events.APIGatewayProxyRequest{
		Body: `{"from": 1622547800, "duration": 3600}`,
	}

	// Call the StartTimer function
	resp, err := StartTimer(context.Background(), req)

	// Check for errors
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check the response status code
	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	// Check if the response body contains the expected ID
	var responseBody StartTimerResponse
	if err := json.Unmarshal([]byte(resp.Body), &responseBody); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	if responseBody.ID == "" {
		t.Error("Expected non-empty ID in response")
	}
}

func TestGetTimer(t *testing.T) {
	// Mock the DynamoDB client and other dependencies
	mockDynamoClient := &MockDynamoAPI{
		GetItemFunc: func(ctx context.Context, input *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: map[string]types.AttributeValue{
					"id":       &types.AttributeValueMemberS{Value: "test-id"},
					"from":     &types.AttributeValueMemberN{Value: "1622547800"},
					"duration": &types.AttributeValueMemberN{Value: "3600"},
				},
			}, nil
		},
	}
	dynamoClient = mockDynamoClient

	// Create a sample request
	req := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"id": "test-id"},
	}

	// Call the GetTimer function
	resp, err := GetTimer(context.Background(), req)

	// Check for errors
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check the response status code
	if resp.StatusCode != 200 {
		t.Errorf("Expected status code 200, got %d", resp.StatusCode)
	}

	// Check if the response body contains the expected timer data
	var responseBody GetTimerResponse
	if err := json.Unmarshal([]byte(resp.Body), &responseBody); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	if responseBody.From == 0 || responseBody.Duration == 0 {
		t.Error("Expected non-zero 'from' and 'duration' in response")
	}
}

func TestGetTimerNotExist(t *testing.T) {
	// Mock the DynamoDB client and other dependencies
	mockDynamoClient := &MockDynamoAPI{
		GetItemFunc: func(ctx context.Context, input *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: nil, // Simulate item not found
			}, nil
		},
	}
	dynamoClient = mockDynamoClient

	// Create a sample request
	req := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"id": "test-id"},
	}

	// Call the GetTimer function
	resp, err := GetTimer(context.Background(), req)

	// Check for errors
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Check the response status code
	if resp.StatusCode != 404 {
		t.Errorf("Expected status code 404, got %d", resp.StatusCode)
	}

	// Check if the response body contains the expected timer data
	var responseBody GetTimerResponse
	if err := json.Unmarshal([]byte(resp.Body), &responseBody); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
}
