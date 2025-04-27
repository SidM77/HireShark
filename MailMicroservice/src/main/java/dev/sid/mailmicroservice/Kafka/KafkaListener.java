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
    public void listenerSidOralTestLink (String message) throws JsonProcessingException {
        System.out.println("Listener received for oralTest "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        sendEmailService.sendEmail(email, "Congratulations on clearing Round-1. Please use this link to give Round 2 of the test http://localhost:5174/round2/"+ id , "Invitation to Interview Round 2");
    }

    @org.springframework.kafka.annotation.KafkaListener(topics = "technicalTestTopic", groupId = "groupId")
    public void listenerKrishTechnicalTestLink (String message) throws JsonProcessingException {
        System.out.println("Listener received for technical test "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        sendEmailService.sendEmail(email, "Please use this link to give Round-1 of the test http://localhost:5000/round1/"+ id , "Invitation to Interview Round 1");
    }

    @org.springframework.kafka.annotation.KafkaListener(topics="richOralTestTopic", groupId = "groupId")
    public void listenerRichSidOralTestLink(String message) throws JsonProcessingException {
        System.out.println("Listener received for richOralTest "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        String jobId = jsonNode.get("jobId").asText();
        sendEmailService.sendEmail(email, "Dear Candidate,\n\nCongratulations on clearing Round-1," +
                "as such you are invited to a secondary oral assessment as part of the interview process.\n\n" +
                " Please use this link to give Round 2 of the test http://localhost:5174/richRound2/"+ jobId , "Invitation to Assessment Round 2");
    }

    @org.springframework.kafka.annotation.KafkaListener(topics="richTechnicalTestTopic", groupId = "groupId")
    public void listenerRichKrishTechnicalTestLink(String message) throws JsonProcessingException {
        System.out.println("Listener received for richTechnicalTest "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        String jobId = jsonNode.get("jobId").asText();
        sendEmailService.sendEmail(email, "Dear Candidate, \n\n" +
                "Thank you for you interest in a role, you have been selected to give the first round which will be an online assessment of your technical skills.\n\n" +
                "As such, please use this link to give Round 1  http://localhost:5000/round1/"+ jobId , "Invitation to Assessment Round 1");
    }

    @org.springframework.kafka.annotation.KafkaListener(topics="finalRoundTopic", groupId = "groupId1")
    public void listenerFinalRoundCandidateInterviewLink(String message) throws JsonProcessingException {
        System.out.println("Candiate Interview Link being processed");
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        String jobId = jsonNode.get("jobId").asText();
        sendEmailService.sendEmail(email, """
                Dear Candidate,\s
                
                Congratulations on clearing the Initial Interview rounds!\s
                
                 \
                We'd like to invite you for Face-to-Face online technical Interview using the below link!\s
                
                 https://meet.google.com/nid-kyeu-thf
                
                 Please ensure a stable internet connection throughout the test, \
                 please feel free to reach out in case of any queries or accommodations.""", "Invite for Technical Interview");

    }

    @org.springframework.kafka.annotation.KafkaListener(topics="finalRoundTopic", groupId = "groupId2")
    public void listenerFinalRoundEngineerInterviewLink(String message) throws JsonProcessingException {
        System.out.println("SWE Interview Request Link being processed");

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        String jobId = jsonNode.get("jobId").asText();
        sendEmailService.sendEmail("siddanth.manoj@gmail.com", "Dear Siddanth, \n\nWe’d like to request your assistance in conducting a face-to-face online video interview" +
                " for a candidate who has progressed to the next stage of our hiring process." +
                "\n\nThe candidate has already completed the previous assessment rounds, and this interview will help us evaluate their fit for the role more comprehensively." +
                "You may use this link to view the candidate's details \n" +
                "http://localhost:8080/api/v1/getPDF/"+email +
                "\n\nLink for the Interview -  https://meet.google.com/nid-kyeu-thf " +
                "\n\nSubsequently kindly fill out the candidate evaluation report based on their performance in the interview using the below link.\n" +
                "https://localhost:5173/candidateEvaluation/"+jobId+"/"+email+"\n\nThank you!" , "Request to Conduct Face-to-Face Online Video Interview");

    }

    @org.springframework.kafka.annotation.KafkaListener(topics="offerLetterTopic", groupId = "groupId")
    public void listenerOfferLetter(String message) throws JsonProcessingException {
        System.out.println("Offer letter");

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String jobTitle = jsonNode.get("id").asText();
        String jobId = jsonNode.get("jobId").asText();

        sendEmailService.sendOfferMail(email, jobTitle, "Congratulations on Job Offer!");
    }
}
