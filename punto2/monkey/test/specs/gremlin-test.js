
function unleashGremlins(ttl, callback) {
    function stop() {
        horde.stop();
        callback();
    }
    var horde = window.gremlins.createHorde()
        .before(function (done) {
            var horde = this;
            setTimeout(function () {
                horde.log('async');
                done();
            }, 500);
        })
        .before(function () {
            this.log('sync');
        })
        /**
         * Modifique la especie que llena formularios para que solo intente actuar sobre elementos que se pueden llenar.
         */
        .gremlin(gremlins.species.formFiller())
        /**
         * Modifique la especie que realiza clicks para que solo haga clicks sobre botones o links
         */
        .gremlin(function () {
            $("button").click();
            console.log("custom gremlin click submit");
        })
        .gremlin(function () {
            $("a").click();
            console.log("custom gremlin click submit");
        })
        /**
         * Cambie la distribucíon para darle prioridad al gremlin que realiza clicks
         */
        .strategy(gremlins.strategies.distribution()
            .delay(50) // wait 50 ms between each action
            .distribution([0.2, 0.4, 0.4])
        )
        .mogwai(gremlins.mogwais.alert())
        .mogwai(gremlins.mogwais.gizmo().maxErrors(5));



    horde.seed(1234);
    horde.after(callback);
    window.onbeforeunload = stop;
    setTimeout(stop, ttl);
    horde.unleash();
}


describe('Monkey testing with gremlins ', function () {
  it('it should not raise any error', function () {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(10000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
        browser.logger.info(log.message.split(' ')[2]);
    ;});
  });
});

function loadScript(callback) {
    var s = document.createElement('script');
    s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
    if (s.addEventListener) {
        s.addEventListener('load', callback, false);
    } else if (s.readyState) {
        s.onreadystatechange = callback
    }
    document.body.appendChild(s);
}
