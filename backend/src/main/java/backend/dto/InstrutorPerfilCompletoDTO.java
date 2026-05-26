package backend.dto;

import backend.model.DispoSemanal;
import lombok.Data;
import java.util.List;

@Data
public class InstrutorPerfilCompletoDTO {

    private String usuarioId;
    private String instrutorId;
    private String nome;
    private String bio;
    private String fotoPerfilUrl;
    private String localEncontro;

    // Dados do Veículo Principal
    private String veiculoId;
    private String marca;
    private String modelo;
    private String cor;
    private String ano;
    private String placa;
    private String cambio;
    private String categoriaVeiculo;
    private List<String> fotosVeiculo;

    // Configurações de Agenda Financeira
    private Double valorAula;
    private Integer duracaoAula;
    private Integer intervaloAula;
    private Integer toleranciaAtraso;
}