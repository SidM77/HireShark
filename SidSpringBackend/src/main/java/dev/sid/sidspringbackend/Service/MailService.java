package dev.sid.sidspringbackend.Service;

import dev.sid.sidspringbackend.Model.Mail;
import dev.sid.sidspringbackend.Repository.MailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MailService {

    @Autowired
    private MongoTemplate mongoTemplate;

    public MailService(MailRepository mailRepository) {
        this.mailRepository = mailRepository;
    }

    public MailRepository mailRepository;



    public List<Mail> allMails() {
        return mailRepository.findAll();
    }

    public boolean updateMailWithAnswers(String email, Map<String, String> questions, Map<String, String> answers) {
        // Find the Mail by sender_email using the repository method
        Optional<Mail> optionalMail = mailRepository.findMailBySenderEmail(email);

        if (optionalMail.isPresent()) {
            Mail mail = optionalMail.get();

            // Update the questions and answers in the existing Mail document
            mail.setQuestions(questions);
            mail.setAnswers(answers);

            // Save the updated mail document back to MongoDB
            mailRepository.save(mail);
            return true;
        } else {
            return false;
        }
    }


    public List<Mail> getMailwithoutPDF() {
        Query query = new Query();
        query.fields()
                .exclude("pdfFile");

        return mongoTemplate.find(query, Mail.class);
    }

    public byte[] findResumeBasedOnCandidateEmail(String emailId) {
        Optional<Mail> currentMail = mailRepository.findMailBySenderEmail(emailId);
        // yea I know that it may be null cuz duh it's optional, but the frontend is such that it'll only look for stuff that's already there
        //Basically, don't worry
        return  currentMail.get().getPdfFile();
    }
}
