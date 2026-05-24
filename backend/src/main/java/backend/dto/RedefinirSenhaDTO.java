package backend.dto;

import lombok.Data;

@Data
public class RedefinirSenhaDTO {
    private String senhaAntiga;
    private String senhaNova;
}