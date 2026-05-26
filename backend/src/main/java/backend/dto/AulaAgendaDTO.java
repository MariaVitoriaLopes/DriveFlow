package backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AulaAgendaDTO {
    private String id;

    private String instrutorId;
    private String instrutorNome;
    private String instrutorFotoUrl;

    private String alunoId;
    private String alunoNome;
    private String alunoFotoUrl;

    private LocalDate data;
    private String horarioInicio;
    private String horarioFim;
    private Integer quantidadeAulas;

    private String localEncontro;
    private String veiculoId;
    private String status;
}