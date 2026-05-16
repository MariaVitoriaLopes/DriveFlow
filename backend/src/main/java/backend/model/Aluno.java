package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@Document(collection = "alunos")
public class Aluno {

    @Id
    private String id;

    @DBRef // Cria a referência para o documento do Usuario
    private Usuario usuario;
    private String cidade;
    private String telefone;
}