package backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios")
@Data
public class Usuario {
    @Id
    private String id;
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String perfil; // ALUNO ou INSTRUTOR

    //Novos campos para guardar o endereço em Informações Pessoais
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
}