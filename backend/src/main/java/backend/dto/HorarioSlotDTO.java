package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HorarioSlotDTO {
    private String inicio;
    private String fimUmaAula;
    private String fimDuasAulas;
    private boolean podeUmaAula;
    private boolean podeDuasAulas;
}