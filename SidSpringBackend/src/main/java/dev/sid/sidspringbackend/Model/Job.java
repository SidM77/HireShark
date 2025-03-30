package dev.sid.sidspringbackend.Model;


import dev.sid.sidspringbackend.POJOs.CandidateRank;
import dev.sid.sidspringbackend.POJOs.OralTestResults;
import dev.sid.sidspringbackend.POJOs.TechTestResults;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "jobs")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Job {
    @Id
    private ObjectId id;
    private String humanReadableJobId;
    private String jobTitle;
    private String jobDescription;
//    private List<String> candidates;
    private List<CandidateRank> allCandidatesRankingPhase1;
    private List<TechTestResults> allTechTestResults;
    private List<OralTestResults> allOralTestResults;
    private int phase;
    private boolean isOpenPosition;

    private LocalDateTime jobPostingDate;
}
