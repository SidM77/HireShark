package dev.sid.mailmicroservice.Kafka;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MessageRequest(@JsonProperty("email") String email, @JsonProperty("id") String id) {
}
