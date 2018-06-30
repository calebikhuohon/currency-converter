


if ('serviceWorker' in navigator) {

    navigator.serviceWorker.register('./sw.js', {
            scope: './currency-converter'
        })
        .then(reg => console.log(`Registration successful`))
        .catch(err => console.log(`Error: ${err}`));


    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

let dbPromise = idb.open('currency-converter', 2, (upgradeDb) => {
    switch (upgradeDb.oldVersion) {
        case 0:
            const keyValStore = upgradeDb.createObjectStore('rates');


    }

});

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


document.getElementById('convert-button').addEventListener('click', () => {
    let amountFrom = document.getElementById("amountFrom").value;
    let fromCurrency = document.getElementById('currency-from').value;
    
    let toCurrency = document.getElementById('currency-to').value;
    let convert = `${fromCurrency}_${toCurrency}`;
    console.log(convert);
    let amountTo = document.getElementById("amountTo");
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${convert}&compact=ultra`;

    if (navigator.onLine) {
        dbPromise.then((db) => {
                let tx = db.transaction('rates', 'readwrite');
                let currencyStore = tx.objectStore('rates');


                console.log('query will be fetched from network');
                //fetch from network
                fetch(url).then((response) => {
                        return response.json();
                    })
                    .then((jsonRes) => {
                        console.log(jsonRes[convert]);
                        let converted = jsonRes[convert] * amountFrom;
                        document.getElementById("amountTo").value = converted;
                        console.log(converted);
                        
                        
                        
                    }).then((converted) => {
                        currencyStore.put(converted, convert);
                        return tx.complete;
                    })
                    

                let queryStrings = convert.split("_");
                //currencyStore.put((1/converted), `${queryStrings[1]_${queryStrings[0]}}`);
                //return tx.complete;

            }).then(() => console.log('query added to  db'))
            .catch(err => console.log('adding query to db failed', err));
    } else {
        console.log('offline');
        dbPromise.then((db) => {
            let tx = db.transaction('rates', 'readwrite');
            let currencyStore = tx.objectStore('rates');
            return currencyStore.get(convert)
                .then((rates) => {
                    document.getElementById("amountTo").value = rates;
                })

        });
    }


});