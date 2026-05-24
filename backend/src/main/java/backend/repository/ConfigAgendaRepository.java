package backend.repository;

import backend.model.ConfigAgenda;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface ConfigAgendaRepository extends MongoRepository<ConfigAgenda, String> {
    Optional<ConfigAgenda> findByUsuarioId(String usuarioId);
}