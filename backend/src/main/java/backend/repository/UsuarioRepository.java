package backend.repository;



import backend.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {


    boolean existsByEmail(String email);


    boolean existsByCpf(String cpf);


    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}