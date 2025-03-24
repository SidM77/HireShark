package dev.sid.sidspringbackend.POJOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateRank {
    //change to percentage match to JD
    private int score;
    private String emailId;
    private String summary;
    private boolean status;
}
