const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const dataS = document.querySelector('#date');
const categoryField = document.querySelector('#categoria'); // Captura a categoria

function setCategory(category) {
    document.querySelector('#categoria').value = category;
}

let transactions = localStorage.getItem('transactions') 
    ? JSON.parse(localStorage.getItem('transactions')) 
    : [];

const removerTransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}



const addTransactionIntoDOM = ({amount, name, date, id,categoria}) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(amount);


    const li = document.createElement('li');

    const transactionDate = new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name}  <span> ${operator} R$ ${amountWithoutOperator}</span>
         <span>Data: ${transactionDate}</span>
         <span> categoria: ${categoria}</span>
         <button class="delete-btn" onClick="removerTransaction(${id})">x</button>
    `;

    transactionsUl.append(li);
};




const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0)).toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0).toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount);
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpenses(transactionsAmounts);
  


    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
 
}

const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount, transactionDate,categoria) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount),
        date: transactionDate,
        categoria: categoria // Armazena a categoria
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
    dataS.value = '';
    categoryField.value = ''; // Limpa a categoria após adicionar a transação
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const transactionDate = dataS.value;
    const categoria = document.querySelector('#categoria').value;  // Pega a categoria do campo oculto

    if (transactionName === '' || transactionAmount === '' || transactionDate === '' ) {
        alert('Preencha todos os campos.');
        return;
    }

    addToTransactionsArray(transactionName, transactionAmount, transactionDate,categoria);
    init();
    updateLocalStorage();
    cleanInputs();
})




document.addEventListener('DOMContentLoaded', (event) => {
  const exportBtn = document.getElementById('exportBtn');

  if (exportBtn) {
      exportBtn.addEventListener('click', () => {
          const transactions = document.querySelectorAll('#transactions li');
          const rows = [['Nome da Transação', 'Valor']];


          transactions.forEach(transaction => {
             // Pega o nome da transação do texto do <li> (removendo o valor do <span>)
             const name = transaction.firstChild.nodeValue.trim();
             // Pega o valor da transação do <span>
             const value = transaction.querySelector('span').textContent.trim();

            // Adiciona a linha ao array de resultados
            rows.push([name,value]);
          });

          // Cria um novo workbook e adiciona a planilha
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(rows);

          // Adiciona a planilha ao workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Transações');

          // Gera o arquivo Excel e dispara o download
          XLSX.writeFile(wb, 'transacoes.xlsx');
      });
  } else {
      console.error('Elemento exportBtn não encontrado!');
  }
});




