package dev.sid.sidspringbackend.Controller;

import dev.sid.sidspringbackend.Model.Mail;
import dev.sid.sidspringbackend.Service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class MailController {
    // Fix Autowiring issue, convert to constructor
    @Autowired
    private RedisTemplate<String, byte[]> redisTemplate;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }
    public MailService mailService;


    @GetMapping
    public ResponseEntity<List<Mail>> getAllMails() {
        return new ResponseEntity<List<Mail>>(mailService.allMails(),HttpStatus.OK);
    }

    @PostMapping("/update-answers")
    public ResponseEntity<String> updateAnswers(
            @RequestBody Map<String, Object> requestPayload) {

        // Extract values from the request payload
        String email = (String) requestPayload.get("name"); // Assuming 'name' is the email
        Map<String, String> questions = (Map<String, String>) requestPayload.get("questions");
        Map<String, String> answers = (Map<String, String>) requestPayload.get("answers");

        // Call the service to update the mail document with the questions and answers
        boolean isUpdated = mailService.updateMailWithAnswers(email, questions, answers);

        if (isUpdated) {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("Mail updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No mail found for the given email.");
        }
    }

    @GetMapping("/getInfoWithoutResumePDF")
    public List<Mail> getInfoWithoutResumePDF() {
        return mailService.getMailwithoutPDF();
    }

    /** VERY, VERY IMPORTANT, USE THIS TO FETCH RESUME IN CASE REDIS STOPS WORKING
     FALL BACK **/
//    @GetMapping("/getPDF/{email_address}")
//    public ResponseEntity<byte[]> getResume(@PathVariable String email_address) {
//        System.out.println("Resume Accessed for "+email_address);
//        byte[] resumePdf = mailService.findResumeBasedOnCandidateEmail(email_address);
//        return ResponseEntity.ok()
//                .header("Content-Type", "application/pdf")
//                .header("Content-Disposition", "attachment; filename=\"" + email_address + "_resume.pdf\"")
//                .body(resumePdf);
//    }

    @GetMapping("/getPDF/{email_address}")
    public ResponseEntity<byte[]> getResume(@PathVariable String email_address) {
        String redisKey = "resume:" + email_address;

        // Try to get PDF from Redis
        byte[] cachedPdf = redisTemplate.opsForValue().get(redisKey);

        if (cachedPdf != null) {
            System.out.println("Resume accessed from cache for " + email_address);
            return createPdfResponse(email_address, cachedPdf);
        }

        // If not in cache, get from database
        System.out.println("Resume accessed from database for " + email_address);
        byte[] resumePdf = mailService.findResumeBasedOnCandidateEmail(email_address);

        // Cache the PDF with 30 minutes expiration
        redisTemplate.opsForValue().set(redisKey, resumePdf, Duration.ofMinutes(30));

        return createPdfResponse(email_address, resumePdf);
    }

    private ResponseEntity<byte[]> createPdfResponse(String email_address, byte[] pdf) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + email_address + "_resume.pdf\"")
                .body(pdf);
    }

//    @PostMapping("/sendEmails")
}
