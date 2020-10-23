export default{
    api:{
        url_endpoint: 'http://localhost:3000/api/students'
    },

    regex: {
        EMAIL: [ v => !!v || 'E-mail não pode ser vazio', v => /.+@.+\..+/.test(v) || 'Digite um e-mail válido'],
        NAME: [v => !!v || 'Nome não pode ser vazio'],
        RA: [v=>(v && v.length <= 6) || 'RA deve ter 6 dígitos', v=> /[0-9]/g.test(v) || 'O registro acadêmico deve ser apenas dígitos'],
        CPF: [v => !!v || 'O número do documento não pode ser vazio', v=> /[0-9]/g.test(v) || 'O número do documento deve ser apenas dígitos', v => (v && v.length == 11) || 'O documento deve conter 11 dígitos']
      }
}