var constants = new (function() {
  var rows = 3;
  var cols = 6;
  var Match = (rows * cols) / 2;
  this.getRows = function() { return rows; };
  this.getColumns = function() { return cols; };
  this.getNumMatches = function() { return Match; };
})();
var	currentSessionOpen = false;
var	previousCard = null;
var numPairs = 0;
function createDeck() {
var rows = constants.getRows();
var cols = constants.getColumns();
var key = createRandom();
var deck = {};
deck.rows = [];
for(var i = 0; i < rows; i++) {
  var row = {};
  row.cards = [];
  for (var j = 0; j < cols; j++) {
    var card = {};
    card.isFaceUp = false;
    card.item = key.pop();
    row.cards.push(card);
  }
  deck.rows.push(row);
}
return deck;
}
function removeByIndex(arr, index) {
  arr.splice(index, 1);
}
function insertByIndex(arr, index, item) {
arr.splice(index, 0, item);
}
function createRandom() {
var matches = constants.getNumMatches();
var pool = [];
var answers = [];
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'
        , 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'
        , 'S', 'T', 'U', 'W', 'X', 'Y', 'Z'];
var items = letters;
for (var i = 0; i < matches * 2; i++) {
  pool.push(i);
}
for (var n = 0; n < matches; n++) {
  var randLetter = Math.floor((Math.random() * items.length));
  var letter = items[randLetter];
  removeByIndex(items, randLetter);
  var randPool = Math.floor((Math.random() * pool.length));
  insertByIndex(answers, pool[randPool], letter);
  removeByIndex(pool, randPool);
  randPool = Math.floor((Math.random() * pool.length));
  insertByIndex(answers, pool[randPool], letter);
  removeByIndex(pool, randPool);
}
return answers;
} 
var app = angular.module('cards', ['ngAnimate']);
app.controller("CardController", function($scope, $timeout) {
$scope.deck = createDeck();
$scope.isGuarding = true;
$scope.inGame = false;
$scope.check = function(card) {
  if (currentSessionOpen && previousCard != card && previousCard.item == card.item && !card.isFaceUp) {
    card.isFaceUp = true;
    previousCard = null;
    currentSessionOpen = false;
    numPairs++;
  } else if(currentSessionOpen && previousCard != card && previousCard.item != card.item && !card.isFaceUp) {
    $scope.isGuarding = true;
    card.isFaceUp = true;
    currentSessionOpen = false;			
    $timeout(function() {
      previousCard.isFaceUp = card.isFaceUp = false;
      previousCard = null;
      $scope.isGuarding = $scope.timeLimit ? false : true;
    }, 1000);
  } else {
    card.isFaceUp = true;
    currentSessionOpen = true;
    previousCard = card;
  }	
  if (numPairs == constants.getNumMatches()) {
    $scope.stopTimer();
  }
}
$scope.timeLimit = 60000;
$scope.isCritical = false;
var timer = null;
$scope.start = function(){
  $scope.deck = createDeck();
  $scope.timeLimit = 60000;
  $scope.isGuarding = false;
  $scope.inGame = true;
  ($scope.startTimer =function() {
    $scope.timeLimit -= 1000;
    $scope.isCritical = $scope.timeLimit <= 10000 ? true : false;
    timer = $timeout($scope.startTimer, 1000);
    if ($scope.timeLimit === 0) {
      $scope.stopTimer();
      $scope.isGuarding = true;
    }
  })();
}
$scope.stopTimer = function() {
  $timeout.cancel(timer);
  $scope.inGame = false;
  previousCard = null;
  currentSessionOpen = false;
  numPairs = 0;
}
}); 

