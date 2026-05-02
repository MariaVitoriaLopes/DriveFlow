package backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "instrutores")
@Data
public class Instrutor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInstrutor;

    @OneToOne
    @JoinColumn(name = "id_usuario", unique = true, nullable = false)
    private Usuario usuario;

    private String regiao;

    @Column(name = "preco_aula")
    private Double precoAula;

    @Column(name = "status_validacao")
    private String statusValidacao = "PENDENTE";
}