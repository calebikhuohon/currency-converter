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
    if (navigator.onLine) {
        let converted;
        console.log(convert);
        let amountTo = document.getElementById("amountTo");
        let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${convert}&compact=ultra`;
        console.log('query will be fetched from network');
        //fetch from network
        fetch(url).then((response) => {
                return response.json();
            })
            .then((jsonRes) => {
                console.log(jsonRes[convert]);
                converted = jsonRes[convert] * amountFrom;
                document.getElementById("amountTo").value = converted;
                console.log(converted);
                storeRates(convert, converted);
            });
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

let storeRates = (query, rate) => {
    let queryCurrencies = query.split("_");
    dbPromise.then((db) => {
            let tx = db.transaction('rates', 'readwrite');
            let currencyStore = tx.objectStore('rates');

            if (queryCurrencies[0] == queryCurrencies[1]) {
                currencyStore.put(parseFloat(rate), query);
                return tx.complete;
            }

            currencyStore.put(parseFloat(rate), query);
            currencyStore.put(
                parseFloat(1 / rate),
                `${queryCurrencies[1]}_${queryCurrencies[0]}`
            );
            return tx.complete;



        }).then(() => console.log('query added to  db'))
        .catch(err => console.log('adding query to db failed', err));
}


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${window.location.pathname}sw.js`)
        .then(() => console.log("[Service Worker] successfully registered"))
        .catch((e) => console.log(e, "[Service Worker] An error occured"))
} else {
    console.log("an error occured")
}