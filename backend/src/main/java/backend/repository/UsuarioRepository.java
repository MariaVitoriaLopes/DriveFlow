package backend.repository;



import backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {


    boolean existsByEmail(String email);


    boolean existsByCpf(String cpf);


    Optional<Usuario> findByEmailAndSenha(String email, String senha);
}