package backend.repository;

import backend.model.Aula;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface AulaRepository extends MongoRepository<Aula, String> {
    // Usado pela listagem antiga da agenda do instrutor
    List<Aula> findByInstrutorIdAndData(String instrutorId, LocalDate data);

    // Usado pelo novo validador de conflito de horários do aluno
    List<Aula> findByInstrutorIdAndDataAndStatus(String instrutorId, LocalDate data, String status);

    List<Aula> findByAlunoId(String alunoId);

    List<Aula> findByInstrutorId(String instrutorId);
}