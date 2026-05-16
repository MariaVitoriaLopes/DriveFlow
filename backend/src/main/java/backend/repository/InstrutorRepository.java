package backend.repository;

import backend.model.Instrutor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstrutorRepository extends MongoRepository<Instrutor, String> {
    boolean existsByNumCredencial(String numCredencial);
}