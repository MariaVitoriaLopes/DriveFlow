package backend.model;

import lombok.Data;
import java.util.List;

@Data
public class Veiculo {
    private String marca;
    private String modelo;
    private String placa;
    private String ano;

    private String versao;
    private String cor;
    private String cambio;
    private String categoria;
    private List<String> recursos;
    private String infoExtra;
    private Boolean padrao;

    private String fotoUrl;
    private List<String> fotoUrls;
}