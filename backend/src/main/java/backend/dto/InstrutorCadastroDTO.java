package backend.dto;

public record InstrutorCadastroDTO(

            String nome,
            String cpf,
            String email,
            String senha,
            String telefone,
            String regiao,
            Double precoAula,
            String num_credencial){

}
