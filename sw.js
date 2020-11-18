self.addEventListener('install', function(event) {
    var indexPage = new Request('index.html');
    event.waitUntil(
      fetch(indexPage).then(function(response) {
        return caches.open('pwabuilder-offline').then(function(cache) {
          console.log('[PWA Builder] Cached index page during Install'+ response.url);
          return cache.put(indexPage, response);
        });
    }));
  });

  self.addEventListener('push', function(event) {
    var payload = event.data ? event.data.text() : 'Alohomora';
    
    event.waitUntil(
      // Показываем уведомление с заголовком и телом сообщения.
      self.registration.showNotification('My first spell', {
        body: payload,
      })
    );
  });
  
  self.addEventListener('pushsubscriptionchange', function(event) {
    console.log('Spell expired');
    event.waitUntil(
      self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function(subscription) {
        console.log('Another invade! Legilimens!', subscription.endpoint);
        return fetch('register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    var updateCache = function(request){
      return caches.open('pwabuilder-offline').then(function (cache) {
        return fetch(request).then(function (response) {
          console.log('[PWA Builder] add page to offline'+response.url)
          return cache.put(request, response);
        });
      });
    };
    event.waitUntil(updateCache(event.request));
    event.respondWith(
      fetch(event.request).catch(function(error) {
        console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );
        return caches.open('pwabuilder-offline').then(function (cache) {
          return cache.match(event.request).then(function (matching) {
            var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
            return report
          });
        });
      })
    );
  })

  var savedPrompt = null;

  self.addEventListener('beforeinstallprompt', beforeInstallPrompt);

  function beforeInstallPrompt(event) {
    event.preventDefault();
    savedPrompt = event;
    //implement logic to show your UI for adding your application to the home screen (probably a button)
  }

  //Call this method when the user has clicked the button in your UI
  function userClickedAddToHome() {
    savedPrompt.prompt();
    
    savedPrompt.userChoice
      .then(function(choiceResult){
    if (choiceResult.outcome === 'accepted') {
      //User has agreed to add application to Home screen
    } else {
      //User has declined to add application to Home screen
    }
    savedPrompt = null;
  });
  }