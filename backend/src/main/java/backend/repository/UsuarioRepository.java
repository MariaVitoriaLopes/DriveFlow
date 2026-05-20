package backend.repository;

import backend.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    // Busca o usuário pelo e-mail para validar as credenciais no login
    Optional<Usuario> findByEmail(String email);
}