package backend.model;

import lombok.Data;

@Data
public class LocalAtendimento {
    private String cep;
    private String rua;
    private String numero;
    private String bairro;
    private String cidade;
}