package dev.sid.sidspringbackend.Kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1")
public class KafkaSpecificMicroServiceMessagingController {
    public KafkaSpecificMicroServiceMessagingController(KafkaTemplate<String, MessageRequest> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    private KafkaTemplate<String, MessageRequest> kafkaTemplate;

    @PostMapping("/sendSingleTestLink/oralRound2")
    public void publishSingleOral (@RequestBody MessageRequest messageRequest) {
        kafkaTemplate.send("oralTestTopic", messageRequest);
        System.out.println("At producer currently "+ messageRequest.toString()
        );
    }

    @PostMapping("/sendMultipleTestLink/oralRound2")
    public void publishMultipleOral (@RequestBody List<MessageRequest> messageRequest) {
//        kafkaTemplate.send("oralTestTopic", messageRequest);
        for (MessageRequest message : messageRequest) {
            kafkaTemplate.send("oralTestTopic", message);

            System.out.println("At producer currently "+ message.toString());
        }
    }

    @PostMapping("/sendSingleTestLink/technicalRound1")
    public void publishSingleTechnical (@RequestBody MessageRequest messageRequest) {
        kafkaTemplate.send("technicalTestTopic", messageRequest);
        System.out.println("At producer currently "+ messageRequest.toString()
        );
    }

    @PostMapping("/sendMultipleTestLink/technicalRound1")
    public void publishMultipleTechnical (@RequestBody List<MessageRequest> messageRequest) {
//        kafkaTemplate.send("oralTestTopic", messageRequest);
        for (MessageRequest message : messageRequest) {
            kafkaTemplate.send("technicalTestTopic", message);

            System.out.println("At producer currently "+ message.toString());
        }
    }
}
