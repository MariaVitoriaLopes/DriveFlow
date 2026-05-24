package backend.model;

import lombok.Data;

@Data
public class DispoSemanal {

    private String diaSemana;
    private String horaInicio;
    private String horaFim;
    private boolean bloqueado;

}