// © 2015 Lewis Hunt

// A responsive AngularJS VOD prototype with additive/subtractive custom filters and sorts on 1000+ items 

var app = angular.module('video-library', ['checklist-model', 'infinite-scroll']);

app.controller('MainCtrl', ['videos', '$scope', function(videos, $scope) {
 		
 	// get list of video data from factory service videos.js
	$scope.list = videos.getAll();
	
	$scope.dateOptions = [
		{label:'Yesterday', value:1, checked:false},
		{label:'Last Week', value:7, checked:false},
		{label:'Last Month', value:30, checked:false}
		//{label:'Custom Date Range', value:-1, checked:false}
	];

	$scope.tags = _.chain($scope.list).map("tag").uniq().sortBy().value();
	
	$scope.names = _.chain($scope.list).map("name").uniq().sortBy().value();
	
	$scope.teams = _.chain($scope.list).map("team").uniq().sortBy().value();

	$scope.search = {predicate:'date', keyword:'', favorite:[], tag:[], name:[], team:[], dateOption:0, dateLabel:'', startDate: new Date('October 13, 2015'), endDate: new Date('October 27, 2015')};
	
	$scope.storedPredicateOrder = 'date';
	$scope.reverse = true;
	
	$scope.limit = 100;
	
	$scope.increaseLimit = function(){
		$scope.limit = $scope.limit + 50;
		//console.log('increaseLimit');
	};
	
	$scope.resetLimitScrollTop = function(){
		/*
		resetPopupSize();
		$scope.limit = 100;
		angular.element(".main-content").scrollTop(0);
		*/
		
		setTimeout(function () {
			$scope.$apply(function () {
				resetPopupSize();
				$scope.limit = 100;
				angular.element(".main-content").scrollTop(0);
			});
		}, 10);
		
		
	};
	
	$scope.clearAllFilters = function(){
		$scope.search={predicate:'date', keyword:'', favorite:[], tag:[], name:[], team:[], dateOption:0, dateLabel:'', startDate:$scope.search.startDate, endDate:$scope.search.endDate};
		
		$scope.storedPredicateOrder = 'date';
		$scope.reverse = true;
		$scope.resetDateOptions('all');
		angular.element(".main-content").scrollTop(0);
		angular.element("#accordion").scrollTop(0);
		
	};
	
	$scope.resetDateOptions = function(currentIndex){	
	
		angular.forEach($scope.dateOptions, function (item) {
            item.checked = false;
        });
        
        // if we are not de-selecting the current item then update value
        if (currentIndex!='all' && $scope.search.dateOption != $scope.dateOptions[currentIndex].value)  {
        	$scope.updateDateRange(currentIndex);
        }
        else  {
        	$scope.search.dateOption = 0;
        	$scope.search.dateLabel = '';
        }		
	}; 
	
	$scope.updateDateRange = function(currentIndex){	
	
	    $scope.dateOptions[currentIndex].checked = true;
	    
        $scope.search.dateOption = $scope.dateOptions[currentIndex].value;
        $scope.search.dateLabel = $scope.dateOptions[currentIndex].label;
        
		$scope.search.endDate = new Date();
		$scope.search.startDate = new Date();
		$scope.search.startDate.setDate($scope.search.startDate.getDate() - ($scope.search.dateOption+1) );
         
	};
	
	$scope.order = function(reverse) {
		$scope.reverse = ($scope.search.predicate === $scope.storedPredicateOrder) ? !$scope.reverse : reverse;
		$scope.storedPredicateOrder = $scope.search.predicate;
		angular.element(".main-content").scrollTop(0);
	};
	 
  
}]);

app.filter("customFilter", function() {

  return function (input,search, myType) {
    var out = [];

    if (search && search[myType] && search[myType].length > 0) {

      angular.forEach(input,function (e) {

        if (search[myType].indexOf(e[myType])>=0) {
          out.push(e);
        }
      }) 
           
    } else {
      out = input;
    }
  return out;
  };
})


app.filter('dateFilter', function ()
{
  return function(input, start_date, end_date, dateOption)
	{
		var out = [];
		
		
		var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
		var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date();

		if (input && input.length > 0 && dateOption!=0)
		{
			angular.forEach(input,function (e) {
			
				// date from data-set can be date string or epoch timestamp in milliseconds
				var inputDate = (!isNaN(e.date)) ? e.date : Date.parse(e.date);
				
				if (inputDate >= start_date && inputDate <= end_date)
				{
					out.push(e);
				}
			});

			return out;
		}
		else return input;
	};
});


// some jquery for css dom manipulation
$(document).ready(function(){

	resetPopupSize();

	$(window).resize(function() {
	  resetPopupSize();
	});
	
	// scroll to refresh emmulator in chrome
	$(".main-content").scrollTop(1);
	$(".main-content").scrollTop(0);
	
	$(".input-keyword").on('input', function() {
		if ($(this).val().length>0) $('.input-keyword-div').addClass('input-keyword-div-highlight');
		else $('.input-keyword-div').removeClass('input-keyword-div-highlight');
		$(".main-content").scrollTop(0);
	}); 
	
	$('input[type=search]').on('search', function () {
		$('.input-keyword-div').removeClass('input-keyword-div-highlight');
	});
	
	$('#clear-all-button').on('click', function () {
		$('.input-keyword-div').removeClass('input-keyword-div-highlight');
	});	
	
	
});

function resetPopupSize() {
	var contentCoverHeight = $(".content-cover").height();
	var maxPopUpHeight = contentCoverHeight - 95;
	$('#accordion.scrollable').css('max-height', maxPopUpHeight + 'px');
}

  
  
  
