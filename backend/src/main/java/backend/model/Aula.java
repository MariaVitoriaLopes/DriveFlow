package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "aulas")
@Data
public class Aula {

    @Id
    private String id;

    @DBRef
    private Instrutor instrutor;

    @DBRef
    private Aluno aluno;

    private LocalDate data;
    private String horario;
    private String status;
    private String localEncontro;
}