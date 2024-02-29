let proverbsJSON = {
    "sport": [
        "sport 1",
        "sport 2",
        "sport 3"
    ],
    "coinnego": [
        "coinnego 1",
        "coinnego 2",
        "coinnego  3"
    ]
};

/* GAME WINDOW MANAGEMENT TOOLS AND ENTITIES */

class GameWindow {
    #gameWindow = undefined;

    #proverbContainer = undefined;
    #proverbs = new Proverbs(proverbsJSON);

    #category = undefined;

    playersStats = undefined;

    constructor(){
        this.#gameWindow = window.open("", "myWindow", "width=500,height=300");
        this.#gameWindow.document.write(
            `<!DOCTYPE html>
            <html lang="pl-PL">
            <head>
            <link rel="stylesheet" type="text/css" href="styles.css">
            </head>
            <body>
            </body>`
        );
        this.playersStats = new PlayersStats(this.#gameWindow.document.body);
        this.#proverbContainer = new ProverbContainer(this.#gameWindow.document.body);
        this.#category = new Category(this.#gameWindow.document.body);
    }

    get get(){
        return this.#gameWindow;
    }

    setActive(letter){
        return this.#proverbContainer.setActive(letter);
    }

    getFlippedLetters(){
        return this.#proverbContainer.flipped;
    }

    flip(letter){
        return this.#proverbContainer.setActive(letter);
    }

    nextProverb(){
        console.log("nextProverb");

        this.#proverbs.next();
        this.#proverbContainer.newProverb(this.#proverbs.proverbString);
        this.#category.setCategory(this.#proverbs.proverbCategory);
    }

}

class Category {
    #htmlElement = undefined;

    constructor(containerElement){
        containerElement.appendChild(this.#createElement);
        this.#htmlElement = containerElement.getElementsByClassName('category')[0];
    }

    setCategory(category){
        console.log("category", category);
        this.#htmlElement.textContent = category;
    }

    get #createElement(){
        let container = document.createElement("div");
        container.classList.add("category");

        return container;
    }
}

class PlayersStats{
    #htmlElement = undefined;
    #players = undefined;

    #playersElements = {};

