var system = require('system');
var webpage = require('webpage');
var page = webpage.create();
page.open('http://gxamjbnu7uknahng.onion/wiki/index.php?title=Hard_Candy&printable=yes', function(status) {
	if (page.injectJs("node_modules/jquery/dist/jquery.js")) {
		var urls = page.evaluate(function() {
			jQuery2 = jQuery.noConflict(true);
			if (!String.prototype.startsWith) {
				Object.defineProperty(String.prototype, 'startsWith', {
					enumerable: false,
					configurable: false,
					writable: false,
					value: function(searchString, position) {
						position = position || 0;
						return this.lastIndexOf(searchString, position) === position;
					}
				});
			}
			var urls = {};
			jQuery2('[href*=".onion"]').each(function(){
				var url = jQuery2(this).attr('href').split('://')[1].split('/')[0];
				if (/^[a-z0-9.]+$/.test(url)) {
					urls[url] = 1;
					if (url.split('.').length === 2) {
						urls['www.'+url] = 1;
					} else if (url.startsWith('www.') && url.split('.').length === 3) {
						urls[url.substring(4)] = 1;
					}
				}
			});
			return 'mHTTPSDomainsList.add("'+Object.keys(urls).join('");\nmHTTPSDomainsList.add("')+'");';
		});

		var page2 = webpage.create();
		page2.open('app/src/main/java/acr/browser/lightning/utils/AdBlock.java',
			function(status) {
				console.log(page2.plainText.split('//HTTPS rules')[0], urls, page2.plainText.split('//HTTPS rules')[1]);
				phantom.exit();
			});
	}
});
page.onConsoleMessage = function(msg, lineNum, sourceId) {
	system.stderr.writeLine('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};
page.onError = function(msg, trace) {
	system.stderr.writeLine('ERROR: ' + msg);
	trace.forEach(function(item) {
		system.stderr.writeLine('  ', item.file, ':', item.line);
	});
};
