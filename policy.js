BrowserPolicy.framing.disallow();
BrowserPolicy.content.allowEval();
var trusted = [
  '*.google.com',
  '*.gstatic.com',
  '*.google-analytics.com'
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});
