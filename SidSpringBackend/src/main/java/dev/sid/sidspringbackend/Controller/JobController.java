package dev.sid.sidspringbackend.Controller;

import dev.sid.sidspringbackend.DTOs.CandidateRankJobAddRequestDTO;
import dev.sid.sidspringbackend.Model.Job;
import dev.sid.sidspringbackend.POJOs.OralTestResults;
import dev.sid.sidspringbackend.Repository.JobRepository;
import dev.sid.sidspringbackend.Service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class JobController {

    public JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/createNewJob")
    public ResponseEntity<Job> createNewJob(@RequestBody Job job) {
        return new ResponseEntity<>(jobService.addNewJob(job),HttpStatus.OK);
    }

    @GetMapping("/getAllJobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return new ResponseEntity<>(jobService.findAllJobs(), HttpStatus.OK);
    }

    @GetMapping("/findJobById/{humanReadableJobId}")
    public ResponseEntity<Job> findJobByHumanReadableJobId(@PathVariable String humanReadableJobId) {
        Optional<Job> job = jobService.findJobByHumanReadableJobId(humanReadableJobId);

        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

//        if (job.isPresent()) {
//            return ResponseEntity.ok(job.get());  // Return 200 OK with the job
//        } else {
//            return ResponseEntity.notFound().build();  // Return 404 Not Found if job is not found
//        }
    }

    @PutMapping("/addPotentialRankedCandidatesToAJob")
    public ResponseEntity<Job> addCandidatesByHumanReadableJobId(@RequestBody CandidateRankJobAddRequestDTO candidateRankJobAddRequestDTO) {
        Optional<Job> job =  jobService.addCandidatesToJob(candidateRankJobAddRequestDTO.getCandidateRankList(), candidateRankJobAddRequestDTO.getHumanReadableJobId());
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/nextPhase/phase1Dummy")
    public ResponseEntity<List<Map<String, Object>>>  phase1Handle() {
        // List to store the candidates
        List<Map<String, Object>> candidates = new ArrayList<>();

        // Candidate 1
        Map<String, Object> candidate1 = new HashMap<>();
        candidate1.put("score", 99);
        candidate1.put("email", "siddanth.manoj@gmail.com");
        candidate1.put("summary", "Experienced software developer with expertise in Java.");

        // Candidate 2
        Map<String, Object> candidate2 = new HashMap<>();
        candidate2.put("score", 93);
        candidate2.put("email", "krishmanghani@gmail.com");
        candidate2.put("summary", "Skilled in front-end development with React and JavaScript. Great Work experience");

        // Candidate 3
        Map<String, Object> candidate3 = new HashMap<>();
        candidate3.put("score", 95);
        candidate3.put("email", "sawant.tanishqa@gmail.com");
        candidate3.put("summary", "Data scientist with a strong background in machine learning. Over 15 Years of Experience");

        // Adding candidates to the list
        candidates.add(candidate1);
        candidates.add(candidate2);
        candidates.add(candidate3);

        // Return the list of candidates, which will be automatically converted to JSON
        return ResponseEntity.ok(candidates);
    }

    @PostMapping("/rich/update-answers")
    public ResponseEntity<String> richUpdateAnswers(
            @RequestBody Map<String, Object> requestPayload) {

        // Extract values from the request payload
        String email = (String) requestPayload.get("name");
        Map<String, String> questions = (Map<String, String>) requestPayload.get("questions");
        Map<String, String> answers = (Map<String, String>) requestPayload.get("answers");
        String jobId = (String) requestPayload.get("jobId");

        // Call the service method to update or create the OralTestResult
        String resultMessage = jobService.updateOrCreateOralTestResult(email, questions, answers, jobId);

        // Return the appropriate response
        if ("Job not found".equals(resultMessage)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resultMessage);
        } else {
            return ResponseEntity.ok(resultMessage);
        }
    }

    public ResponseEntity<String> addCandidateReport(@RequestBody Map<String, Object> requestPayload) {
        String email = (String) requestPayload.get("email");
        String jobId = (String) requestPayload.get("jobId");
        int techKnowledge = (int) requestPayload.get("techKnowledge");
        int communication = (int) requestPayload.get("communication");
        int problemSolving = (int) requestPayload.get("problemSolving");;
        String comments = (String) requestPayload.get("comments");

        String resultMessage  = jobService.updateCandidateReportByEngineer(email, jobId, techKnowledge, communication, problemSolving, comments);

        if ("Job not found".equals(resultMessage)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resultMessage);
        } else {
            return ResponseEntity.ok(resultMessage);
        }
    }


    @PostMapping("/closeJob")
    public ResponseEntity<String> closeJob(@RequestBody String jobId) {
        String response = jobService.closeJobByHumanReadableId(jobId);
        if (response.equals("Y")) {
            return ResponseEntity.status(HttpStatus.OK).body("Job has been closed");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job does not exist");
        }
    }
 }

