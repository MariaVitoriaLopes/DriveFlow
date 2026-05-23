package backend.model;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class Documento {
    private String nomeCompleto;
    private String numeroDocumento;
    private LocalDate dataEmissao;
    private LocalDate dataValidade;
    private List<String> categorias;
    private String fotoFrenteUrl;
    private String fotoVersoUrl;
    private String statusValidacao;
}