package backend.model;

import lombok.Data;
import java.util.UUID;

@Data
public class LocalAtendimento {
    private String id = UUID.randomUUID().toString();
    private String cep;
    private String logradouro; // Ajustado para bater com o input "Logradouro" do  Figma
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf; // Unidade Federativa
    private boolean favorito; // O checkbox "Definir como meu favorito"
}