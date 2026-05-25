package backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DisponibilidadeDiaResponseDTO {
    private LocalDate data;
    private Integer duracaoAula;
    private Integer intervaloAula;
    private Integer toleranciaAtraso;
    private List<HorarioSlotDTO> horarios;
}