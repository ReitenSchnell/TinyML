angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("predict/predict.html","<div class=\"row\">\n  <div class=\"col-md-3 shifted\">\n    <h4>Will suspect <span class=\"force_notfound\">(not)</span> <span class=\"force_found\">be</span> found?\n      <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Implementation is based on the Decision Tree algorithm. Crimes with nonempty (or not equal to \'Investigation complete; no suspect identified\') value of \'Last outcome category\' field are considered as crimes with found suspect\" tooltip-placement=\"bottom\"></span></h4>\n    <select class=\"select-wrapper\" ng-model=\"selectedType\" ng-options=\"c.label for c in types\" ng-change = \"predict()\"></select>\n  </div>\n  <div class=\"col-md-4\">\n    <div predictions-map regions=\"regions\" forces=\"forces\" predictions=\"predictions\"></div>\n  </div>\n</div>\n\n");
$templateCache.put("similarities/similarities.html","<div class=\"row text-center\">\r\n  <div class=\"col-md-5\">\r\n    <h4>Regions similar by crime distribution\r\n      <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Implementation is based on the k-Nearest Neighbors algorithm. Here you can see regions with similar crime distributions. Pay attention to two interesting clusters on the East\" tooltip-placement=\"bottom\"></span></h4>\r\n    </h4>\r\n  </div>\r\n  <div class=\"col-md-5\">\r\n    <h4>Regions similar by suspect found distribution\r\n      <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Implementation is based on the k-Nearest Neighbors algorithm. Here you can see regions with similar suspect found rate distributions. Pay attention to interesting cluster on the South\" tooltip-placement=\"bottom\"></span></h4>\r\n    </h4>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-md-5\">\r\n    <div map-chart regions=\"regions\" forces=\"forces\" similarities=\"similarities\"></div>\r\n  </div>\r\n  <div class=\"col-md-5\">\r\n    <div map-chart regions=\"regions\" forces=\"forces\" similarities=\"similaritiesFound\"></div>\r\n  </div>\r\n</div>\r\n");
$templateCache.put("statistics/statistics.html","<div class=\"row text-center\">\n  <div class=\"col-md-6\">\n    <h4>Crimes by type <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Statistics taken from crime data reports for the period January 2016 - June 2016\" tooltip-placement=\"bottom\"></span></h4>\n  </div>\n  <div class=\"col-md-6\">\n    <h4>Crimes by place <span class=\"glyphicon glyphicon-info-sign\" uib-tooltip=\"Statistics taken from crime data reports for the period January 2016 - June 2016. Forces with rate less than 2.5% are not shown\" tooltip-placement=\"bottom\"></span></h4>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-lg-6\">\n    <div bar-chart chart-data=\"crimesByType\"></div>\n  </div>\n  <div class=\"col-lg-6\">\n    <div pie-chart chart-data=\"crimesByPlace\"></div>\n  </div>\n</div>\n");
$templateCache.put("technologies/technologies.html","<div class=\"row\">\n  <div class=\"col-md-10 shifted\">\n    <h4>Tools and inspirations</h4>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-10\">\n    <ul class=\"list\">\n      <li><code>Data</code> - thanks <a href=\"http://data.police.uk\" target=\"_blank\">data.police.uk</a> for making data about crime and policing in England publicly available under <a target=\"_blank\" href=\"http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/\">Open Government License</a>;</li>\n      <li><code>Server-side language</code> - open source, cross-platform, functional-first programming language <a target=\"_blank\" href=\"http://fsharp.org/\">F#</a>;</li>\n      <li><code>REST API</code> - lightweight, non-blocking web server <a target=\"_blank\" href=\"https://suave.io/\">Suave</a>, which makes creating Web APIs smooth and simple;</li>\n      <li><code>Machine learning</code> - <a target=\"_blank\" href=\"http://accord-framework.net/\">Accord.NET</a>, machine learning framework combined with audio and image processing libraries;</li>\n      <li><code>UI</code> - well-known and perfect stack of <a target=\"_blank\" href=\"http://angularjs.org\">AnguarJS</a> and <a target=\"_blank\" href=\"http://getbootstrap.com/\">Bootstrap</a>;</li>\n      <li><code>Data visualization</code> - <a target=\"_blank\" href=\"https://d3js.org/\">D3.js</a>, which literary helps bring data to life;</li>\n      <li><code>Knowledge</code> - incredible <a target=\"_blank\" href=\"https://www.amazon.com/Machine-Learning-Projects-NET-Developers/dp/1430267674\">Machine Learning Projects for .NET Developers</a> book, written by Mathias Brandewinder, which shows you the beauty of F#, math and data.</li>\n    </ul>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-10 shifted\">\n    <h4>Disclaimer</h4>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-10 shifted\">\n    This web application in no way is intended to assess the job of respected UK police. This is just an attempt to analyze and show some interesting data.\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-md-10 shifted\">\n    If you would like to ask me a question, feel free to drop me an <a href=\"mailto:dotnetslavemail@gmail.com\">email</a>.\n  </div>\n</div>\n");}]);