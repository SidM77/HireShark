package dev.sid.sidspringbackend.Kafka;


import dev.sid.sidspringbackend.Service.JobService;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1")
public class NewKafkaJobMailController {
//    public NewKafkaJobMailController(KafkaTemplate<String, RichMessageRequest> kafkaTemplate) {
//        this.richKafkaTemplate = kafkaTemplate;
//    }

    private KafkaTemplate<String, RichMessageRequest> richKafkaTemplate;


    public NewKafkaJobMailController(KafkaTemplate<String, RichMessageRequest> richKafkaTemplate, JobService jobService) {
        this.richKafkaTemplate = richKafkaTemplate;
        this.jobService = jobService;
    }

    private JobService jobService;


    @PostMapping("/rich/sendSingleTestLink/oralRound2")
    public void publishSingleOral (@RequestBody RichMessageRequest richMessageRequest) {
        richKafkaTemplate.send("richOralTestTopic", richMessageRequest);
        System.out.println("At producer currently "+ richMessageRequest.toString()
        );
    }

    @PostMapping("rich/sendMultipleTestLink/oralRound2")
    public void publishMultipleOral (@RequestBody List<RichMessageRequest> richMessageRequest) {
//        kafkaTemplate.send("oralTestTopic", messageRequest);
        String jobId = richMessageRequest.getFirst().jobId();
        jobService.setPhaseByHumanReadableId(jobId, 4);
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
        String jobId = richMessageRequest.getFirst().jobId();
        jobService.setPhaseByHumanReadableId(jobId, 3);
        for (RichMessageRequest message : richMessageRequest) {
            richKafkaTemplate.send("richTechnicalTestTopic", message);

            System.out.println("At producer currently "+ message.toString());
        }
    }

}
