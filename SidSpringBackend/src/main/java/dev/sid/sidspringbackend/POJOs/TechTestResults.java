package dev.sid.sidspringbackend.POJOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechTestResults {
    private String senderEmail;
    private int audioCheatCount;
    private boolean isCheating;
    private boolean multipleFacesDetected;
    private int susSpikeCount;
    private int testScore;
    private int totalHeadMovements;
}
