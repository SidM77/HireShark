package dev.sid.mailmicroservice.Kafka;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    public Map<String, Object> consumerConfig () {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
//        props.put(ConsumerConfig
//                        .GROUP_ID_CONFIG,
//                "groupId");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return props;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory () {
        return new DefaultKafkaConsumerFactory<>(consumerConfig());
    }


//    @Bean
//    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String,MessageRequest>> kafkaListenerContainerFactory (
//            ConsumerFactory<String, MessageRequest> consumerFactory
//    ) {
//        ConcurrentKafkaListenerContainerFactory<String, MessageRequest> concurrentKafkaListenerContainerFactory =
//                new ConcurrentKafkaListenerContainerFactory<>();
//        concurrentKafkaListenerContainerFactory.setConsumerFactory(consumerFactory);
//
//        return concurrentKafkaListenerContainerFactory;
//    }

//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String,
//            MessageRequest>
//    messageListener()
//    {
//        ConcurrentKafkaListenerContainerFactory<String,
//                MessageRequest>
//                factory
//                = new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(consumerFactory());
//        return factory;
//    }
}
