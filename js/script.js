showdown.extension('codehighlight', function() {
  function htmlunencode(text) {
    return (
      text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
      );
  }
  return [
    {
      type: 'output',
      filter: function (text, converter, options) {
        // use new shodown's regexp engine to conditionally parse codeblocks
        var left  = '<pre><code\\b[^>]*>',
            right = '</code></pre>',
            flags = 'g',
            replacement = function (wholeMatch, match, left, right) {
              // unescape match to prevent double escaping
              match = htmlunencode(match);
              return left + hljs.highlightAuto(match).value + right;
            };
        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
      }
    }
  ];
});

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


var app = angular.module('RoutingApp', ['ngRoute']);

app.config( ['$routeProvider', function($routeProvider) {
		$routeProvider
            .when('/', {
                templateUrl: 'templates/gists.html'
            })
            .when('/about', {
                templateUrl: 'templates/about.html'
            })
            .when('/blog', {
                templateUrl: 'templates/blog.html'
            })
            .when('/resume', {
                templateUrl: 'templates/resume.html'
            })
            .when('/contact', {
                templateUrl: 'templates/contact.html'
            })
            .when('/blogposts/:cat/:id', {
                templateUrl: function(urlattr){
                    return 'blogposts/' + urlattr.cat + '_' + urlattr.id + '.html';
                }
            })
            .otherwise({
                templateUrl: 'templates/gists.html'
            });
	}]);

app.controller('myCtrl', function($scope, $http, $sce) {
	$http.get("https://api.github.com/users/easadler/gists")
        .success(function (gists) {
                var html = [];

                shuffleArray(gists).forEach(function(gist) {
                html.push('<div class="col-sm-6 col-md-3 col-lg-3"> <div class="grid-list">');
                if(gist.description.substring(0,5) == 'Class'){
                html.push('<a href="' + 'https://gist.github.com/easadler/' + gist.id + '#file-readme-md' + '" target="_blank">');
                html.push('<img class="img-responsive" src="' + gist.files['thumbnail.png']['raw_url'] +  '"><\/a>');
                html.push('<div class="overlay"><a target="_blank"  href="' + 'https://gist.github.com/easadler/' + gist.id + '#file-readme-md' + '">');
                } else {
                html.push('<a href="'+ 'http://bl.ocks.org/easadler/' + gist.id + '" target="_blank">');
                html.push('<img class="img-responsive" src="' + gist.files['thumbnail.png']['raw_url'] +  '"><\/a>');
                html.push('<div class="overlay"><a target="_blank"  href="' + 'http://bl.ocks.org/easadler/' + gist.id + '">');
                }
                html.push('<h2>' + gist.description + '<\/h2>');
                html.push('<\/a> <\/div><\/div><\/div>');
            });
            $scope.gists = $sce.trustAsHtml(html.join(''));
        })
        .error(function () {
                $scope.userNotFound = true;
    });

});

app.directive('markdown', function () {
    var converter = new showdown.Converter({ extensions: ['codehighlight'], helper: ['replaceRecursiveRegExp']});
    console.log(converter)
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var htmlText = converter.makeHtml(element.text());
            element.html(converter. htmlText);
        }
    };

});