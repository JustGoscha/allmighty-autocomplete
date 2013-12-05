allmighty-autocomplete
======================

Simple to use autocomplete directive in a module for AngularJs!

Checkout [the demo](http://justgoscha.github.io/allmighty-autocomplete/) to see what it does.

## Setup

To use it you need jQuery and of course AngularJS, so make sure these are loaded first. I always like to use Google's CDN for that:

```html
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
```

Also you should load the stylesheet of the autocomplete:

```html
  <link rel="stylesheet" href="style/autocomplete.css">
```

Then in your HTML you should load it before the script of your main app. Like this:

```html
<script type="text/javascript" src="script/autocomplete.js"></script>
<script type="text/javascript" src="script/app.js"></script>
```

In your main script file you should add it as dependency:

```javascript
var app = angular.module('app', ['autocomplete']);
```

## Usage

If you now want an autocomplete you can just use the tag `<autocomplete>` tag in your HTML. With the `data` parameter you can pass in an array that will be used for autocompletion. You need to pass there something which is available in the $scope of your controller. 

You can also pass a function that receives changes with the `on-type` attribute. This is useful if you need to load external resources from a REST API, for example, you cna then upload the array you passed into `data` and it will automatically use the changed array.

### Attributes

`data` : Pass an array to the autocomplete directive. Should be accessible in the $scope of your controller.

`on-type` : (optional) Pass a function that will receives changes, when somebody types something. It passes the full string for any character typed or deleted. You can use that for example to update the array that you passed in data.

## Example

HTML: 
```html
    <div ng-controller="MyCtrl">  
      <autocomplete data="movies" on-type="updateMovies"></autocomplete>
    </div>
```

JavaScript:
```javascript
	var app = angular.module('app', ['autocomplete']);

	app.controller('MyCtrl', function($scope, MovieRetriever){
		$scope.movies = ["Lord of the Rings", "Drive", "Science of Sleep", "Back to the Future", "Oldboy"];

		// gives another movie array on change
		$scope.updateMovies = function(typed){
			// MovieRetriever could be some service returning a promise
		    $scope.newmovies = MovieRetriever.getmovies(typed);
		    $scope.newmovies.then(function(data){
		      $scope.movies = data;
		    });
		}
	});

```


