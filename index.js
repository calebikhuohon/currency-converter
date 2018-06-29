

let dropdown = document.getElementById('currency-from');
let dropdown2 = document.getElementById('currency-to');
dropdown.length = 0;
dropdown2.length = 0;

fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(
        (response) => {
            if (response.status !== 200) {
                return console.log('looks like there was a problem');
            }

            response.json().then((data) => {
                let currencies = data.results;
                console.log(currencies);

                for (c in currencies) {
                    let option = document.createElement('option');
                    let option2 = document.createElement('option');
                    option.value = `${currencies[c].id}`;
                    option2.value = `${currencies[c].id}`;
                    let check = currencies[c].id;

                    if (typeof check === 'undefined') {
                        check = '';
                        console.log(check);
                    }
                    option.text = `${check} (${currencies[c].currencyName})`;
                    option2.text = `${check} (${currencies[c].currencyName})`;
                    option.value = check;
                    option2.value = check;
                    dropdown.add(option);
                    dropdown2.add(option2);
                    //expect.appendChild(option);
                    //have.appendChild(option.cloneNode(true));
                }
            })
        }
    ).catch((err) => {
        console.log('oops!', err);
    });










//https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP,PHP_USD




document.getElementById('convert-button').addEventListener('click', () => {
    let amountFrom = document.getElementById("amountFrom").value;
    let fromCurrency = document.getElementById('currency-from').value;
    let toCurrency = document.getElementById('currency-to').value;
    let convert = `${fromCurrency}_${toCurrency}`;
    let amountTo = document.getElementById("amountTo");
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${convert}&compact=ultra`;

    fetch(url).then((response) => {
            return response.json();
        })
        .then(jsonRes => {
            console.log(jsonRes[convert]);
            let converted = jsonRes[convert] * amountFrom;
            document.getElementById("amountTo").value = converted;
            console.log(converted);
        })
});
