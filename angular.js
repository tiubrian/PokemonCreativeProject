angular.module('app', [])
  .controller('mainCtrl', ['$scope', function ($scope) {

  	var globalJson;

  	$scope.pokeInfo = ' ';

  	angular.element(document.querySelector('#showJson')).addClass('ng-hide');
	  $("#dialog").dialog({
	    autoOpen: false,
	    width: 400,
	    height: 300,
	    title: "JSON from Pokemon API"
	  });
  	$scope.showTheStats = function(event){
  		console.log("#showStats button clicked now showing in Angular");
  		$scope.showStats(event);
  	};

  	$scope.checkKeypress = function(e) {
		if (e.which == 13) {
		    console.log('Enter pressed');
		    $scope.showStats(e);
		}
	}


  	$scope.showStats = function(e) {
	  var pokemonNumber = $('#pokemonNumber').val();
	  console.log(pokemonNumber);
	  var url = "https://pokeapi.co/api/v2/pokemon/"+pokemonNumber+"/";
	  console.log(url);

	  $scope.pokeInfo="searching ...";

	  $.getJSON( url , function( data ) {
	    globalJson = data;

	    console.log(data);
	    var htmlString = toTitleCase(data['name'])+'<br>';
	    htmlString += "<img src=\""+data['sprites']['front_default']+"\"><br>"
	    htmlString += "Types: ";
	    var idx, len;
	    len = data['types'].length;
	    for (idx = 0; idx < len; idx++)
	      htmlString += data['types'][idx]['type']['name'] + "&nbsp;";
	    htmlString += "<br>";
	    htmlString += "Height: " + data['height'] + '<br>';
	    htmlString += "Weight: " + data['weight'] + '<br>';
	    var baseTotal = 0;
	    len = data['stats'].length;
	    for (idx = 0; idx < len; idx++) {
	      baseTotal += data['stats'][idx]['base_stat'];
	      htmlString += toTitleCase(data['stats'][idx]['stat']['name']) + " base: " + data['stats'][idx]['base_stat'] + "<br>";
	    }
	    htmlString += "Base total: " + baseTotal + "<br>";
	    htmlString += "<br>";

	    angular.element(document.querySelector('#stats')).html(htmlString);
	    console.log(htmlString);

	    angular.element(document.querySelector('#showJson')).removeClass('ng-hide');
	    console.log(url);
	    console.log(data);
	    console.log("Name: " + data['name']);

	    $.getJSON("https://pokeapi.co/api/v2/pokemon/"+pokemonNumber+"/encounters", function(data2) {
	      console.log(data2);
	    });
  		});
	};

  	$scope.showTheJSON = function(e) {
  		console.log("#showJson button clicked");
  		$scope.showJson(e);
	};

	$scope.showJson = function(e) {
	  console.log(globalJson);

	  var jsonObj = globalJson;
	  var jsonPretty = JSON.stringify(jsonObj, null, "..");  
	  jsonPretty = syntaxHighlight(jsonPretty);

	  var outputText = document.createElement("pre");
	  outputText.innerHTML = jsonPretty;

	  $("#dialog").append(outputText);
	  $("#dialog").dialog("open");
	};

	function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    	});
	}
	function toTitleCase(str) {
	  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

}]);
