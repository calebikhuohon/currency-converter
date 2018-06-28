this.prototype._registerServiceWorker = () => {
    if(!navigator.serviceWorker) return;

    const indexController = this;

    navigator.serviceWorker.register('/sw,js')
        .then((reg) => {
            if(!navigator.serviceWorker.controller) {
                return;
            }

            if (reg.installing) {
                indexController._trackInstalling(reg.installing);
                return;
              }
          
              reg.addEventListener('updatefound', () => {
                indexController._trackInstalling(reg.installing);
              });
            
        });
}

this.prototype._trackInstalling = function(worker) {
    var indexController = this;
    worker.addEventListener('statechange', function() {
      if (worker.state == 'installed') {
        indexController._updateReady(worker);
      }
    });
  };
  
