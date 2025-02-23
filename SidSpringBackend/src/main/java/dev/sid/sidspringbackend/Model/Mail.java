package dev.sid.sidspringbackend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Document(collection = "mailHandler")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Mail {
    @Id
    private ObjectId id;
    private Instant date;
    private String file_path;
    private byte[] pdfFile;
    private String pdfFilename;
    private String senderEmail;
    private String subject;

    private Map<String, String> questions;  // Store dynamic questions with their keys
    private Map<String, String> answers;

    private int technicalTestScore;
}
