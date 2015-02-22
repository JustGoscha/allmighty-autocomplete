/* --- Made by justgoscha and licensed under MIT license --- */

var app = angular.module('autocomplete', []);

app.directive('autocomplete', function() {
  var index = -1;

  return {
    restrict: 'E',
    scope: {
      searchParam: '=ngModel',
      suggestions: '=data',
      onType: '=onType',
      onSelect: '=onSelect',
      render: '=render',
      autocompleteRequired: '='
    },
    controller: ['$scope', function($scope){
      // the index of the suggestions that's currently selected
      $scope.selectedIndex = -1;

      $scope.initLock = true;

      // set new index
      $scope.setIndex = function(i){
        $scope.selectedIndex = parseInt(i);
      };

      this.setIndex = function(i){
        $scope.setIndex(i);
        $scope.$apply();
      };

      $scope.getIndex = function(i){
        return $scope.selectedIndex;
      };

      // watches if the parameter filter should be changed
      var watching = true;

      // autocompleting drop down on/off
      $scope.completing = false;

      // starts autocompleting on typing in something
      $scope.$watch('searchParam', function(newValue, oldValue){

        if (oldValue === newValue || (!oldValue && $scope.initLock)) {
          return;
        }

        if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
          $scope.completing = true;
          $scope.searchFilter = $scope.searchParam;
          $scope.selectedIndex = -1;
        }

        // function thats passed to on-type attribute gets executed
        if($scope.onType)
          $scope.onType($scope.searchParam);
      });

      // for hovering over suggestions
      this.preSelect = function(suggestion){

        watching = false;

        // this line determines if it is shown
        // in the input field before it's selected:
        //$scope.searchParam = suggestion;

        $scope.$apply();
        watching = true;

      };

      $scope.preSelect = this.preSelect;

      this.preSelectOff = function(){
        watching = true;
      };

      $scope.preSelectOff = this.preSelectOff;

      // selecting a suggestion with RIGHT ARROW or ENTER
      $scope.select = function(suggestion){
        if(suggestion){
          $scope.searchParam = suggestion.text;
          $scope.searchFilter = suggestion.text;
          if($scope.onSelect)
            $scope.onSelect(suggestion.data);
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){watching = true;},1000);
        $scope.setIndex(-1);
      };

      //Default render function will just output the input string:
      if(typeof $scope.render !== 'function'){
        $scope.render = function(suggestion){
          if(typeof suggestion !== 'string'){ //User is trying to store objects instead of strings, so the function should be already defined by the user and binded in the `render` attribute
            console.error('render function must be defined when using data object suggestions');
            return '';
          }
          return suggestion;
        };
      }

      /*
      $scope.getUniqueId = function(){
        var alphabet = 'abcdefghikjlmnopqrstuvwzyx0123456789';
        return alphabet.split('').shuffle().slice(-12).join('');
      };*/

      //Every time the suggestions collection changes, it will wrap the elements into the wrappedSuggestions:
      $scope.wrappedSuggestions = [];
      $scope.$watchCollection('suggestions', function(newSuggestions){
        if(newSuggestions instanceof Array){
          $scope.wrappedSuggestions = newSuggestions.map(function(suggestion){
            return {
              text: $scope.render(suggestion),
              data: suggestion
            };
          });
          console.log('wrappedSuggestions defined');
        }
      });

    }],
    link: function(scope, element, attrs){

      setTimeout(function() {
        scope.initLock = false;
        scope.$apply();
      }, 250);

      var attr = '';

      // Default atts
      scope.attrs = {
        "placeholder": "start typing...",
        "class": "",
        "id": "",
        "inputclass": "",
        "inputid": ""
      };

      for (var a in attrs) {
        attr = a.replace('attr', '').toLowerCase();
        // add attribute overriding defaults
        // and preventing duplication
        if (a.indexOf('attr') === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }

      if (attrs.clickActivation) {
        element[0].onclick = function(e){
          if(!scope.searchParam){
            setTimeout(function() {
              scope.completing = true;
              scope.$apply();
            }, 200);
          }
        };
      }

      var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

      document.addEventListener("keydown", function(e){
        var keycode = e.keyCode || e.which;

        switch (keycode){
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
        }
      }, true);

      document.addEventListener("blur", function(e){
        // disable suggestions on blur
        // we do a timeout to prevent hiding it before a click event is registered
        setTimeout(function() {
          scope.select();
          scope.setIndex(-1);
          scope.$apply();
        }, 150);
      }, true);

      element[0].addEventListener("keydown",function (e){
        var keycode = e.keyCode || e.which;

        var l = angular.element(this).find('li').length;

        // this allows submitting forms by pressing Enter in the autocompleted field
        if(!scope.completing || l == 0) return;

        // implementation of the up and down movement in the list of suggestions
        switch (keycode){
          case key.up:

            index = scope.getIndex()-1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              break;
            }
            scope.setIndex(index);

            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            scope.$apply();

            break;
          case key.down:
            index = scope.getIndex()+1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              scope.$apply();
              break;
            }
            scope.setIndex(index);

            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            break;
          case key.left:
            break;
          case key.right:
          case key.enter:
          case key.tab:

            index = scope.getIndex();
            // scope.preSelectOff();
            if(index !== -1) {
              scope.select(angular.element(angular.element(this).find('li')[index]).text());
              if(keycode == key.enter) {
                e.preventDefault();
              }
            } else {
              if(keycode == key.enter) {
                scope.select();
              }
            }
            scope.setIndex(-1);
            scope.$apply();

            break;
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }

      });
    },
    template: '\
        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"\
            ng-required="{{ autocompleteRequired }}" />\
          <ul ng-show="completing && (wrappedSuggestions | myFilter:searchFilter).length > 0">\
            <li\
              suggestion\
              ng-repeat="wrappedSuggestion in wrappedSuggestions | myFilter:searchFilter | orderBy:\'text\' track by $index"\
              index="{{ $index }}"\
              val="{{ wrappedSuggestion.text }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(wrappedSuggestion)"\
              ng-bind-html="wrappedSuggestion.text | highlight:searchParam"></li>\
          </ul>\
        </div>'
  };
});


