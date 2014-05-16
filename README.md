allmighty-autocomplete
======================

Simple to use autocomplete directive in a module for AngularJS!
Supports arrow keys to traverse suggestions as well as mouse input.
You can load the suggestions from a remote REST API, it also supports promises.

Checkout [the demo](http://justgoscha.github.io/allmighty-autocomplete/) to see what it does.

## Setup

To use it you need of course AngularJS, so make sure it is loaded first. I always like to use Google's CDN for that:

```html
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
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

`on-type` : *(optional)* Pass a function that will receive changes, when somebody types something. It passes the full string for any character typed or deleted. You can use that for example to update the array that you passed in data.

`on-select` : *(optional)* Pass a function that will receive changes, when a suggestion is selected. It passes the full string of the suggestion.

`click-activation` : *(optional)* When `true`, the suggestion box opens on click (unfortunately onfoucs is not implemented properly in most browsers right now). By default it is only activated, when you start typing something.

`ng-model`: What you typed in will be in this variable and accessible in the $scope of the controller.

`attr-placeholder`: *(optional)* Sets desired text as placeholder into the input element of autocomplete directive. By default it's "start typing..."

`attr-class`: *(optional)* Change the class of the `div` containing the `input` and suggestions elements, allowing you to change their style according to your needs.

`attr-id`: *(optional)* Change the id of the containing `div` element, see `attrs-class`.

`attr-input-class`: *(optional)* Set the class of the `input` element, allowing you to style the input field directly.

`attr-input-id`: *(optional)* Change the id of the `input` element, see `attrs-input-class`.

## Example

HTML:
```html
    <div ng-controller="MyCtrl">
      <autocomplete ng-model="yourchoice" data="movies" on-type="updateMovies"></autocomplete>
    </div>
```

JavaScript:
```javascript
	var app = angular.module('app', ['autocomplete']);

	app.controller('MyCtrl', function($scope, MovieRetriever){
		$scope.movies = ["Lord of the Rings",
		 				"Drive",
		 				"Science of Sleep",
		 				"Back to the Future",
		 				"Oldboy"];

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

## Change log

***07.03.2014***
+ `attr-input-class` & `attr-input-id` allow you to choose class and id of the input field. Handy when wanting to add bootstrap styles to the input field

***25.02.2014***
+ `attr-class` & `attr-id` allow you to choose class and id of the div where the autocomplete is contained, makes it more customizable
+ `placeholder` renamed into `attr-placeholder`

***14.02.2014***
+ got rid of jQuery dependency

***13.02.2014***

+ ng-model can now be used outside to obtain the current search parameter
+ hiding suggestions on blur

***31.01.2014***
+ Stop showing suggestions on pushing escape
+ select if suggestions should be shown after clicking on input with new parameter `click-activation`
+ Added customizable placeholders for input line
+ FIXED multiple autocomplete directives in one controller are now possible and behave as expected



