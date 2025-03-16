package dev.sid.sidspringbackend.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import dev.sid.sidspringbackend.Model.Job;

import java.util.Optional;

@Repository
public interface JobRepository extends MongoRepository<Job, String > {
    Optional<Job> findByHumanReadableJobId(String humanReadableJobId);
}
