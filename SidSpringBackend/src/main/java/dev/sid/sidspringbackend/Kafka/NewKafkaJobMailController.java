package dev.sid.sidspringbackend.Kafka;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1")
public class NewKafkaJobMailController {
    public NewKafkaJobMailController(KafkaTemplate<String, RichMessageRequest> kafkaTemplate) {
        this.richKafkaTemplate = kafkaTemplate;
    }

    private KafkaTemplate<String, RichMessageRequest> richKafkaTemplate;

    @PostMapping("/rich/sendSingleTestLink/oralRound2")
    public void publishSingleOral (@RequestBody RichMessageRequest richMessageRequest) {
        richKafkaTemplate.send("richOralTestTopic", richMessageRequest);
        System.out.println("At producer currently "+ richMessageRequest.toString()
        );
    }

    @PostMapping("rich/sendMultipleTestLink/oralRound2")
    public void publishMultipleOral (@RequestBody List<RichMessageRequest> richMessageRequest) {
//        kafkaTemplate.send("oralTestTopic", messageRequest);
        for (RichMessageRequest message : richMessageRequest) {
            richKafkaTemplate.send("richOralTestTopic", message);

            System.out.println("At producer currently "+ message.toString());
        }
    }

    @PostMapping("/rich/sendSingleTestLink/technicalRound1")
    public void publishSingleTechnical (@RequestBody RichMessageRequest richMessageRequest) {
        richKafkaTemplate.send("richTechnicalTestTopic", richMessageRequest);
        System.out.println("At producer currently "+ richMessageRequest.toString()
        );
    }

    @PostMapping("rich/sendMultipleTestLink/technicalRound1")
    public void publishMultipleTechnical (@RequestBody List<RichMessageRequest> richMessageRequest) {
//        kafkaTemplate.send("oralTestTopic", messageRequest);
        for (RichMessageRequest message : richMessageRequest) {
            richKafkaTemplate.send("richTechnicalTestTopic", message);

            System.out.println("At producer currently "+ message.toString());
        }
    }

}
