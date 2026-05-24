package backend.repository;

import backend.model.Instrutor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface InstrutorRepository extends MongoRepository<Instrutor, String> {
    // Busca automática cruzando a referência do usuário
    Optional<Instrutor> findByUsuarioId(String usuarioId);
}