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

    @Column(name = "num_credencial")
    private String numCredencial;

    public Long getIdInstrutor() {
        return idInstrutor;
    }

    public void setIdInstrutor(Long idInstrutor) {
        this.idInstrutor = idInstrutor;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public Double getPrecoAula() {
        return precoAula;
    }

    public void setPrecoAula(Double precoAula) {
        this.precoAula = precoAula;
    }

    public String getStatusValidacao() {
        return statusValidacao;
    }

    public void setStatusValidacao(String statusValidacao) {
        this.statusValidacao = statusValidacao;
    }

    public String getNumCredencial() {
        return numCredencial;
    }

    public void setNumCredencial(String numCredencial) {
        this.numCredencial = numCredencial;
    }



}