package backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
@Data                   // 🔥 Gera Getters, Setters, toString, equals e hashCode automaticamente
@NoArgsConstructor      // 🔥 Construtor padrão sem argumentos (exigido pelo Spring Data)
@AllArgsConstructor     // 🔥 Construtor com todos os campos
public class Usuario {

    @Id
    private String id;
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String perfil; // Receberá estritamente "ALUNO" ou "INSTRUTOR" vindo do Angular
}