package dev.sid.sidspringbackend.POJOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class OralTestResults {
    private String senderEmail;
    private Map<String, String> questions;  // Store dynamic questions with their keys
    private Map<String, String> answers;
}
