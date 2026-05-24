package backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class InstrutorCardDTO {
    private String instrutorId;
    private String nome;
    private String fotoPerfilUrl;
    private List<String> fotosVeiculo;
    private String fotoPrincipalVeiculo;
    private String categoriaVeiculo;
    private String bairroCidade;
    private double valorAula;
}