package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "alunos")
@Data                   // 🔥 Lombok: Gera Getters, Setters, toString, etc.
@NoArgsConstructor      // 🔥 Lombok: Gera o construtor vazio essencial para o Spring Data
@AllArgsConstructor     // 🔥 Lombok: Gera o construtor completo
public class Aluno {

    @Id
    private String id;

    @DBRef // 🔥 Cria o vínculo de referência com a coleção de usuários
    private Usuario usuario;

    // Se no futuro precisar de campos específicos do aluno (ex: "horasPraticadas", "statusTeorico"), eles entram aqui:
    // private Integer aulasConcluidas = 0;
}