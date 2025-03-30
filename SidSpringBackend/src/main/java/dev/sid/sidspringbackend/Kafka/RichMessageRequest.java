package dev.sid.sidspringbackend.Kafka;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RichMessageRequest (@JsonProperty("email") String email, @JsonProperty("id") String id, @JsonProperty("jobId") String jobId) {
}
