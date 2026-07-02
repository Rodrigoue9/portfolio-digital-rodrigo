# Portfólio Digital Premium - Rodrigo Flávio

Este projeto é uma versão digital e interativa do currículo de Rodrigo Flávio, projetada com uma estética futurista, motion design, animações dinâmicas e interações em 3D.

## 🚀 Tecnologias Utilizadas

- **HTML5 Semântico**: Estrutura robusta e otimizada para SEO.
- **Vanilla CSS3**: Design responsivo com efeitos de Glassmorphism, temas claro/escuro e micro-animações personalizadas.
- **Three.js**: Fundo interativo tridimensional com sistema de partículas que reage ao movimento do cursor.
- **GSAP (GreenSock Animation Platform) & ScrollTrigger**: Efeitos de rolagem suaves, revelação gradual de elementos, barras de progresso animadas e contadores numéricos.
- **JavaScript Puro (ES6)**: Lógica de cursor personalizado com lag físico, controle de tema e navegação responsiva.
- **Node.js**: Servidor estático leve integrado para execução local.

## 📂 Estrutura do Projeto

```text
├── Curriculo 2025.pdf    # Currículo original em formato PDF
├── rodrigo.png           # Foto de perfil recortada do PDF
├── index.html            # Estrutura principal do site
├── style.css             # Folha de estilos e variáveis de tema
├── main.js               # Lógica interativa, Three.js e animações GSAP
├── server.js             # Servidor web local em Node.js (sem dependências)
├── package.json          # Script de inicialização e metadados
└── README.md             # Documentação do projeto
```

## 💻 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passos para Rodar
1. Abra o terminal na pasta do projeto.
2. Execute o comando:
   ```bash
   npm start
   ```
   *Ou caso prefira usar o script de desenvolvimento:*
   ```bash
   npm run dev
   ```
3. O servidor iniciará automaticamente e tentará usar a porta `3000`. Caso esteja ocupada, ele tentará portas subsequentes (ex: `3001`).
4. Abra o navegador e acesse a URL exibida no terminal (geralmente `http://localhost:3000` ou `http://localhost:3001`).

## ✨ Destaques do Layout

- **Efeito 3D Parallax**: O cartão de código no topo e a foto de perfil inclinam-se de acordo com a posição do mouse.
- **Cursor Dinâmico**: Um círculo luminoso acompanha o ponteiro do mouse, expandindo-se ao pairar sobre elementos clicáveis.
- **Estilo Glassmorphism**: Cartões semitransparentes com desfoque de fundo e bordas luminosas dão uma aparência ultra-premium de sistema operacional futurista.
- **Efeitos de Scroll**: A linha central da trajetória acadêmica e profissional cresce de forma dinâmica conforme você rola a página.
- **Formulário de Contato Inteligente**: Integração estética pronta para envio de e-mails ou orçamentos.
