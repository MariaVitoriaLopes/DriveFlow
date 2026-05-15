package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "aulas")
public class Aula {

    @Id
    private String id;

    @DBRef
    private Aluno aluno;

    @DBRef
    private Instrutor instrutor;

    private LocalDate dataAula;
    private LocalTime horario;
    private String localEncontro;
    private String status = "AGENDADA";
}