package dev.sid.sidspringbackend.Kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic oralTestTopic() {
        return TopicBuilder.name("oralTestTopic").build();
    }

    @Bean
    public NewTopic technicalTestTopic() {
        return TopicBuilder.name("technicalTestTopic").build();
    }
}
