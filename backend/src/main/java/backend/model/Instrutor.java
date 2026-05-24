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



    private List<Veiculo> veiculos = new java.util.ArrayList<>();
    private List<LocalAtendimento> locaisAtendimento = new java.util.ArrayList<>();
    private String bio;
    private boolean receberNotificacoes;
    private List<DispoSemanal> disponibilidade; // Para salvar a grade de horários dele
    private Documento cnh;
    private Documento credencialInstrutor;
}