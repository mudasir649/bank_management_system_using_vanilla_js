document.addEventListener('DOMContentLoaded', function(){
    // Back accoutn storage
    let accounts = [];
    let nextAccountNumber = 1000; // Starting accoutn number

    // DOM elements
    const outputDiv = document.getElementById('output');
    const createAccoutnBtn = document.getElementById('createAccountBtn');
    const showAccountsBtn = document.getElementById('showAccountsBtn');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const transferBtn = document.getElementById('transferBtn');
    const checkBalanceBtn = document.getElementById('checkBalanceBtn');

    // Helper function to display & clear output 

    function displayOutput(message){
        outputDiv.innerHTML = message;
    }

    function createInputFields(fields, buttonText, callback){
        let html = '';
        fields.forEach(field => {
            html += `<div class="input-group">
                <label>${field.label}</label>
                <input id="${field.id}" type="${field.type || 'text'}" placeholder="${field.placeholder || ''}" />
            </div>`;
        })
        html += `<button id="submitBtn">${buttonText}</button>`
        displayOutput(html);
        document.getElementById('submitBtn').addEventListener('click', function(){
            const values = {};
            fields.forEach(field => {
                values[field.id] = document.getElementById(field.id).value;
            });
            console.log("values****: ", values)
            callback(values)
        })
    }

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

    // Event handlers
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
        );
    });

    showAccountsBtn.addEventListener('click', function(){
        if(accounts.length === 0){
            displayOutput(`<p>No accounts created yet.</p>`);
            return;
        }
        let html = '<h3>All accounts</h3><ul>';
        accounts.forEach(account => {
            html += `
            <li>
            ${account.getAccountInfo()}
            <button onclick="displayOutput(${account.getAccountInfo().replace(/'/g, "\\'")})">
                View Details
            </button>
            </li>
            <hr>
            `
        });
        html += '</ul>';
        displayOutput(html)
    });

    depositBtn.addEventListener('click', function(){
        createInputFields(
            [
                {id: 'accountNumber', label: 'Account  Number', placeholder: 'e.g 1000'},
                {id: 'amount', label: 'Amount to deposit', placeholder: 'e.g 500'}
            ],
            'Deposit',
            function(values){
                const account = findAccount(values.accountNumber);
                if(account){
                    if(account.deposit(values.amount)){
                        displayOutput(`
                            <h3>Deposit Successfully</h3>
                            ${account.getAccountInfo()}
                            <p>Deposited: $${parseFloat(values.amount).toFixed(2)}</p>
                            `)
                    }else{
                        displayOutput('<p class="error">Invalid deposit amount.</p>')
                    }
                }else{
                    displayOutput('<p class"error">Account not found.</p>')
                }
            }
        )
    });

    withdrawBtn.addEventListener('click', function(){
        createInputFields(
            [
                {id: 'accountNumber', label: "Account Number", placeholder: "e.g., 1000"},
                {id: 'amount', label: 'Amount to withdraw', type: 'number', placeholder: '50'}
            ],
            'Withdraw',
            function(values){
                const account = findAccount(values.account);
                if(account){
                    if(account.withdraw(values.amount)){
                        displayOutput(`
                            <h3>Withdrawl successfully</h3>
                            ${account.getAccountInfo()}
                            <p>Withdrawn: $${parseFloat(values.amount).toFixed(2)}</p>
                            `)
                    }else{
                        displayOutput('<p class="error">Invalid Withdrawl Amount or insufficient funds.</p>')
                    }
                }else{
                    displayOutput('<p class="error">No account found.</P')
                }
            }
        )
    })

})