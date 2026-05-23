package backend.model;

import lombok.Data;

@Data
public class LocalAtendimento {
    private String titulo;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private Boolean favorito;
}