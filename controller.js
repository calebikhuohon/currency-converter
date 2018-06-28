if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                //Registration was successful
                console.log(`serviceWorker reg. has a scope: ${registration}`);
            }, (err) => {
                //registration failed
                console.log(`unsuccessful service worker reg; ${err}`);
            });
    });
};
