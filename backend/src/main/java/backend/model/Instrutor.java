package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "instrutores")
@Data
public class Instrutor {

    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    private String statusValidacao; // ex: "PENDENTE", "APROVADO"

    // 🔥 NOVOS CAMPOS DAS TELAS DE CONFIGURAÇÃO:
    private Veiculo veiculo;
    private LocalAtendimento localAtendimento;
    private String bio; // Informações gerais da primeira tela
    private boolean receberNotificacoes; // Configurações do sistema
}