    constructor(containerElement){
        containerElement.appendChild(this.#createElement);
        this.#htmlElement = containerElement.getElementsByClassName('players-stats')[0];
    }

    //initialize - display first time
    display(){
        for(const player of this.#players.playersList){
            let playerStats = document.createElement('div');
            playerStats.classList.add('player-stats');

            let playerName = document.createElement('p');
            playerName.textContent = player['name'];
            playerStats.appendChild(playerName);

            let playerPoints = document.createElement('p');
            playerPoints.textContent = player['points'];
            playerStats.appendChild(playerPoints);

            let playerRoundPoints = document.createElement('p');
            playerRoundPoints.textContent = player['roundPoints'];
            playerStats.appendChild(playerRoundPoints);

            this.#htmlElement.appendChild(playerStats);
            this.#playersElements[player['name']] = playerStats;
        }
    }

    update(name, oldName = undefined){
        if (name !== oldName && oldName !== undefined) {
            Object.defineProperty(this.#playersElements, name,
                Object.getOwnPropertyDescriptor(this.#playersElements, oldName));
            delete this.#players[oldName];

            console.log("changed name");
        }
        /*let index = this.#players.index(name);
        let elem = this.#htmlElement.getElementsByClassName('player-stats')[index];*/
        let elem = this.#playersElements[name];
        elem.getElementsByTagName('p')[0].textContent = this.#players.find(name).name;
        elem.getElementsByTagName('p')[1].textContent = this.#players.find(name).points;
        elem.getElementsByTagName('p')[2].textContent = this.#players.find(name).roundPoints;
    }

    add(name){
        let player = this.#players.find(name);

        let playerStats = document.createElement('div');
        playerStats.classList.add('player-stats');

        let playerName = document.createElement('p');
        playerName.classList.add('player-name');
        playerName.textContent = player.name;
        playerStats.appendChild(playerName);

        let playerPoints = document.createElement('p');
        playerPoints.classList.add('player-points');
        playerPoints.textContent = player.points;
        playerStats.appendChild(playerPoints);

        let playerRoundPoints = document.createElement('p');
        playerRoundPoints.classList.add('player-round-points');
        playerRoundPoints.textContent = player.roundPoints;
        playerStats.appendChild(playerRoundPoints);

        this.#htmlElement.appendChild(playerStats);
        this.#playersElements[player.name] = playerStats;
    }

    delete(name){
        console.log(name, this.#playersElements);
        this.#playersElements[name].remove();
    }

    set players(playersObj){
        this.#players = playersObj;
        console.log(this.#players.playersList);
    }

    info(){
        console.log(this.#players.playersList);
    }

    get #createElement(){
        let container = document.createElement("div");
        container.classList.add("players-stats");

        return container;
    }
}

class ProverbContainer {
    #proverbContainer;
    #proverb = undefined;

    #countOfLetters = null;
    #flipped = 0;

    window = undefined;

    //element where to place in document
    constructor(containerElement) {
        containerElement.appendChild(ProverbContainer.#createElement);
        this.#proverbContainer = containerElement.getElementsByTagName('div')[1];

        //this.newProverb();
    }

    setActive(letter){
        this.#flipped = this.#proverb.setActive(letter);
        return this.#flipped;
    }

    get flipped(){
        return this.#flipped;
    }

    newProverb(proverbString){
        this.#proverb = proverbString;
        this.#proverbContainer.textContent = '';
        this.#proverb.initialize(this.#proverbContainer);
        this.#countOfLetters = this.#proverb.countOfLetters;
        this.#flipped = 0;
    }

    static get #createElement(){
        let container = document.createElement('div');
        container.id = 'proverbContainer';
        return container;
    }
}

class Proverbs{
    #proverbsSet = {};

    #proverbString = null;
    #proverbCategory = null;

    constructor(jsonData){
        for(const [category_, provs_] of Object.entries(jsonData)){
            let provs = []
            for(const prov of provs_){
                provs.push(new Proverb(prov));
            }
            this.#proverbsSet[category_] = provs;
        }
    }

    static #randomIndex(arr){
        return Math.floor(Math.random() * arr.length);
    }

    get proverbString(){
        return this.#proverbString;
    }

    get proverbCategory(){
        console.log(this.#proverbCategory);
        return this.#proverbCategory;
    }

    next() {
        var size = Object.keys(this.#proverbsSet).length;
        if(size === 0){
            console.log("you have had run out of proverbs");
            return false;
        }

        let categories = Array.from(Object.keys(this.#proverbsSet));

        let randomCategoryIndex = Proverbs.#randomIndex(categories);
        let randomCategory = categories[randomCategoryIndex];
        

        let randomProverbIndex = Proverbs.#randomIndex(this.#proverbsSet[randomCategory]);
        let randomProverb = this.#proverbsSet[randomCategory][randomProverbIndex];

        //remove used proverb
        this.#proverbsSet[randomCategory].splice(randomProverbIndex, 1); // 2nd parameter means remove one item only

        if(this.#proverbsSet[randomCategory].length === 0) {
            delete this.#proverbsSet[randomCategory];
        }
        
        this.#proverbString = randomProverb;
        this.#proverbCategory = randomCategory;

        return true;
    }
}

class Proverb {

    #letters = [];
    #proverbContainer = undefined;
    #countOfLetters = 0;

    #allowedLetters = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPRSŚTUWYZŹŻ';

    constructor(lettersString){
        let id = 0;
        for(const letter of lettersString){
            if(this.#allowedLetters.search(letter) != -1){
                this.#letters.push(new Letter(letter, id));
                this.#countOfLetters++;
            }else{
                this.#letters.push(new Tile(letter));
            }
            id++;
        }
    }

    initialize(proverbContainer){
        this.#proverbContainer = proverbContainer;
        for(let i = 0; i < this.#letters.length; i++){
            this.#letters[i].initialize(proverbContainer);
            //this.#letters[i].flip();
        }
    }

    setActive(letter){
        let count = 0;
        for(let i = 0; i < this.#letters.length; i++){
            //this.#letters[i].flip();
            if(this.#letters[i].content == letter && !this.#letters[i].flipped){
                this.#letters[i].flip();
                count++;
            }
        }
        return count;
    }

    get countOfLetters(){
        return this.#countOfLetters;
    }
}

class Tile {
    #content = '';

    constructor(char){
        this.#content = char;
    }

    initialize(container){
        container.appendChild(this.#createElement);
    }

    get #createElement(){
        let tile = document.createElement('div');
        tile.classList.add('tile');
        let content = document.createElement('p');
        content.textContent = this.#content;
        tile.appendChild(content);
        return tile;
    }

    get content(){
        return this.#content;
    }
}

class Letter extends Tile {
    #id = undefined;
    #letter = undefined;
    #contentElem = undefined;
    #flipped = false;

    constructor(letterChar, id){
        super(letterChar);
        this.#id = id;
    }

    initialize(proverbContainer){
        proverbContainer.appendChild(this.#createElement);

        this.#letter = proverbContainer.getElementsByClassName('letter')[this.#id];
        this.#contentElem = this.#letter.getElementsByTagName('p')[0];
    }

    flip(){

        this.#contentElem.textContent = this.content;
        this.#letter.classList.add('flipped');
        this.#flipped = true;
    }

    get flipped(){
        return this.#flipped;
    }

    get #createElement(){
        let tile = document.createElement('div');
        tile.classList.add('letter');
        let content = document.createElement('p');
        tile.appendChild(content);
        return tile;
    }
}

class Button {
    #disabled = false;
    #button = undefined;

    constructor(htmlElement){
        this.#button = htmlElement;
    }

    //get html element
    get get(){
        return this.#button;
    }

    get button(){
        return this.#button;
    }

    get disabled(){
        return this.#disabled;
    }

    disable(){
        this.#disabled = true;
        this.get.disabled = true;
    }

    enable(){
        this.#disabled = false;
        this.get.disabled = false;
    }
}

class ChooseLetterButton extends Button {
    value = null;
    #disabled = false;

    constructor(onSubmit){
        super(document.getElementById('getLetter'));
        this.get.addEventListener("submit", (e)=>{
            e.preventDefault();
            this.value = this.get.elements['getLetter'].value;
            console.log(this.get.elements["getLetter"].value);

            onSubmit();
            this.get.elements["getLetter"].value = '';
        });
    }

    set disabled(bollean){
        var elements = this.get.elements;
        for (var i = 0, len = elements.length; i < len; ++i) {
            elements[i].disabled = bollean;
        }
    }

    static get createElement(){
        let form = document.createElement('form');
        form.id = 'getLetter';

        let div1 = document.createElement('div');
        let label = document.createElement('label');
        label.textContent = 'type letter';
        div1.appendChild(label);
        form.appendChild(div1);

        let div2 = document.createElement('div');
        let input = document.createElement('input');
        input.setAttribute('name', 'getLetter');
        input.type='text';
        div2.appendChild(input);
        form.appendChild(div2);

        let submit = document.createElement("button");
        submit.textContent = 'Ok';
        form.appendChild(submit);

        return form;
    }
}

class SetWheelValueButton extends Button{
    static #actualValue = null;
    value = null;

    constructor(onSubmit = ()=>{}){
        super(document.getElementById("setWheel"));

        this.get.addEventListener("submit", (e)=>{
            e.preventDefault();
            this.value = parseInt(this.get.elements["typeWheelValue"].value);
            console.log(this.get.elements["typeWheelValue"].value);

            onSubmit();
            //this.get.elements["typeWheelValue"].value = '';
        });
    }

    set disabled(bollean){
        var elements = this.get.elements;
        for (var i = 0, len = elements.length; i < len; ++i) {
            elements[i].disabled = bollean;
        }
    }

    /*get value(){
        return 
    }*/

    static get createElement(){
        let form = document.createElement('form');
        form.id = 'setWheel';

        let div1 = document.createElement('div');
        let label = document.createElement('label');
        label.textContent = 'type number';
        div1.appendChild(label);
        form.appendChild(div1);

        let div2 = document.createElement('div');
        let input = document.createElement('input');
        input.setAttribute('name', 'typeWheelValue');
        input.type='number';
        div2.appendChild(input);
        form.appendChild(div2);

        let submit = document.createElement("button");
        submit.textContent = 'Ok';
        form.appendChild(submit);

        return form;
    }
}



/* PLAYER MANAGEMET UI */

class Player {
    name = undefined;
    points = 0;
    roundPoints = null;

    constructor(name, points, roundPoints = 0){
    	this.name = name;
        this.points = points;
        this.roundPoints = roundPoints;
    }
}

class Players {
    #players = {};

    constructor(){
    }

    add(name, points = 0, roundPoints = 0){
        this.#players[name] = new Player(name, points, roundPoints);
        //console.log(this.#players);
    }

    //todo: delete

    find(name){
        //console.log(this.#players);
        return this.#players[name];//.find(player => player.name = name);
    }

    index(name){
        return Object.keys(this.#players).findIndex(key => key == name);
    }

    changeName(name, newName = undefined){
        if(newName != undefined){
            this.#players[name].name = newName;
            if (name !== newName) {
                Object.defineProperty(this.#players, newName,
                    Object.getOwnPropertyDescriptor(this.#players, name));
                delete this.#players[name];
            }
        }
    }

    changePoints(name, points = undefined){
        if(points != undefined){
            //console.log(this.#players, name);
            this.#players[name].points = points;
        }
    }

    changeRoundPoints(name, points){
        this.#players[name].roundPoints = points;
    }

    get playersList(){
        //console.log(Object.values(this.#players));
        return Object.values(this.#players);
    }

    get names(){
        return Object.keys(this.#players);
    }
}

//players manager and simple ui for changing properties
class PlayerPicker {
    #htmlElement = undefined;
    #playersList = undefined;

    constructor(playersList, onchange = ()=>{}){
        this.#playersList = playersList;
        this.#htmlElement = document.getElementById('players');
        this.#htmlElement.addEventListener('change', function() {
            onchange();
          });
    }

    get value(){
        //if(this.#htmlElement.options[this.#htmlElement.selectedIndex].text === 'new'){
        //    return 'new';
        //}
        return this.#htmlElement.value;
    }
    set value(name){
        this.#htmlElement.value = name;
    }

    set selected(name){
        this.#htmlElement.value = name;
    }
    get selected(){
        return this.#htmlElement.value;
    }

    addPlayer(name){
        let option = document.createElement('option');
        option.text = name;
        option.value = name;
        this.#htmlElement.appendChild(option);

        this.#htmlElement.appendChild(option);

        this.#htmlElement.value = name;
    }

    deleteSelectedPlayer(){
        this.#htmlElement.options[this.#htmlElement.selectedIndex].remove();
    }

    changeName(newName){
        this.#htmlElement.options[this.#htmlElement.selectedIndex].text = newName;
        this.#htmlElement.options[this.#htmlElement.selectedIndex].value = newName;
    }

    static createElement(playersList){
        let select = document.createElement('select');
        select.id = 'players';

        let optionNew = document.createElement('option');
        optionNew.text = 'new';
        optionNew.value = 'new';
        select.appendChild(optionNew);

        let index = 0;
        if(playersList != undefined){
            for(let player of playersList){
                let option = document.createElement('option');
                option.text = player.name;
                option.value = player.name;
                select.appendChild(option);
    
                index++;
            }
        }
        

        return select;
    }
}

//name, points, roundPoints
class PlayerDataPicker {
    #htmlElement = undefined;

    #name = '';
    #points = null;
    #roundPoints = null;

    #onSubmit= undefined;

    constructor(onSumbit = ()=>{console.log("PlayerDataPicker submit event")}){
        this.#htmlElement = document.getElementById('playerData');

        this.#onSubmit = onSumbit;

        this.disabledInputRoundPoints = false;

        this.#htmlElement.addEventListener("submit", (e)=>{
            e.preventDefault();
            this.submit();
        });
    }

    submit(){
        this.#name = this.#htmlElement.elements['playerName'].value;

        let points = parseInt(this.#htmlElement.elements['playerPoints'].value);
        if(isNaN(points)){
            this.#points = 0;
            this.points = 0;
        }else{
            this.#points = points;
        }

        let roundPoints = parseInt(this.#htmlElement.elements['playerRoundPoints'].value);
        if(isNaN(roundPoints)){
            this.#roundPoints = 0;
            this.roundPoints = 0;
        }else{
            this.#roundPoints = roundPoints;
        }

        this.#onSubmit();
    }

    get name(){
        return this.#htmlElement.elements['playerName'].value;
    }
    set name(name){
        this.#htmlElement.elements['playerName'].value = name;
    }

    get points(){
        return parseInt(this.#htmlElement.elements['playerPoints'].value);
    }
    set points(points){
        this.#htmlElement.elements['playerPoints'].value = points;
    }

    get roundPoints(){
        return parseInt(this.#htmlElement.elements['playerRoundPoints'].value);
    }
    set roundPoints(points){
        this.#htmlElement.elements['playerRoundPoints'].value = points;
    }

    get disabledInputRoundPoints(){
        return this.#htmlElement.elements['playerRoundPoints'].disabled;
    }
    set disabledInputRoundPoints(boolean){
        this.#htmlElement.elements['playerRoundPoints'].disabled = boolean;
    }

    static get createElement(){
        let form = document.createElement('form');
        form.id = 'playerData';

        let inputElement = document.createElement('div');
        let label = document.createElement('label');
        label.textContent = 'player name';
        inputElement.appendChild(label);
        let input = document.createElement('input');
        input.setAttribute('name', 'playerName');
        input.type='text';
        inputElement.appendChild(input);
        form.appendChild(inputElement);

        let playerPoints = document.createElement('div');
        let labelPlayerPoints = document.createElement('label');
        labelPlayerPoints.textContent = 'player points, type number';
        playerPoints.appendChild(labelPlayerPoints);
        let inputPlayerPoints = document.createElement('input');
        inputPlayerPoints.setAttribute('name', 'playerPoints');
        inputPlayerPoints.type='number';
        playerPoints.appendChild(inputPlayerPoints);
        form.appendChild(playerPoints);

        let playerRoundPoints = document.createElement('div');
        let labelPlayerRoundPoints = document.createElement('label');
        labelPlayerRoundPoints.textContent = 'player round points, type number';
        playerRoundPoints.appendChild(labelPlayerRoundPoints);
        let inputPlayerRoundPoints = document.createElement('input');
        inputPlayerRoundPoints.setAttribute('name', 'playerRoundPoints');
        inputPlayerRoundPoints.type='number';
        playerRoundPoints.appendChild(inputPlayerRoundPoints);
        form.appendChild(playerRoundPoints);

        let submit = document.createElement("button");
        submit.textContent = 'Ok';
        form.appendChild(submit);

        //console.log(form);
        return form;
    }
}

class PlayerDeleteButton extends Button{
    //#disabled = false;

    constructor(onClick){
        super(document.getElementById('deletePlayer'));
        this.disable();
        this.get.addEventListener('click', ()=>{
            if(!this.disabled){
                onClick();
            }
        });
    }

    static get createElement(){
        let button = document.createElement('button');
        button.id = 'deletePlayer';
        button.textContent = 'delete';

        return button;
    }
}

class PlayerManagerUI {
    #players = undefined;

    #playerPicker = undefined;
    playerDataPicker = undefined;

    #playerDeleteButton = undefined;

    #onPlayerSelect = ()=>{};
    #onPlayerUpdate = ()=>{};
    #onAddPlayer = ()=>{};
    #onDeletePlayer = ()=>{};

    //obejects passed by reference?
    constructor(container, players){
        //this.#players = new Players();
        this.#players = players;

        //create html elements for UI
        let playerManagementDiv = document.createElement("div");
        playerManagementDiv.classList.add("player-management");

        playerManagementDiv.appendChild(PlayerPicker.createElement(this.#players.playersList));
        playerManagementDiv.appendChild(PlayerDataPicker.createElement);
        playerManagementDiv.appendChild(PlayerDeleteButton.createElement);

        container.appendChild(playerManagementDiv);

        this.#playerPicker = new PlayerPicker(this.#players.playersList, ()=>{
            if(this.#playerPicker.value === 'new'){
                this.#playerDeleteButton.disable();
                //this.playerDataPicker.disabledInputRoundPoints = true;
                this.playerDataPicker.name = '';
                this.playerDataPicker.points = '';
                this.playerDataPicker.roundPoints = '';
            }else{
                this.#playerDeleteButton.enable();
                //this.playerDataPicker.disabledInputRoundPoints = false;
                this.playerDataPicker.name = this.#playerPicker.value;
                this.playerDataPicker.points = this.#players.find(this.#playerPicker.value).points;
                this.playerDataPicker.roundPoints = this.#players.find(this.#playerPicker.value).roundPoints;

                //run only on select, not while creating new player
                this.#onPlayerSelect(this.#playerPicker.value);
            }
        });

        this.playerDataPicker = new PlayerDataPicker(()=>{
            //console.log(this.#playerPicker.value, this.playerDataPicker.name, this.playerDataPicker.points);
            if(this.#playerPicker.value === 'new'){
                this.#playerDeleteButton.enable();
                //this.playerDataPicker.disabledInputRoundPoints = false;
                this.#playerPicker.addPlayer(this.playerDataPicker.name);
                this.#players.add(this.playerDataPicker.name, this.playerDataPicker.points, this.playerDataPicker.roundPoints);

                this.#onAddPlayer(this.#playerPicker.value);
            }else{
                let oldName = this.#playerPicker.value;
                //console.log(this.#playerPicker.value, this.playerDataPicker.name);

                //need this precedence, or use this.playerDataPicker.name exept this.#playerPicker.value
                this.#players.changeName(this.#playerPicker.value, this.playerDataPicker.name);
                this.#playerPicker.changeName(this.playerDataPicker.name);

                this.#players.changePoints(this.#playerPicker.value, this.playerDataPicker.points);
                this.#players.changeRoundPoints(this.#playerPicker.value, this.playerDataPicker.roundPoints);

                this.#onPlayerUpdate(this.#playerPicker.value, oldName);
            }
        });

        this.#playerDeleteButton = new PlayerDeleteButton(()=>{
            if(this.#playerPicker.value === 'new'){
                return;
            }
            this.#onDeletePlayer(this.#playerPicker.value);

            this.#playerPicker.deleteSelectedPlayer();
            this.#playerPicker.selected = 'new';
            this.playerDataPicker.name = '';
            this.playerDataPicker.points = '';
            this.playerDataPicker.roundPoints = '';
        });
    }

    set onPlayerSelect(fun){
        this.#onPlayerSelect = fun;
    }

    set onPlayerUpdate(fun){
        this.#onPlayerUpdate = fun;
    }

    set onAddPlayer(fun){
        this.#onAddPlayer = fun;
    }

    set onDeletePlayer(fun){
        this.#onDeletePlayer = fun;
    }
}

class NextProverbButton extends Button {
    constructor(container, onClick){
        super(NextProverbButton.createElement);
        container.appendChild(this.button);
        this.button.addEventListener('click', ()=>{onClick()});
    }

    static get createElement(){
        let button = document.createElement('button');
        button.textContent = "Następne hasło";
        return button;
    }
}


/* GAME */

//Game manager and button for changing state of game (rounds)
class Game {
    //you must start game to have round (of this game)
	#round = undefined;
    #roundNumber = 1;
    //actual state of game
    //#state = 'init';
    #gameWindow = undefined;

    //players
    #players = undefined;
    #playerManagerUI = undefined;
    
    #chooseLetterButton = undefined;
    #setWheelValueButton = undefined;

    constructor(container){
        this.#players = new Players();
        this.#playerManagerUI = new PlayerManagerUI(container, this.#players);

        this.#gameWindow = new GameWindow();
        this.#gameWindow.playersStats.players = this.#players;
        this.#gameWindow.playersStats.display();
        //this.#gameWindow.playersStats.players = 
        //using default values in constructor to indicate that game is starting
        //this.#round = new Round(this.#gameWindow, this.#playerManagerUI);

        container.appendChild(ChooseLetterButton.createElement);
        container.appendChild(SetWheelValueButton.createElement);

        this.#playerManagerUI.onPlayerSelect = (name)=>{
            //console.log(name);
            this.#chooseLetterButton.disabled = false;
            this.#setWheelValueButton.disabled = false;
        };

        this.#playerManagerUI.onPlayerUpdate = (name, oldName)=>{
            //console.log(name, oldName);
            this.#gameWindow.playersStats.update(name, oldName);
        }

        this.#playerManagerUI.onAddPlayer = (name)=>{
            this.#gameWindow.playersStats.add(name);
        }

        this.#playerManagerUI.onDeletePlayer = (name)=>{
            this.#gameWindow.playersStats.delete(name);
        }

        //set enabled round points
        //this.#playerManagerUI.disabledInputRoundPoints = false;

        this.#chooseLetterButton = new ChooseLetterButton(()=>{
            let points = this.#gameWindow.flip(this.#chooseLetterButton.value) * this.#setWheelValueButton.value;
            //console.log(this.#playerManagerUI.playerDataPicker.roundPoints, points);
            this.#playerManagerUI.playerDataPicker.roundPoints = this.#playerManagerUI.playerDataPicker.roundPoints + points;
            this.#playerManagerUI.playerDataPicker.submit();
        });
        //set disabled until player is picked
        //this.#chooseLetterButton.disabled = true;

        this.#setWheelValueButton = new SetWheelValueButton(()=>{
            //console.log(this.#setWheelValueButton.value)
        });
        //set disabled until player is picked
        //this.#setWheelValueButton.disabled = true;

        new NextProverbButton(container, ()=>{
            //add round points to points
            //1) in playerManagerUI
            this.#playerManagerUI.playerDataPicker.points += this.#playerManagerUI.playerDataPicker.roundPoints;
            this.#playerManagerUI.playerDataPicker.roundPoints = 0;
            //not sumbit form, beacuse we changes stats directly in players

            //2) change all players stats in players and in window
            for(const name of this.#players.names){
                this.#players.find(name).points += this.#players.find(name).roundPoints;
                this.#players.find(name).roundPoints = 0;

                this.#gameWindow.playersStats.update(name);
            }

            this.#gameWindow.nextProverb();
        });
    }
}

//game initialization
new Game(document.getElementById("container"));
