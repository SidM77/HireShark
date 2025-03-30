package dev.sid.sidspringbackend.Service;

import dev.sid.sidspringbackend.Model.Job;
import dev.sid.sidspringbackend.POJOs.CandidateRank;
import dev.sid.sidspringbackend.Repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }


    public Job addNewJob(Job job) {
        String humanReadableJobId = "JX" + getBase36(5);
        job.setHumanReadableJobId(humanReadableJobId);
        job.setOpenPosition(true);
        job.setPhase(1);
        job.setAllOralTestResults(new ArrayList<OralTestResults>());
        return jobRepository.save(job);
    }

    public List<Job> findAllJobs() {
        return jobRepository.findAll();
    }


    private static final char[] BASE62_CHARS =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();

    private static final Random RANDOM = new Random();

    public static String getBase62(int length) {
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            sb.append(BASE62_CHARS[RANDOM.nextInt(62)]);
        }

        return sb.toString();
    }

    public static String getBase36(int length) {
        StringBuilder sb = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            sb.append(BASE62_CHARS[RANDOM.nextInt(36)]);
        }

        return sb.toString();
    }

    public Optional<Job> findJobByHumanReadableJobId(String humanReadableJobId) {
        return jobRepository.findByHumanReadableJobId(humanReadableJobId);
    }

    public Optional<Job> addCandidatesToJob(List<CandidateRank> candidateRankList, String humanReadableJobId) {
        Optional<Job> job = findJobByHumanReadableJobId(humanReadableJobId);

        job.ifPresent(j -> {
            j.setAllCandidatesRankingPhase1(candidateRankList);
            jobRepository.save(j);
        });

        return job;
    }
}
