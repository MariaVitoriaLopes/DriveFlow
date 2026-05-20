package backend.repository;

import backend.model.Aluno;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AlunoRepository extends MongoRepository<Aluno, String> {
    // Busca um aluno baseado no ID do Usuário vinculado
    Optional<Aluno> findByUsuarioId(String usuarioId);
}