app.filter('myFilter', function($filter){
  return function(wrappedSuggestions, searchFilter){
    if(wrappedSuggestions instanceof Array){
      searchFilter = searchFilter || '';
      return wrappedSuggestions.filter(function(wrappedSuggestion){
        var escapeRegexp = function(text) {
          return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };
        var words = searchFilter.replace(/\ +/g, ' ').split(/\ /g);
        var escapedWords = words.map(escapeRegexp); //Make sure non alphanumeric characters are escaped properly before constructing the regexp
        //It will detect if all the words of the search are present in the suggestion, no matter the order, nor the case:
        var pattern = '';
        escapedWords.forEach(function(escapedWord){
          pattern += '(?=.*'+escapedWord+')';
        });
        var rePattern = new RegExp(pattern, 'gi');
        var suggestion = wrappedSuggestion.text;
        return rePattern.test(suggestion);
      });
    }
  };
});


app.filter('highlight', ['$sce', function ($sce) {
  return function (input, searchParam) {
    if (typeof input === 'function') return '';
    if (searchParam) {
      //Hightlight the words or semiwords that are present in both the search and the suggestion:
      var escapeRegexp = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      };
      var words = searchParam.replace(/\ +/g, ' ').split(/\ /g);
      var escapedWords = words.map(escapeRegexp); //Make sure non alphanumeric characters are escaped properly before constructing the regexp
      escapedWords.forEach(function(escapedWord){
        var wordPattern = '(?!<span[^>]*?>)('+escapedWord+')(?![^<]*?<\/span>)'; //Match the escapedWord only if it's not already wrapped within span tags
        var wordRegexp = new RegExp(wordPattern, 'gi');
        input = input.replace(wordRegexp, "<span class=\"highlight\">$1</span>");
      });
    }
    return $sce.trustAsHtml(input);
  };
}]);

app.directive('suggestion', function(){
  return {
    restrict: 'A',
    require: '^autocomplete', // ^look for controller on parents element
    link: function(scope, element, attrs, autoCtrl){
      element.bind('mouseenter', function() {
        autoCtrl.preSelect(attrs.val);
        autoCtrl.setIndex(attrs.index);
      });

      element.bind('mouseleave', function() {
        autoCtrl.preSelectOff();
      });
    }
  };
});
