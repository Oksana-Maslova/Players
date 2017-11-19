let app = angular.module('app', []);

app.controller('playersCtrl', function($scope, $http) {
    $http.get('./players.json').then(function(response) {
    $scope.players = response.data;
    });
});


app.filter('searchPlayers', function(){
    return function(sourceArray, searchString) {
        if (!searchString) {
            return sourceArray;
        }

        let result = sourceArray;
        searchString.split(' ').forEach(function (keyword) {
            result = searchInArray(result, keyword);
        });
        return result;
    }
});


function searchInArray(sourceArray, searchString) {
    let result = [];

    if (searchString[0] === '-' && searchString.length > 1) {
        result = sourceArray;
        let subArray = JSON.parse(JSON.stringify(result));
        let regExp = new RegExp(searchString.substring(1), "gi");
        subArray.forEach(function (item) {
            for(let key in item) {
                if (regExp.test(item[key])) {
                    let indexToDelete = result.map(function (i) {
                        return i.id
                    }).indexOf(item.id);
                    if (indexToDelete !== -1) {
                        result.splice(indexToDelete, 1);
                        break;
                    }
                }
            }
        });
    } else {
        sourceArray.forEach(function (item) {
            for(let key in item){
                let regExp = new RegExp(searchString, "gi");
                if (regExp.test(item[key])) {
                    result.push(item);
                    break;
                }
            }
        });
    }
    return result;
}