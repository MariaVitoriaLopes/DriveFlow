package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
@Document(collection = "instrutores")
public class Instrutor {

    @Id
    private String id;


    @DBRef
    private Usuario usuario;

    private String regiao;

    private Double precoAula;

    private String statusValidacao = "PENDENTE";

    private String numCredencial;


}