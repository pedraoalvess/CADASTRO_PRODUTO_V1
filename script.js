//
//FASE 1: modelagem dos dados (Classe Base)
//
//A classe funciona como um molde para criar
class Produto {
    constructor(nome, preco, quantidade) {
        //validações (Desafio 1: Blindagem de Dados)
        if (!nome || nome.trim() === "") {
            throw new Error("O nome do produto não pode estar em branco.");
        }
        if (preco <= 0) {
            throw new Error("O preço deve ser maior que zero.");
        }
        if (quantidade <= 0) {
            throw new Error("A quantidade deve ser maior que zero.");
        }

        //propriedades do objeto recebidas no molde
        this.nome = nome;
        //atributos privados (encapsulamento)
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    //atributos privados
    #preco;
    #quantidade;

    //getters para permitir a leitura fora da classe
    get preco() {
        return this.#preco;
    }
    get quantidade() {
        return this.#quantidade;
    }

    //método que calcula o subtotal
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}
//
//FASE 2: Gerenciamento de Estado (memória)
//
//Array global que guardará todas as instâncias da classe Produto
const listaDeProdutos = [];
//
//FASE 3: Escuta de Eventos do DOM
//
//Selecionamos o formulário pelo ID
const formProduto = document.getElementById("produto-form");
//Adicionar um escutador de eventos para quando o formulário for enviado
formProduto.addEventListener("submit", function (event) {
    event.preventDefault();
    //1. Captura dos valores digitados nos campos de input
    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    //2. Criar uma nova instância da classe, protegendo contra dados inválidos
    try {
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);
        //3. Adiciona um novo produto ao Array
        listaDeProdutos.push(novoProduto);
        //4. Atualiza a exibição da tabela e limpa o formulário
        renderizarTabela();
        formProduto.reset();
    } catch (erro) {
        alert(erro.message);
    }
});

//FASE 4: Renderização da Interface DOM
//
//função responsável por desenhar na tela
//atual do Array listaDeProdutos
function renderizarTabela() {
    //seleciona o corpo da tabela (tbody)
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    //limpa o conteúdo anterior da tabela
    tabelaBody.innerHTML = "";
    //percorre o array de produtos usando forEach
    listaDeProdutos.forEach((produto, index) => {
        //criar uma linha tr dentro da tabela
        const linha = document.createElement("tr");
        //preenche o conteúdo da linha com os dados do objeto
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" data-index="${index}">Remover</button>
            </td>
        `;
        //insere a linha criada dentro do tbody da tabela
        tabelaBody.appendChild(linha);
    });

    //atualiza o indicador financeiro sempre que a tabela é redesenhada
    atualizarTotalEstoque();
}

//
//FASE 5: Indicadores Financeiros (Desafio 2)
//
//soma o subtotal de todos os produtos usando reduce()
//e atualiza o texto do elemento h3#total-estoque
function atualizarTotalEstoque() {
    const totalGeral = listaDeProdutos.reduce((acumulador, produto) => {
        return acumulador + produto.calcularSubtotal();
    }, 0);

    const elementoTotal = document.getElementById("total-estoque");
    //formata o valor em moeda brasileira (R$ XX,XX)
    const totalFormatado = totalGeral.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    elementoTotal.textContent = `Total em Estoque: R$${totalFormatado}`;
}

//
//FASE 6: Gestão Dinâmica (Desafio 3)
//
//remove um produto do array pela posição (index) e re-renderiza a tabela
function removerProduto(index) {
    listaDeProdutos.splice(index, 1);
    renderizarTabela();
}

//delega o clique dos botões "Remover" de cada linha para a função removerProduto
const tabelaBody = document.querySelector("#tabela-produtos tbody");
tabelaBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-remover")) {
        const index = parseInt(event.target.dataset.index);
        removerProduto(index);
    }
});

//botão "Limpar" esvazia todo o array e atualiza a tela
const botaoLimparTabela = document.getElementById("limpar-tabela");
botaoLimparTabela.addEventListener("click", function () {
    listaDeProdutos.length = 0;
    renderizarTabela();
});

//inicializa o total em estoque ao carregar a página
atualizarTotalEstoque();