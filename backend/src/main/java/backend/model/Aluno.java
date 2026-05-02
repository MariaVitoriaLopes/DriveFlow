package backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "alunos")
@Data
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAluno;

    // Relacionamento 1:1 com a tabela de usuários para pegar nome, email, cpf, etc.
    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true, nullable = false)
    private Usuario usuario;

    private String cidade;

    // Conforme o seu modelo, o aluno pode ter um telefone específico ou usar o do usuário
    private String telefone;
}