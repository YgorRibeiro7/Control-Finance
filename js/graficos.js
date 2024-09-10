document.addEventListener('DOMContentLoaded', () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const incomeTransactions = transactions
        .filter(transaction => transaction.amount > 0)
        .map(transaction => transaction.amount);

    const expenseTransactions = transactions
        .filter(transaction => transaction.amount < 0)
        .map(transaction => transaction.amount);

    const totalIncome = incomeTransactions.reduce((acc, val) => acc + val, 0);
    const totalExpense = Math.abs(expenseTransactions.reduce((acc, val) => acc + val, 0));

    const ctx = document.getElementById('transactionChart').getContext('2d');

    // Criação do gráfico de barras para entradas e saídas
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                label: 'R$',
                data: [totalIncome, totalExpense],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderColor: ['#27ae60', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                // Ativa o plugin de Data Labels
                datalabels: {
                    color: 'black',
                    anchor: 'end',
                    align: 'start',
                    formatter: (value) => `R$ ${value.toFixed(2)}`
                }
            }
        },
        plugins: [ChartDataLabels] // Adiciona o plugin ChartDataLabels ao gráfico
    });
});
