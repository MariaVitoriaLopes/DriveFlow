package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "instrutores")
@Data
public class Instrutor {

    @Id
    private String id;

    @DBRef
    private Usuario usuario;

    private String statusValidacao; // ex: "PENDENTE", "APROVADO"

    // 🔥 NOVOS CAMPOS DAS TELAS DE CONFIGURAÇÃO:
    private List<Veiculo> veiculos;
    private List<LocalAtendimento> locaisAtendimento;
    private String bio; // Informações gerais da primeira tela
    private boolean receberNotificacoes; // Configurações do sistema
}