package backend.model;

import lombok.Data;
import java.util.UUID;

@Data
public class Veiculo {
    private String id = UUID.randomUUID().toString(); // Gera um ID único automático para gerenciar a lista
    private String marca;
    private String modelo;
    private String placa;
    private String ano;
    private String cor;
    private String cambio;
    private String categoria;
    private String fotoUrl;
    private boolean principal; // Checkbox "Definir como carro para as aulas"
}