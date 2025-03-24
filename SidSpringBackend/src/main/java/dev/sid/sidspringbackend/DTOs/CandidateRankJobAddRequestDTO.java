package dev.sid.sidspringbackend.DTOs;

import dev.sid.sidspringbackend.POJOs.CandidateRank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateRankJobAddRequestDTO {
    private List<CandidateRank> candidateRankList;
    private String humanReadableJobId;
}
