package dev.sid.sidspringbackend.Model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private List<String> candidates;
    private boolean isOpenPosition;

    private LocalDateTime jobPostingDate;
}
