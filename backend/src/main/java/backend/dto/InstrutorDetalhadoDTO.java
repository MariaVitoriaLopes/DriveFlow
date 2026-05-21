package backend.dto;

import backend.model.Aula;
import backend.model.Documento;
import backend.model.LocalAtendimento;
import backend.model.Veiculo;
import backend.model.Usuario;
import java.util.List;

public class InstrutorDetalhadoDTO {

    private String id;
    private Usuario usuario;
    private LocalAtendimento localAtendimento;
    private Veiculo veiculo;
    private String bio;
    private boolean receberNotificacoes;
    private List<Aula> aulas;
    private List<Documento> documentos;

    // Calculado: nota média das aulas ou avaliações (exemplo)
    private double notaMedia;

    // getters e setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalAtendimento getLocalAtendimento() { return localAtendimento; }
    public void setLocalAtendimento(LocalAtendimento localAtendimento) { this.localAtendimento = localAtendimento; }

    public Veiculo getVeiculo() { return veiculo; }
    public void setVeiculo(Veiculo veiculo) { this.veiculo = veiculo; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public boolean isReceberNotificacoes() { return receberNotificacoes; }
    public void setReceberNotificacoes(boolean receberNotificacoes) { this.receberNotificacoes = receberNotificacoes; }

    public List<Aula> getAulas() { return aulas; }
    public void setAulas(List<Aula> aulas) { this.aulas = aulas; }

    public List<Documento> getDocumentos() { return documentos; }
    public void setDocumentos(List<Documento> documentos) { this.documentos = documentos; }

    public double getNotaMedia() { return notaMedia; }
    public void setNotaMedia(double notaMedia) { this.notaMedia = notaMedia; }
}