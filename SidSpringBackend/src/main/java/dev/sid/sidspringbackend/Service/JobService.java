package dev.sid.sidspringbackend.Service;

import dev.sid.sidspringbackend.Model.Job;
import dev.sid.sidspringbackend.POJOs.CandidateRank;
import dev.sid.sidspringbackend.POJOs.FinalCandidateReport;
import dev.sid.sidspringbackend.POJOs.OralTestResults;
import dev.sid.sidspringbackend.Repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.*;

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
        job.setFinalCandidateReports(new ArrayList<FinalCandidateReport>());
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


    public String updateOrCreateOralTestResult(String email, Map<String, String> questions, Map<String, String> answers, String jobId) {
        // Find the job document by jobId
        Optional<Job> optionalJob = jobRepository.findByHumanReadableJobId(jobId);

        // Check if job is present
        if (optionalJob.isEmpty()) {
            return "Job not found";
        }

        // Get the job object from the Optional
        Job job = optionalJob.get();

        // Find existing OralTestResults entry by senderEmail
        OralTestResults existingResult = job.getAllOralTestResults().stream()
                .filter(result -> result.getSenderEmail().equals(email))
                .findFirst()
                .orElse(null);

        if (existingResult != null) {
            // Update the existing entry with new questions and answers
            existingResult.setQuestions(questions);
            existingResult.setAnswers(answers);
        } else {
            // Create new OralTestResults entry and add it to the list
            OralTestResults newResult = new OralTestResults(email, questions, answers);
            job.getAllOralTestResults().add(newResult);
        }

        // Save the updated job document back to the database
        jobRepository.save(job);

        return "Answers updated successfully";
    }

    public void setPhaseByHumanReadableId(String jobId, int newPhase) {
        Optional<Job> optionalJob = jobRepository.findByHumanReadableJobId(jobId);

        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            job.setPhase(newPhase);
            jobRepository.save(job);
        }
    }

    public String closeJobByHumanReadableId(String jobId) {
        Optional<Job> optionalJob = jobRepository.findByHumanReadableJobId(jobId);

        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            job.setOpenPosition(false);
            jobRepository.save(job);
            return "Y";
        } else {
            return "N";
        }
    }


    public String updateCandidateReportByEngineer(String email, String jobId, int techKnowledge, int communication, int problemSolving, String comments) {
        Optional<Job> optionalJob = jobRepository.findByHumanReadableJobId(jobId);

        // Check if job is present
        if (optionalJob.isEmpty()) {
            return "Job not found";
        }

        // Get the job object from the Optional
        Job job = optionalJob.get();

        FinalCandidateReport finalCandidateReport = job.getFinalCandidateReports().stream()
                .filter(result -> result.getSenderEmail().equals(email))
                .findFirst()
                .orElse(null);

        if (finalCandidateReport != null) {
            // Update the existing entry with new questions and answers
            finalCandidateReport.setComments(comments);
            finalCandidateReport.setCommunication(communication);
            finalCandidateReport.setProblemSolving(problemSolving);
            finalCandidateReport.setTechKnowledge(techKnowledge);
        } else {
            // Create new OralTestResults entry and add it to the list
            FinalCandidateReport newReport = new FinalCandidateReport(email, techKnowledge, communication, problemSolving,  comments);
            job.getFinalCandidateReports().add(newReport);
        }

        // Save the updated job document back to the database
        jobRepository.save(job);

        return "Answers updated successfully";
    }
}
