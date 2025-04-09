document.addEventListener('DOMContentLoaded', function(){
    // Back accoutn storage
    let accounts = [];
    let nextAccountNumber = 1000; // Starting accoutn number

    // DOM elements
    const outputDiv = document.getElementById('output');
    const createAccoutnBtn = document.getElementById('createAccountBtn');
    const showAccountsBtn = document.getElementById('showAccountBtn');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const transferBtn = document.getElementById('transferBtn');
    const checkBalanceBtn = document.getElementById('checkBalanceBtn');

    // Helper function to display & clear output 

    // Account class
    class BankAccount{
        constructor(accountHolder, initialBalance = 0){
            this.accountNumber = nextAccountNumber++;
            this.accountHolder = accountHolder;
            this.balance = initialBalance;
            this.transactions = [];
        }

        deposit(amount){
            amount = parseFloat(amount);
            if(amount > 0){
                this.balance += amount;
                this.transactions.push({
                    type: 'deposit',
                    amount: amount,
                    date: new Date().toLocaleString()
                });
                return true;
            }
            return false;
        }

        withdraw(amount){
            amount = parseFloat(amount);
            if(amount > 0 && amount <= this.balance){
                this.balance -= amount;
                this.transactions.push({
                    type: 'withdrawal',
                    amount: amount,
                    date: new Date().toLocaleString()
                });
                return true;
            }
            return false;
        }

        getBalance(){
            return this.balance;
        }

        getAccountInfo(){
            return `
            <p><strong>Account Number: </strong>${this.accountNumber}</p>
            <p><strong>Account Holder: </strong>${this.accountHolder}</p>
            <p><strong>Balance:</strong>$${this.balance}</p>
            `;
        };

        getTransactionHistory(){
            if(this.transactions.length === 0){
                return '<p>No transaction yet.</p>'
            }
            let html = '<ul>';
            this.transactions.forEach(transaction => {
                html += `
                <li>
                    ${transaction.date} - ${transaction.type}: $${transaction.amount.toFixed(2)}
                </li>
                `;
            });
            html += '</ul>';
            return html;
        }
    }

    function findAccount(accountNumber){
        return accounts.find(acc => acc.accountNumber === parseInt(accountNumber));
    }

    createAccoutnBtn.addEventListener('click', function(){
        createInputFields(
            [
                {id: 'accountHolder', label: 'Account Holder Name', placeHolder: 'John Doe'},
                {id: 'initialBalance', label: 'Initial Deposit', type: 'number', placeHolder: '100'}
            ],
            'Create Account',
            function(values){
                const initialBalance = parseFloat(values.initialBalance) || 0;
                const account = new BankAccount(values.accountHolder, initialBalance);
                accounts.push(account);
                displayOutput(`
                   <h3>Account Created Successfully</h3>
                   ${account.getAccountInfo()}
                   <p>Initial Deposit: $${initialBalance.toFixed(2)}</p> 
                `);
            }
        )
    })

})