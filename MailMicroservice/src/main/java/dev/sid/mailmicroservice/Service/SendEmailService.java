package dev.sid.mailmicroservice.Service;

import jakarta.activation.FileDataSource;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class SendEmailService {

    public SendEmailService (JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }
    public JavaMailSender javaMailSender;

    @Value("$(hireshark.no-reply)")
    private String fromEmailId;

    public void sendEmail(String recipient, String body, String subject) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmailId);
        mailMessage.setTo(recipient);
        mailMessage.setText(body);
        mailMessage.setSubject(subject);

        javaMailSender.send(mailMessage);
        System.out.println("Email has been sent to "+ recipient);
    }

    public void sendOfferMail(String recipient, String jobTitle, String subject) {
        try {
            String body = "Dear Candidate, \n";
            // Create a MimeMessage for the email
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            // Use MimeMessageHelper to easily add text, images, etc.
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // true for multipart

            // Set the basic properties
            helper.setFrom(fromEmailId);
            helper.setTo(recipient);
            helper.setSubject(subject);

            // Create the email body with the dynamic job title
            String messageText = "We're happy to extend you an offer as " + jobTitle + " at HireShark. "
                    + "We are looking forward to having you on board! <br><br>";

            // Add an HTML tag for the inline image reference
            String greeting = "Dear Candidate, \n\n";
            String htmlContent = "<img src='cid:congrats_image' alt='Congratulations Image'/>" +
                    "<br><br>" +
                    greeting +
                    messageText;
            helper.setText(htmlContent, true);

            // Attach an image (e.g., a congratulations image)
            File imageFile = new File("C:/Users/sidda/Desktop/Projects/BE_Project/MailMicroservice/src/main/java/dev/sid/mailmicroservice/Service/NewFinal.png");
            if (imageFile.exists()) {
                System.out.println("Meow");
                helper.addInline("congrats_image", new FileDataSource(imageFile));
            }

            // Send the email
            javaMailSender.send(mimeMessage);
            System.out.println("Email has been sent to " + recipient);

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error while sending email: " + e.getMessage());
        }
    }
}
