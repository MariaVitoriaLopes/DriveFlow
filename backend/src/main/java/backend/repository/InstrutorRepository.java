package backend.repository;

import backend.model.Instrutor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface InstrutorRepository extends MongoRepository<Instrutor, String> {
    // Busca um instrutor baseado no ID do Usuário vinculado
    Optional<Instrutor> findByUsuarioId(String usuarioId);
}