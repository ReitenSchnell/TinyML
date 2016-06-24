angular
  .module('crimeChartApp')
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope){
    var d = $q.defer();
    function onScriptLoad(){
      $rootScope.$apply(function(){d.resolve(window.d3);});
    }
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'http://d3js.org/d3.v3.min.js';
    scriptTag.onreadystatechange = function(){
      if (this.readyState == 'complete') onScriptLoad()
    };
    scriptTag.onLoad = onScriptLoad();

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return{
      d3:function(){return d.promise;}
    }
  }]);