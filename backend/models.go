package main

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
