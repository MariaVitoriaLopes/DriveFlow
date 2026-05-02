package backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "documentos")
@Data
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDocumento;

    @ManyToOne
    @JoinColumn(name = "id_instrutor", nullable = false)
    private Instrutor instrutor;

    private String tipoDocumento; // Ex: "CNH", "CERTIFICADO_DETRAN"
    private String urlArquivo;

    private LocalDateTime dataEnvio = LocalDateTime.now();
    private String statusValidacao = "PENDENTE";
}