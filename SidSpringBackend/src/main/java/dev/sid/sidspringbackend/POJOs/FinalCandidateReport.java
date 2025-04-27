package dev.sid.sidspringbackend.POJOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FinalCandidateReport {
    String senderEmail;
    int techKnowledge;
    int communication;
    int problemSolving;
    String comments;
}
