import { AlertColor } from "@mui/material"

export const handleMessage = (res: string): {responseMessage: string, severityStatus: AlertColor} => {
    switch(res){ 
        case 'warning/has-action-in-progress':
            return{
                responseMessage: 'Aguarde a ultima ação ser finalizada.',
                severityStatus: 'warning'
            }
        case 'warning/equipament-not-found':
            return{
                responseMessage: 'ONU não encontrada, tente novamente.',
                severityStatus: 'warning'
            }
        case 'error/connection-issue':
            return{
                responseMessage: 'Não foi possível acessar a OLT.',
                severityStatus: 'error'
            }
        case 'error/internal-issue':
            return{
                responseMessage: 'Erro interno, verifique com o suporte.',
                severityStatus: 'error'
            }
        case 'success/write-data-complete':
            return{
                responseMessage: 'ONU Provisionada com sucesso.',
                severityStatus: 'success'
            }
        case 'info/non-expect-caracter-not-alphaNumeric':
            return{
                responseMessage: 'Digite apenas letras e/ou números.',
                severityStatus: 'info'
            }
        case 'info/non-expect-caracter-NAN':
            return{
                responseMessage: 'Digite apenas números no campo de contrato.',
                severityStatus: 'info'
            }
        case 'info/required-input':
            return{
                responseMessage: 'Preencha todos os campos.',
                severityStatus: 'info'
            }
        case 'ERR_NETWORK':
            return{
                responseMessage: 'Não foi possível se conectar ao serviço.',
                severityStatus: 'error'
            }
        case 'info/wifi-password-did-not-match':
            return{
                responseMessage: 'Senha inválida, clique na interrogação para saber mais.',
                severityStatus: 'info'
            }
        case 'info/wrong-type-passoword':
            return{
                responseMessage: 'A senha do wifi deve ter no minimo 8 caracteres.',
                severityStatus: 'info'
            }
        case 'info/wifi-ssid-did-not-match':
            return{
                responseMessage: 'Não são permitidos espaços no nome do wifi.',
                severityStatus: 'info'
            }
        case 'success/user-updated':
            return{
                responseMessage: 'Usuário atualizado com sucesso.',
                severityStatus: 'success'
            }
        case 'success/user-created':
            return{
                responseMessage: 'Usuário criado com sucesso.',
                severityStatus: 'success'
            }
        case 'error/already-exists-email':
            return{
                responseMessage: 'Este email já existe na base de dados.',
                severityStatus: 'error'
            }
        case 'error/user-desactivated':
            return{
                responseMessage: 'Seu usuário não tem permissão para acessar.',
                severityStatus: 'error'
            }
        case 'Invalid Token':
            return{
                responseMessage: 'Usuário não autenticado, você precisa fazer login novamente.',
                severityStatus: 'error'
            }
        case 'Invalid Secret':
            return{
                responseMessage: 'Erro interno, verifique com o suporte.',
                severityStatus: 'error'
            }
        case 'error/user-not-found':
            return{
                responseMessage: 'Usuário ou senha não conferem.',
                severityStatus: 'error'
            }
        case 'warning/invalid-cpf-input':
            return{
                responseMessage: 'CPF ou CNPJ inválidos.',
                severityStatus: 'warning'
            }
        case 'success/onu-delete-completed':
            return{
                responseMessage: 'ONU desprovisionada com sucesso.',
                severityStatus: 'success'
            }
        case 'error/no-connection-with-API':
            return{
                responseMessage: 'Erro ao conectar a API, verifique com o suporte.',
                severityStatus: 'error'
            }
        case 'error/expected-date':
            return{
                responseMessage: 'Você precisa informar a data nos filtros.',
                severityStatus: 'error'
            }
        case 'error/lastDate-isBefore-initialDate':
            return{
                responseMessage: 'A ultima data não pode ser antes da primeira.',
                severityStatus: 'error'
            }
        case 'error/initial-isAfter-lastDate':
            return{
                responseMessage: 'A primeira data não pode ser depois da ultima.',
                severityStatus: 'error'
            }
        case 'error/data-not-created':
            return{
                responseMessage: 'Não foi possivel salvar os dados.',
                severityStatus: 'error'
            }
        case 'error/invalid-input':
            return{
                responseMessage: 'Verifique os dados digitados e tente novamente.',
                severityStatus: 'error'
            }
        case 'success/data-created':
            return{
                responseMessage: 'Dados criados com sucesso.',
                severityStatus: 'success'
            }
        case 'success/data-updated':
            return{
                responseMessage: 'Dados atualizados com sucesso.',
                severityStatus: 'success'
            }
        case 'error/column-in-use':
            return{
                responseMessage: 'Algum usuário está fazendo esta pausa.',
                severityStatus: 'error'
            }
        case 'error/data-already-exist':
            return{
                responseMessage: 'Estes dados já existem.',
                severityStatus: 'error'
            }
        case 'error/Invalid-format-email':
            return{
                responseMessage: 'Formato de E-mail inválido.',
                severityStatus: 'warning'
            }
        case 'error/privilege-denied':
            return{
                responseMessage: 'Você não tem permissão para realizar está função.',
                severityStatus: 'error'
            }
        case 'error/email-mismatch':
            return{
                responseMessage: 'Os E-mails devem ser iguais.',
                severityStatus: 'info'
            }
        case 'error/missing-fields':
            return{
                responseMessage: 'Preencha todos os campos.',
                severityStatus: 'warning'
            }
        case 'error/incorrect-fields':
            return{
                responseMessage: 'Preencha corretamente os campos.',
                severityStatus: 'warning'
            }
        case 'info/ip-already-exists':
            return{
                responseMessage: 'Este IP já está em uso.',
                severityStatus: 'warning'
            }
        case 'info/massive-invalid-input':
            return{
                responseMessage: 'Preencha de forma correta os campos.',
                severityStatus: 'warning'
            }
        case 'success/appropriated-successful':
            return{
                responseMessage: 'Ticket Apropriado com sucesso.',
                severityStatus: 'success'
            }
        case 'success/appropriated-failed':
            return{
                responseMessage: 'Não foi possível se apropriar deste ticket.',
                severityStatus: 'error'
            }
        case 'success/wifi-updated':
            return{
                responseMessage: 'Wifi atualizado com sucesso.',
                severityStatus: 'success'
            }
        case 'error/cpe-not-found':
            return{
                responseMessage: 'Roteador não encontrado.',
                severityStatus: 'warning'
            }
        default:
            return{
                responseMessage: 'Erro interno, verifique com o suporte.',
                severityStatus: 'error'
            }
        }
    }
