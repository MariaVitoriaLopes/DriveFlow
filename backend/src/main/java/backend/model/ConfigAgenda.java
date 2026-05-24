package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "config_agendas")
@Data
public class ConfigAgenda {
    @Id
    private String id;
    private String usuarioId;
    private int duracaoAula;
    private double valorAula;
    private int intervaloAula;
    private int toleranciaEspera;
    private List<DispoSemanal> disponibilidades;
}