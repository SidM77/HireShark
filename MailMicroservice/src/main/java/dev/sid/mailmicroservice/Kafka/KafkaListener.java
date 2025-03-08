package dev.sid.mailmicroservice.Kafka;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class KafkaListener {
    @org.springframework.kafka.annotation.KafkaListener(topics = "oralTestTopic", groupId = "groupId")
    public void listener (String message) throws JsonProcessingException {
        System.out.println("Listener received "+message);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);

        String email = jsonNode.get("email").asText();
        String id = jsonNode.get("id").asText();
        sendEmailService.sendEmail(email, "Please use this link to give Round 1 of the test http://localhost:5173/round1/"+ id , "Invitation to Interview Round 1");
    }

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    public Map<String, Object> consumerConfig () {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory () {
        return new DefaultKafkaConsumerFactory<>(consumerConfig());
    }

    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String,String>> kafkaListenerContainerFactory (
            ConsumerFactory<String, String> consumerFactory
    ) {
        ConcurrentKafkaListenerContainerFactory<String, String> concurrentKafkaListenerContainerFactory =
                new ConcurrentKafkaListenerContainerFactory<>();
        concurrentKafkaListenerContainerFactory.setConsumerFactory(consumerFactory);

        return concurrentKafkaListenerContainerFactory;
    }
}
