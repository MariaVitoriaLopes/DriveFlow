package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "aulas")
@Data                   // 🔥 Lombok: Cria getters, setters, toString, equals e hashCode
@NoArgsConstructor      // 🔥 Lombok: Cria o construtor vazio obrigatório para o Spring Data
@AllArgsConstructor     // 🔥 Lombok: Cria o construtor com todos os parâmetros
public class Aula {

    @Id
    private String id;

    private LocalDateTime dataHora; // Guarda a data e hora do agendamento

    @DBRef // 🔥 Faz referência ao documento do Instrutor na coleção 'instrutores'
    private Instrutor instrutor;

    @DBRef // 🔥 Como você optou por coleções separadas, faz referência ao Usuário base ou Aluno
    private Usuario aluno;

    private String Status;
}