package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@Document(collection = "documentos")
public class Documento {

    @Id
    private String id;

    @DBRef
    private Instrutor instrutor;

    private String tipoDocumento;
    private String urlArquivo;
    private LocalDateTime dataEnvio = LocalDateTime.now();
    private String statusValidacao = "PENDENTE";
}