# Configuração do EmailJS para Envio Direto de Emails

## Passos para Configurar

### 1. Criar Conta no EmailJS
- Acesse: https://www.emailjs.com/
- Clique em "Sign Up" e crie uma conta gratuita
- A conta gratuita permite até 200 emails/mês

### 2. Adicionar Serviço de Email
- No dashboard, vá em "Email Services"
- Clique em "Add New Service"
- Escolha o provedor (recomendado: **Gmail** ou **Outlook/Office365**)
- Conecte sua conta glauberbarcelos@outlook.com
- Anote o **Service ID** gerado

### 3. Criar Template de Email
- Vá em "Email Templates"
- Clique em "Create New Template"
- Use este template:

```
Assunto: {{subject}} - Novo contato do portfólio

De: {{from_name}} ({{from_email}})

Mensagem:
{{message}}

---
Este email foi enviado através do formulário de contato do seu portfólio.
```

- Salve e anote o **Template ID**

### 4. Obter Public Key
- Vá em "Account" > "General"
- Copie o **Public Key** (também chamado de User ID)

### 5. Configurar no Código
Abra o arquivo `js/main.js` e substitua as credenciais:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'SUA_PUBLIC_KEY_AQUI',     // Cole aqui o Public Key
    serviceId: 'SEU_SERVICE_ID_AQUI',      // Cole aqui o Service ID
    templateId: 'SEU_TEMPLATE_ID_AQUI'     // Cole aqui o Template ID
};
```

### 6. Testar
1. Salve todas as alterações
2. Abra o portfólio no navegador
3. Preencha o formulário de contato
4. Clique em "Enviar Mensagem"
5. Verifique se recebeu o email em glauberbarcelos@outlook.com

## Observações Importantes

- ✅ **Gratuito**: Até 200 emails/mês
- ✅ **Seguro**: Suas credenciais ficam no EmailJS, não expostas no código
- ✅ **Confiável**: Serviço usado por milhares de sites
- ✅ **Fácil**: Configuração em menos de 10 minutos

## Fallback
Se o EmailJS não estiver configurado, o formulário automaticamente abre o cliente de email do usuário como fallback.

## Suporte
- Documentação: https://www.emailjs.com/docs/
- Tutoriais: https://www.emailjs.com/docs/examples/
