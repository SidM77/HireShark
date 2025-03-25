package dev.sid.mailmicroservice.Kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.sid.mailmicroservice.Service.SendEmailService;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class KafkaListener {

    public SendEmailService sendEmailService;

    public KafkaListener(SendEmailService sendEmailService) {
        this.sendEmailService = sendEmailService;
    }


    @org.springframework.kafka.annotation.KafkaListener(topics = "oralTestTopic", groupId = "groupId")
    public void listener (String message) throws JsonProcessingException {
        System.out.println("Listener received "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        sendEmailService.sendEmail(email, "Please use this link to give Round 1 of the test http://localhost:5173/round1/"+ id , "Invitation to Interview Round 1");
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "technicalTestTopic", groupId = "groupId")
    public void listenerKrishTechnicalTestLink (String message) throws JsonProcessingException {
        System.out.println("Listener received for technical test "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        sendEmailService.sendEmail(email, "Congratulations on clearing Round-1. Please use this link to give Round 2 of the test http://localhost:5173/round2/"+ id , "Invitation to Interview Round 2");
    }


}
