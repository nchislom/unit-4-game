/*
* Each character in the game has 3 attributes: `Health Points`, `Attack Power` and `Counter Attack Power`.

* Each time the player attacks, their character's Attack Power increases by its base Attack Power. 
  * For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
* The enemy character only has `Counter Attack Power`. 

  * Unlike the player's `Attack Points`, `Counter Attack Power` never changes.

* The `Health Points`, `Attack Power` and `Counter Attack Power` of each character must differ.

* No characters in the game can heal or recover Health Points. 

  * A winning player must pick their characters wisely by first fighting an enemy with low `Counter Attack Power`. This will allow them to grind `Attack Power` and to take on enemies before they lose all of their `Health Points`. Healing options would mess with this dynamic.

* Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.
*/


// Constructor for player/characters
function character(name, hp, ap, cp, img){
    this.charName = name;
    this.healthPoints = hp;
    this.attackPoints = ap;
    this.counterPoints = cp;
    this.imageName = img;
}

// Player declarations
var playableCharacters = {
    character0: new character("Cthulhu",        160, 50, 10, "assets/images/cthulhu.jpg"),
    character1: new character("Shoggoth",       175, 35, 13, "assets/images/shoggoth.jpg"),
    character2: new character("Mi-Go",          140, 40, 12, "assets/images/migo.jpg"),
    character3: new character("Yog-Sothoth",    205, 45, 5, "assets/images/yog-sothoth.jpg"),
    character4: new character("Azathoth",       170, 49, 12, "assets/images/azathoth.jpg"),
    character5: new character("Shub-Niggurath", 120, 47, 11, "assets/images/shub-niggurath.jpg")
}

var playerSelection, opponentSelection, cardSelection;
var playerHp, playerHpText, opponentHp, opponentHpText;

var resetGame = function(){
    location.reload();
}

var playGame = function(){
introScreen.css({"display": "none"});
gameScreen.css({"display": "static"});
}


$(document).ready(function() {
    // DOM Page Elements
    var introScreen = $("#intro-screen");
    var gameScreen = $("#game-screen");
    var winScreen = $("#win-screen");
    var lostScreen = $("#lost-screen");
    var directions = $(".directions");    

    // Hooking into empty DOM elements
    $(".character-0-name").text(playableCharacters.character0.charName);
    $(".character-0-hp").text(playableCharacters.character0.healthPoints);
    $("#img0").attr("src", playableCharacters.character0.imageName);

    $(".character-1-name").text(playableCharacters.character1.charName);
    $(".character-1-hp").text(playableCharacters.character1.healthPoints);
    $("#img1").attr("src", playableCharacters.character1.imageName);

    $(".character-2-name").text(playableCharacters.character2.charName);
    $(".character-2-hp").text(playableCharacters.character2.healthPoints);
    $("#img2").attr("src", playableCharacters.character2.imageName);

    $(".character-3-name").text(playableCharacters.character3.charName);
    $(".character-3-hp").text(playableCharacters.character3.healthPoints);
    $("#img3").attr("src", playableCharacters.character3.imageName);

    $(".character-4-name").text(playableCharacters.character4.charName);
    $(".character-4-hp").text(playableCharacters.character4.healthPoints);
    $("#img4").attr("src", playableCharacters.character4.imageName);

    $(".character-5-name").text(playableCharacters.character5.charName);
    $(".character-5-hp").text(playableCharacters.character5.healthPoints);
    $("#img5").attr("src", playableCharacters.character5.imageName);

    // Setup main game flow controls
    $(".play-button").on("click", function(){
        introScreen.css({"display": "none"});
        gameScreen.css({"display": "block"});
    });
    $(".reset-button").on("click", function(){
        location.reload();
    });
    
    directions.text("Choose a character...");

    // Character click handler logic
    $(".card").on("click", function(){
        
        // If player has not selected a character...
        if ($("#player-area").children().length === 0){

            // Hook into ID of card to change class attribute
            cardSelection = "#card" + $(this).attr("data");
            $(cardSelection).removeClass("col-2");
            $(cardSelection).addClass("col");

            // Move selection to player-area
            playerSelection = "character" + $(this).attr("data");
            playerHpText = ".character-" + $(this).attr("data") + "-hp";
            console.log(playerSelection);
            console.log(playerHpText);
            $(this).appendTo("#player-area");
            directions.text("Choose an opponent...");
    
        } else if ($("#opponent-area").children().length === 0){
            // If an opponent has not been selected

            // Hook into ID of card to change class attribute
            cardSelection = "#card" + $(this).attr("data");
            $(cardSelection).removeClass("col-2");
            $(cardSelection).addClass("col");

            // Move selection to opponent-area
            opponentSelection = "character" + $(this).attr("data");
            opponentHpText = ".character-" + $(this).attr("data") + "-hp";
            $(this).appendTo("#opponent-area");
            directions.text("FIGHT!!");
        }
    });

    $("#attack-button").on("click", function() {
        if( $("#opponent-area").children().length == 1){
            // Get current HP
            playerHp = playableCharacters[playerSelection].healthPoints;
            opponentHp = playableCharacters[opponentSelection].healthPoints;
            // Damage Calculation!
            playableCharacters[opponentSelection].healthPoints -= playableCharacters[playerSelection].attackPoints;
            playableCharacters[playerSelection].healthPoints -= playableCharacters[opponentSelection].counterPoints;
            gameResult();
        }
    });

    var gameResult = function(){
        // Update DOM
        console.log("Your current hp: " + playableCharacters[playerSelection].healthPoints);
        console.log("CPUs current hp: " + playableCharacters[opponentSelection].healthPoints);
        $(playerHpText).text(playerHp);
        $(opponentHpText).text(opponentHp);

        // Game Lost vs Round Won Vs Game Won (All Enemies Defeated)
        if(playableCharacters[playerSelection].healthPoints <= 0){
            gameScreen.css({"display": "none"});
            lostScreen.css({"display": "block"});
        
        } else if ( (playableCharacters[playerSelection].healthPoints > 0) &&
                    (playableCharacters[opponentSelection].healthPoints <= 0) &&
                    ( $("#character-selection").children().length) > 0 ) {
            $("#opponent-area").empty();
            playableCharacters[playerSelection].attackPoints += 15;
            directions.text("You won this round...Choose another opponent!");
    
        } else if ( (playableCharacters[opponentSelection].healthPoints > 0) &&
        ( $("#character-selection").children().length) <= 0 ) {
            $("#winner-pic").attr("src", playableCharacters[playerSelection].imageName);
            gameScreen.css({"display": "none"});
            winScreen.css({"display": "block"});
        }
    }


});