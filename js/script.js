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
                html.push('<a href="' + gist.url + '" target="_blank">');
                html.push('<img class="img-responsive" src="' + gist.files['thumbnail.png']['raw_url'] +  '"><\/a>');
                if(gist.description.substring(0,5) == 'Class'){
                html.push('<div class="overlay"><a target="_blank"  href="' + 'https://gist.github.com/easadler/' + gist.id + '#file-readme-md' + '">');
                } else {
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
    var converter = new showdown.Converter();
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var htmlText = converter.makeHtml(element.text());
            element.html(htmlText);
        }
    };

});