package dev.sid.sidspringbackend.Controller;

import dev.sid.sidspringbackend.Model.Mail;
import dev.sid.sidspringbackend.Service.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class MailController {

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
}
