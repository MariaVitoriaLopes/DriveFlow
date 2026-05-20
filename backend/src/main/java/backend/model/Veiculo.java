package backend.model;

import lombok.Data;

@Data
public class Veiculo {
    private String marca;
    private String modelo;
    private String placa;
    private String ano;
    private String fotoUrl; }