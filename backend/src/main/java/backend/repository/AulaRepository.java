package backend.repository;

import backend.model.Aula;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AulaRepository extends MongoRepository<Aula, String> {
    List<Aula> findByInstrutorId(String instrutorId);

    List<Aula> findByAlunoId(String alunoId);
}