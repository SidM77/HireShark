package dev.sid.sidspringbackend.Controller;

import dev.sid.sidspringbackend.DTOs.CandidateRankJobAddRequestDTO;
import dev.sid.sidspringbackend.Model.Job;
import dev.sid.sidspringbackend.Service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
}

