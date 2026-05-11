package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "usuarios") // Isso substitui o @Entity e @Table
public class Usuario {

    @Id
    private String id;

    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String perfil;
    private LocalDateTime dataCadastro = LocalDateTime.now();
}