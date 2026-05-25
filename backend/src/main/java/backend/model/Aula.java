package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "aulas")
@Data
public class Aula {
    @Id
    private String id;
    private String instrutorId;
    private String alunoId;

    private LocalDate data;
    private String horarioInicio; // HH:mm
    private String horarioFim;    // HH:mm

    private Integer quantidadeAulas;  // 1 ou 2
    private Integer duracaoAula;      // 45, 50, 55, 60
    private Integer intervaloAula;    // 5, 10, 15, 20, 25, 30
    private Integer toleranciaAtraso;

    private Double valorAula;
    private Double taxa;             // Taxa da plataforma/sistema se houver, ou 0.0
    private Double total;            // (valorAula * quantidadeAulas) + taxa

    private String localEncontro;
    private String veiculoId;

    private String status;           // AGENDADA, CANCELADA, CONCLUIDA
}