function Cell(posX,posY,letter,board) {
	this.letter = new PIXI.Text("*",{fontFamily : 'Helvetica', fontWeight:"bold", fontSize: Math.round(cellSize*0.7), fill : 0x000000})
    this.letter.anchor.set(0.5)
	this.sprite = new PIXI.Sprite(pixelText)
	this.sprite.width = this.sprite.height = cellSize
	this.sprite.tint = 0xffffff
	this.sprite.x = this.letter.x = posX
	this.sprite.y = this.letter.y = posY
    this.sprite.anchor.set(0.5)
    this.board = board
    this.changedSinceLastBoardState = false

    this.wordData = {across:"",down:"",candidates:{},invalid:false,definitions:{across:[],down:[]}}
    this.wordRootCells = {}

    this.sprite.interactive = true
    this.sprite.owner = this
    this.pos = {x:0,y:0}

    this.letter.alpha = 0   
    this.marker = new PIXI.Sprite(pixelText)
    this.marker.width = this.marker.height = cellSize
    this.marker.alpha = 0.4
    this.marker.visible = false
    this.marker.x = this.sprite.x
    this.marker.y = this.sprite.y
    this.marker.tint = 0xff0000
    this.marker.anchor = this.sprite.anchor

    this.length = {"across":undefined,"down":undefined}

    this.sprite.blank = function() {
        var equiv = this.owner.board.getCellEquivalent(this.owner.pos.x,this.owner.pos.y)
        this.tint = equiv.sprite.tint = 0x000000
        // console.log(this.owner.pos.x + "," + this.owner.pos.y)
    }

	board.container.addChild(this.sprite)
    board.container.addChild(this.marker)
    board.container.addChild(this.letter)

    this.sprite.on('pointerdown',function(){
        // console.log("cell " + this.owner.pos.x + "," + this.owner.pos.y + " - clue " + this.owner.label.text)
        // console.log(this.owner.wordData)
        // getWordData(this.owner.wordData.across)
        // getWordData(this.owner.wordData.down)
        if (selectedCell) {
            selectedCell.sprite.alpha = 1
        }
        selectedCell = this.owner
        selectedCell.sprite.alpha = 0.6

        // selectedCell.wordRootCells.across.sprite.tint = 0x00ff00
        // selectedCell.wordRootCells.down.sprite.tint = 0x00ff00

        if (selectedCell.wordData.across.length && selectedCell.wordData.across.indexOf("*") === -1) {
            if (selectedCell.wordData.definitions.across.length) {   
                var newDef = selectedCell.wordData.definitions.across[randomInt(0,selectedCell.wordData.definitions.across.length-1)].text
                newDef = cleanDefinition(selectedCell.wordData.across,newDef)
                clueArea.text = "\n" + selectedCell.label.text + " across: " + newDef + " - " + selectedCell.wordData.across.toUpperCase()
            } else {                
                selectedCell.wordData.definitions.across = getClues(selectedCell.wordData.across,selectedCell,"across")

            }
        } else {
            acrossButton.sprite.tint = 0x333333
        }
        if (selectedCell.wordData.down.length && selectedCell.wordData.down.indexOf("*") === -1) {
            if (selectedCell.wordData.definitions.down.length) {
                var newDef = selectedCell.wordData.definitions.down[randomInt(0,selectedCell.wordData.definitions.down.length-1)].text
                newDef = cleanDefinition(selectedCell.wordData.down,newDef)
                clueArea.text = "\n" +  selectedCell.label.text +" down: " + newDef + " - " + selectedCell.wordData.down.toUpperCase()
        
            } else {                
                selectedCell.wordData.definitions.down = getClues(selectedCell.wordData.down,selectedCell,"down")
            }
        } else {
            downButton.sprite.tint = 0x333333
        }
        
        // console.log("selected at " + counter)
        
        // if (RMBDown) {
            // var candidates = getMatchesFromArray(sortedWords[this.owner.wordData.down.length],this.owner.wordData.down)
            // printWord(candidates[randomInt(0,candidates.length-1)],this.owner.pos.x,this.owner.pos.y,"down")
        // }
        
    })
    this.sprite.on('mouseover',function(){
        // console.log("cell " + this.owner.pos.x + "," + this.owner.pos.y + " - clue " + this.owner.label.text)
        // console.log(this.owner.wordData)
        // getWordData(this.owner.wordData.across)
        // getWordData(this.owner.wordData.down)
        if (selectedCell) {
            selectedCell.sprite.alpha = 1
        }
        selectedCell = this.owner
        selectedCell.sprite.alpha = 0.6

        if (selectedCell.wordData.across.length) {
            acrossButton.sprite.tint = 0x88ff88
            if (selectedCell.wordData.across.indexOf("*") === -1) {
                acrossButton.sprite.tint = 0xdd0000
            }   
        } else {
            acrossButton.sprite.tint = 0x333333
        }
        if (selectedCell.wordData.down.length) {
            downButton.sprite.tint = 0x88ff88
            if (selectedCell.wordData.down.indexOf("*") === -1) {
                downButton.sprite.tint = 0xdd0000
            } 
        } else {
            downButton.sprite.tint = 0x333333
        }
        
        // console.log("selected at " + counter)
        
        // if (RMBDown) {
            // var candidates = getMatchesFromArray(sortedWords[this.owner.wordData.down.length],this.owner.wordData.down)
            // printWord(candidates[randomInt(0,candidates.length-1)],this.owner.pos.x,this.owner.pos.y,"down")
        // }
        
    })

}
Cell.prototype.distanceToWordOrigin = function(direction) {
    var steps = 0
    var posX = this.pos.x
    var posY = this.pos.y
    var currentCell = this.board.cells[posY][posX]
    if (direction === "across") {
        while (posX > 0 && !currentCell.label) {
            currentCell = this.board.cells[posY][posX]
            posX--
            steps++
        }
    } else {
        while (posY > 0 && !currentCell.label) {
            currentCell = this.board.cells[posY][posX]
            posY--
            steps++
        }
    }
    return steps
}
Cell.prototype.getWordRootCells = function() {
    var posX = this.pos.x
    var posY = this.pos.y
    
    // console.log(this.board.cells)
    var currentCell = this.board.cells[posY][posX]
    
    var result = {}
    if (currentCell.sprite.tint === 0xffffff && currentCell !== undefined) {
        // console.log("getting roots for cell " + posX + "," + posY)
        if (currentCell.label) {
            // console.log("this cell has a label!")
        }
        // var cellToLeft = this.board.cells[posY][posX-1]
        // if (!cellToLeft) {
        //     cellToLeft = currentCell
        // }
        while (currentCell.sprite.tint === 0xffffff) {
            // console.log("moved left to check cell " + posX + "," + posY)
            posX--
            if (!this.board.cells[posY][posX]) {
                break
            } else {
                currentCell = this.board.cells[posY][posX]
            }
        }
        if (currentCell.label) {
            
            result.across = currentCell
            
        }
        posX = this.pos.x
        posY = this.pos.y
        currentCell = this.board.cells[posY][posX]
        while (currentCell.sprite.tint === 0xffffff) {
            // console.log("moved up to check cell " + posX + "," + posY)
            posY--
            if (!this.board.cells[posY]) {
                break
            } else {
                currentCell = this.board.cells[posY][posX]
            }
            
        }
        if (currentCell.label) {
            result.down = currentCell
        }
    }
    this.wordRootCells = result
}
Cell.prototype.gatherAssociatedWords = function() {

    if (true) {
        var leftFound = false
        var topFound = false
        var posX = this.pos.x
        var posY = this.pos.y
        while (!leftFound) {
            if (this.board.cells[posY][posX]) {
                var currentCell = this.board.cells[posY][posX]
                if (currentCell.label) {
                    this.partOfWords.push(currentCell.wordData.across)
                    leftFound = true
                } else {
                    posX--
                }
            } else {
                leftFound = true
            }
        }
        posX = this.pos.x
        posY = this.pos.y
        while (!topFound) {
            
            if (this.board.cells[posY]) {
                var currentCell = this.board.cells[posY][posX]
                if (currentCell.label) {
                    this.partOfWords.push(currentCell.wordData.down)
                    topFound = true
                } else {
                    posY--
                }
            } else {
                topFound = true
            }
        }
        
    }
}
Cell.prototype.assignWord = function(word,direction) {
    
    this.wordData[direction] = word


}
Cell.prototype.distanceToBlank = function(direction) {
    // console.log("checking pos " + this.pos.x + "," + this.pos.y)
    var steps = 1
    if (direction === "horizontal") {
        for (var c=this.pos.x+1;c<this.board.cells[this.pos.y].length;c++) {
            var cell = this.board.cells[this.pos.y][c]
            // console.log("moving to pos " + cell.pos.x + "," + cell.pos.y)
            if (cell.sprite.tint === 0xffffff) {
                // cell.sprite.tint = 0x00ff00
                steps++
            } else {
                // console.log("hit blank")
                // cell.sprite.tint = 0x660000
                break
            }
        }
    } else {
        for (var c=this.pos.y+1;c<this.board.cells.length;c++) {
            var cell = this.board.cells[this.pos.y+steps][this.pos.x]
            if (cell.sprite.tint === 0xffffff) {
                steps++
            } else {
                break
            }
        }
    }
    return steps
}
Cell.prototype.addLabel = function(num) {
    this.label = new PIXI.Text(num,{fontFamily : 'Helvetica', fontWeight:"bold",fontSize: (cellSize/3.1), fill : 0x000000})
    this.label.x = this.sprite.x - (this.sprite.width/2)
    this.label.y = this.sprite.y - (this.sprite.height/1.9)
    board.container.addChild(this.label)
}
function Board(sizeX,sizeY) {
    this.container = new PIXI.Container()
	this.bg = new PIXI.Sprite(pixelText)
	this.bg.width = sizeX*cellSize
	this.bg.height = sizeY*cellSize
	this.bg.tint = 0x000000
	this.bg.x = cellSize/3
	this.bg.y = (cellSize*3)
    this.wordLengths = []
    this.container.addChild(this.bg)
	

	this.cells = []
    
    this.clues = {
        "across":[],
        "down":[]
    }
    this.words = []
    this.wordRoots = []

    this.readBoardSpan = function(startPos,endPos) {
        var str = ""
        if (startPos.x !== endPos.x) {
            var across = true
        } else {
            var across = false
        }
        var currentCell = this.cells[startPos.y][startPos.x]
        if (currentCell) {
            // console.log("current is " + currentCell.pos.x + "'" + currentCell.pos.y)
            // console.log("endpos is " + endPos.x+","+endPos.y)
            
            if (across) {
                while (currentCell.pos.x !== endPos.x) {
                    str += currentCell.letter.text
                    if (this.cells[currentCell.pos.y][currentCell.pos.x+1]) {
                        currentCell = this.cells[currentCell.pos.y][currentCell.pos.x+1]
                    } else {
                        break
                    }
                }
            } else {
                while (currentCell.pos.y !== endPos.y) {
                    str += currentCell.letter.text
                    if (this.cells[currentCell.pos.y+1]) {
                        currentCell = this.cells[currentCell.pos.y+1][currentCell.pos.x]
                    } else {
                        break
                    }
                }
                
            }
        }
                
        
        // console.log("read board span  " + str)
        return str
    }
    this.updateWordData = function() {
        // console.log("updating word data ---------------")
        changedWords.length = 0
        for (var r=0;r<this.cells.length;r++) {
            var row = this.cells[r]
            for (var c=0;c<row.length;c++) {
                var cell = row[c]
                if (cell.label) {
                    
                    if (cell.wordData.across !== "") {
                        var newString = this.readBoardSpan(cell.pos,{x:cell.pos.x+(cell.wordData.across.length),y:cell.pos.y}).toLowerCase()                        
                        var bothAsterisks = ( cell.wordData.across.split("").every(function(char) {
                            return char === "*"
                        }) && newString.split("").every(function(char) {
                            return char === "*"
                        }) )
                        // var bothComplete = (cell.wordData.across.indexOf("*") === -1 && newString.indexOf("*") === -1)
                        if (!bothAsterisks) {
                            // console.log("comparing old across word " + cell.wordData.across + " to new " + newString)
                            if (cell.wordData.across.toLowerCase() !== newString) {
                                // console.log(cell.wordData.across + " has changed")
                                cell.wordData.across = newString
                                changedWords.push(cell.wordData.across)
                                // console.log("adding " + cell.wordData.across + " to list")
                                
                            }
                        }
                    }
                    if (cell.wordData.down !== "") {
                        var newString = this.readBoardSpan(cell.pos,{x:cell.pos.x,y:cell.pos.y+(cell.wordData.down.length)}).toLowerCase()
                        bothAsterisks = ( cell.wordData.down.split("").every(function(char) {
                            return char === "*"
                        }) && newString.split("").every(function(char) {
                            return char === "*"
                        }) )
                        // bothComplete = (cell.wordData.down.indexOf("*") === -1 && newString.indexOf("*") === -1)
                        
                        if (!bothAsterisks) {
                            // console.log("comparing old down word " + cell.wordData.down + " to new " + newString)
                            
                            if (cell.wordData.down.toLowerCase() !== newString) {
                                // console.log(cell.wordData.down + " has changed")
                                cell.wordData.down = newString.toLowerCase()
                                changedWords.push(cell.wordData.down)
                                // console.log("adding " + cell.wordData.down + " to list")
                                
                            }
                        }

                    }

                    
                }
            }
        }
    }

	this.populate = function() {
        xPos = this.bg.x+(cellSize/2)
        yPos = this.bg.y+(cellSize/2)
        for (var r=0;r<sizeX;r++) {
            var currentRow = []
            this.cells.push(currentRow)
            for (var c=0;c<sizeY;c++) {
                
                var newCell = new Cell(xPos,yPos,0,this)
                newCell.pos.x = c
                newCell.pos.y = r
                // console.log("creating cell " + c +"," + r)
                currentRow.push(newCell)
                
                if (c === sizeX-1) {
                    xPos -= (cellSize*(sizeX-1))
                } else {
                    xPos += cellSize
                }
                newCell.sprite.scale.x *= 0.94
                newCell.sprite.scale.y *= 0.94
                newCell.sprite.width = Math.round(newCell.sprite.width)
                newCell.sprite.height = Math.round(newCell.sprite.height)

            }
            yPos += cellSize
        }
	}

    this.labelNumberedCells = function() {
        var num = 1
        for (var r=0;r<this.cells.length;r++) {
            var row = this.cells[r]
            for (var c=0;c<row.length;c++) {
                var cell = row[c]
                if (cell.label) {
                    cell.label.text = ""
                }
                if (cell.sprite.tint === 0xffffff) {
                    
                    var blankToLeft = (c !== row.length-1 && (c === 0 || row[c-1].sprite.tint === 0x000000))
                    var blankAbove = (r !== this.cells.length-1 && (r === 0 || this.cells[r-1][c].sprite.tint === 0x000000))
                    if ((blankToLeft && row[c+1].sprite.tint === 0xffffff) || (blankAbove && this.cells[r+1][c].sprite.tint === 0xffffff)) {
    
                        cell.addLabel(num)
                        num++
                    }
                    
                    
                }
                cell.getWordRootCells()

            }
        }
    }

    

    this.compileWordSpaces = function() {
        var wordProgress = 0
        
        for (var r=0;r<this.cells.length;r++) {
            var row = this.cells[r]
            for (var c=0;c<row.length;c++) {
                var cell = row[c]
                if (cell.label) {
                    var blankToLeft = (c !== row.length-1 && (c === 0 || row[c-1].sprite.tint === 0x000000))
                    var blankAbove = (r !== this.cells.length-1 && (r === 0 || this.cells[r-1][c].sprite.tint === 0x000000))
                    
                    var vert = cell.distanceToBlank("vertical")
                    var horiz = cell.distanceToBlank("horizontal")
                    
                    if (blankToLeft && horiz > 1) {
                        var newWordBody = {direction:"across",pos:{x:cell.pos.x,y:cell.pos.y},string:cell.wordData.across = "*".repeat(horiz)}
                        this.wordLengths.push(newWordBody)
                        // cell.assignWord(cell.wordData.across,"across")
                        // console.log("set " + cell.pos.x + "," + cell.pos.y + " ACROSS to " + cell.wordData.across)
                     }
                    if (blankAbove && vert > 1) {
                        this.wordLengths.push({direction:"down",pos:{x:cell.pos.x,y:cell.pos.y},string:cell.wordData.down = "*".repeat(vert)})
                        // cell.assignWord(cell.wordData.down,"down")
                        // console.log("set " + cell.pos.x + "," + cell.pos.y + " DOWN to " + cell.wordData.down)
                    }
                    wordProgress++
                    
                    
                } else {
                    
                }
            }
        }
        for (var r=0;r<this.cells.length;r++) {
		var row = this.cells[r]
		for (var c=0;c<row.length;c++) {
			var cell = row[c]
			if (cell.label && cell.wordData.across.length && cell.wordData.down.length) {
				doubleCells.push(cell)
			}
		}
	}
        // console.log(neededWords)
        // console.log(this.wordRoots)
        // console.log(this.words)
        
    }

    this.lengthOfUnknownWord = function(posX,posY,direction) {
        var label = this.cells[posY][posX].label.text
        
        for (var w=0;w<this.words.length;w++) {
            var wordSpace = this.words[w]
            for (key in wordSpace) {
                if (key === label) {
                    return wordSpace[label][direction]
                }
            }
        }
    }

    this.producePattern = function() {
        for (var c=0;c<this.cells.length;c++) {
            var row = this.cells[c]
            for (var r=0;r<row.length;r++) {
                var cell = row[r]

            }
        }
    }

    this.getCellEquivalent = function(initX,initY) {
        var equivs = []
        var equiv1 = {x:(this.cells[0].length-1)-initX,y:(this.cells.length-1)-initY}
        return this.cells[equiv1.y][equiv1.x]
    }


    // stage.addChild(this.container)
}
function findQuery(startX,startY,direction) {
    var query = ""
    var posX = startX
    var posY = startY
    var currentCell = board.cells[posY][posX]
    console.log(currentCell.sprite.tint)
    while(currentCell.sprite.tint === 0xffffff) {
        // console.log("loading char " + currentCell.letter.text)
        query += currentCell.letter.text
        if (direction === "horizontal") {
            posX++
        } else {
            posY++
        }
        currentCell = board.cells[posY][posX]
        
        // console.log("moved to cell " + posX + "," + posY)
    }
    console.log(startX + "," + startY + " returned " + query)
    return query
}
function blankCluster(startX,startY,direction,size) {
    size--
    var posX = startX
    var posY = startY
    var arr = [board.cells[posY][posX]]
    for (var r=0;r<size;r++) {
        if (direction === "horizontal") {
            if (randomInt(0,6)) {
                posX++
            } else {
                r--
                posY++
            }
        } else {
            if (randomInt(0,6)) {
                posY++
            } else {
                r--
                posX++
            }
        }
        arr.push(board.cells[posY][posX])
    }
    return arr
}
function randomizeBoard(board) {

}
function getRandomWord(length) {
 
    console.log("looking for word length " + length)
    if (length <= 15) {
        var rando = sortedWords[length][randomInt(0,sortedWords[length].length-1)]
        console.log("found " + rando)
        // newWord = new WordObject(rando)
        // newWord.getSynonyms()
        // newWord.getAttribute("definitions")
        // newWord.getPhrases()
        return rando
    }
}
function discoverRandomWord(length) {
    // console.log("getting word length " + length)
    $.getJSON(
	    "http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=120&maxCorpusCount=-1&minDictionaryCount=9&maxDictionaryCount=-1&minLength="+length+"&maxLength="+length+"&limit=1000&api_key=e8f4853623a879a93e24c7a25dd0d2c0c43f5ca0720271190",
	    function(data)
	    {
            // console.log(data)
            // for (var w=0;w<data.length;w++) {
            //     var word = data[w].word
                
            //     if (compiledWordList.indexOf(word) === -1) {
            //         compiledWordList.push(word)
            //         getWordData(word)
            //     } else {
            //         console.log("duplicate word " + word + " not added!")
            //         duplicates++
            //     }
                
            // }
            if (data) {
                var word = data[randomInt(0,data.length-1)].word
                word = word.toLowerCase()
                if (sortedWords[word.length].indexOf(word) === -1) {
                    // getWordData(word)
                    
                    console.log("got " + word)
                    compiledWordList.push(word)
                    sortedWords[word.length].push(word)
                    addedWords.push(word)
                } else {
                    // console.log("rejecting duplicate " + word)
                    duplicates++
                }
                return data
            }
			
	    }

	);
    
}

function getWordData(word) {
    $.getJSON(
	    "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=10&includeRelated=true&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=e8f4853623a879a93e24c7a25dd0d2c0c43f5ca0720271190",
	    function(data)
	    {
			newWord = new WordObject(data[0].word)
            newWord.string = newWord.string.toLowerCase()
            // console.log("getting data for " + newWord.string)
            if (newWord.string.indexOf(" ") !== -1) {
                console.log("found space in " + newWord.string)
                newWord.string = newWord.string.substr(0,newWord.string.indexOf(" ")) + newWord.string.substr(newWord.string.indexOf(" ")+1,newWord.string.length-1)
                if (newWord.string.indexOf(" ") !== -1) {
                    console.log("found second space in " + newWord.string)
                    newWord.string = newWord.string.substr(0,newWord.string.indexOf(" ")) + newWord.string.substr(newWord.string.indexOf(" ")+1,newWord.string.length-1)
                }
                console.log("changed to " + newWord.string)
            }
            if (newWord.string.indexOf("-") !== -1) {
                console.log("found hyphen in " + newWord.string)
                newWord.string = newWord.string.substr(0,newWord.string.indexOf("-")) + newWord.string.substr(newWord.string.indexOf("-")+1,newWord.string.length-1)
                if (newWord.string.indexOf("-") !== -1) {
                    console.log("found second hyphen in " + newWord.string)
                    newWord.string = newWord.string.substr(0,newWord.string.indexOf("-")) + newWord.string.substr(newWord.string.indexOf("-")+1,newWord.string.length-1)
                }
                console.log("changed to " + newWord.string)
            }
            
            wordCollection.push(newWord)
            // sortedWords[newWord.string.length].push(newWord.string)

            for (var d=0;d<data.length;d++) {
                var def = data[d].text
                if (def) {
                    
                    var disqualified = false
                    
                    for (var c=0;c<def.length;c++) {
                        var char = def[c]
                        if (char === ";" || char === ":" || char === ".") {
                            def = def.substr(0,c)
                        }
                        
                        if (c<def.length-3 && char === " " && def[c+1] === " " && def[c+2] === " ") {
                            def = def.substr(c+3,def.length-1)
                        }
                        if (c<def.length-3 && char === " " && def[c+1] === " ") {
                            def = def.substr(0,c)
                            // console.log("created " + def + " for " + word)
                        }
                    }
                    var defWords = def.split(" ")
                    for (var w=0;w<defWords.length;w++) {
                        var defWord = defWords[w]
                        if (defWord.length > 1 && (defWord.substr(0,data[0].word.length/2).toLowerCase() === data[0].word.substr(0,data[0].word.length/2).toLowerCase() || defWord.toLowerCase() === data[0].word.toLowerCase())) {
                            disqualified = true
                            console.log(defWord + " is same as " + data[0].word + " so disq " + def + " for " + word)
                            // console.log(defWords)
                        }
                    }
                    if (!disqualified) {
                        def = def[0].toUpperCase() + def.substr(1,def.length-1)
                        newWord.definitions.push(def)
                    }
                }
                
                
            }
            newWord.researched = true
            console.log(newWord.string + " - " + newWord.definitions[randomInt(0,newWord.definitions.length-1)])
            // console.log(wordCollection.length + " words defined.")
	    }
        
        
	);
  
}
function cleanDef(def) {
    var defString = def
    for (var c=0;c<defString.length;c++) {
        var char = defString[c]
        if (char === ";" || char === ":" || char === ".") {
            defString = defString.substr(0,c)
            // console.log("cleaned a " + char + " from " + def)
        }
        
        if (c<defString.length-3 && char === " " && defString[c+1] === " " && defString[c+2] === " ") {
            defString = defString.substr(c+3,defString.length-1)
            // console.log("cleaned triple space from " + def)
        }
        if (c<defString.length-3 && char === " " && defString[c+1] === " ") {
            defString = defString.substr(0,c)
            // console.log("cleaned a double space from " + def)
        }
        
        
    }
    return defString
}
function cleanDefinition(word,def) {
    var disqualified = false
    var defString = def
    for (var c=0;c<defString.length;c++) {
        var char = defString[c]
        if (char === ";" || char === ":" || char === ".") {
            defString = defString.substr(0,c)
            // console.log("cleaned a " + char + " from " + def)
        }
        
        if (c<defString.length-3 && char === " " && defString[c+1] === " " && defString[c+2] === " ") {
            defString = defString.substr(c+3,defString.length-1)
            // console.log("cleaned triple space from " + def)
        }
        if (c<defString.length-3 && char === " " && defString[c+1] === " ") {
            defString = defString.substr(0,c)
            // console.log("cleaned a double space from " + def)
        }
        
        
    }
    var defWords = defString.split(" ")
    for (var w=0;w<defWords.length;w++) {
        var defWord = defWords[w]
        if (defWord.length > 1 && (defWord.substr(0,Math.ceil(word.length/2)).toLowerCase() === word.substr(0,Math.ceil(word.length/2)).toLowerCase() || defWord.toLowerCase() === word.toLowerCase())) {
            disqualified = true
            console.log(defWord + " is same as " + word + " so disq " + defString + " for " + word)
            // console.log(defWords)
        }
    }
    defString = defString[0].toUpperCase() + defString.substr(1,defString.length-1)
    if (!disqualified) {
        return defString
    } else {
        return "REJECTED: " + defString
    }
}
function getClues(word,cell,direction) {
    console.log("getting a clue for " + word)
    $.getJSON(
	    "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=10&includeRelated=true&sourceDictionaries=all&useCanonical=true&api_key=e8f4853623a879a93e24c7a25dd0d2c0c43f5ca0720271190",
        function(data) {
            
            if (cell) {
                cell.wordData.definitions[direction] = data
                var clue = cell.wordData.definitions[direction][randomInt(0,cell.wordData.definitions[direction].length-1)].text
                clue = cleanDefinition(word,clue)
                
                clueArea.text = "\n " + selectedCell.label.text + " " + direction.toUpperCase() + " - " + clue + " - " + cell.wordData[direction].toUpperCase()
                
            } else {

            }
            
        }
    )
}
function recordDefinition(word) {
    // console.log("getting a clue for " + word)
    $.getJSON(
	    "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions?limit=1&includeRelated=true&sourceDictionaries=all&useCanonical=true&api_key=e8f4853623a879a93e24c7a25dd0d2c0c43f5ca0720271190",
        function(data) {
        
            var def = cleanDef(data[0].text)
            saveClue(word,def)
           
        }
    )
}
function cleanNonAlphas() {
    for (section in sortedWords) {
		for (var w=0;w<sortedWords[section].length;w++) {
			var word = sortedWords[section][w]
            if (word.indexOf(".") > -1) {
				console.log("period found in " + word)
				word = word.substr(0,word.indexOf("."))+word.substr(word.indexOf(".")+1,word.length-1)
				console.log("changed to " + word)
				sortedWords[section].splice(w,1)
                if (sortedWords[word.length].indexOf(word) === -1) {
				    sortedWords[word.length].push(word)
                }
			}
			if (word.indexOf("-") > -1) {
				console.log("hyphen found in " + word)
				word = word.substr(0,word.indexOf("-"))+word.substr(word.indexOf("-")+1,word.length-1)
				console.log("changed to " + word)
				sortedWords[section].splice(w,1)
                if (sortedWords[word.length].indexOf(word) === -1) {
				    sortedWords[word.length].push(word)
                }
			}
            if (word.indexOf("'") > -1) {
				console.log("apostrophe found in " + word)
				word = word.substr(0,word.indexOf("'"))+word.substr(word.indexOf("'")+1,word.length-1)
				console.log("changed to " + word)
				sortedWords[section].splice(w,1)
				if (sortedWords[word.length].indexOf(word) === -1) {
				    sortedWords[word.length].push(word)
                }
			}
			if (word.indexOf(" ") > -1) {
				console.log("space found in " + word)
				word = word.substr(0,word.indexOf(" "))+word.substr(word.indexOf(" ")+1,word.length-1)
				console.log("changed to " + word)
				sortedWords[section].splice(w,1)
				if (sortedWords[word.length].indexOf(word) === -1) {
				    sortedWords[word.length].push(word)
                }
			}
		}
	}
}
function getWordAttribute(word,attribute) {
    $.getJSON(
	    "http://api.wordnik.com:80/v4/word.json/" + word + "/" + attribute + "?api_key=e8f4853623a879a93e24c7a25dd0d2c0c43f5ca0720271190",
	    function(data)
	    {
            console.log(word)
			console.log(data)
			
	    }
	);
}
function ListScreen(id) {
    this.entries = []
    this.customEntries = []
    this.duplicateEntries = []
    this.dupesListed = []
    this.panels = []
    this.div = document.getElementById(id)
    this.listHeight = 0
    
    
    this.repleneshing = false
    if (id==="random-list") {
        this.moreButton = document.getElementById('random-more-button')
        this.bottomPanel = document.getElementsByClassName('bottom-panel')[0]
        this.toList = 0
        this.button = document.getElementById('browse-button')
    } else {
        this.moreButton = document.getElementById('edited-more-button')
        this.bottomPanel = document.getElementsByClassName('bottom-panel')[1]
        this.toList = loadAtOnce
        this.button = document.getElementById('edited-button')
    }
    this.slideIn = function() {
        this.button.disabled = true;
        if (id==="random-list") {
            document.getElementById("browse-button").innerHTML = "LOADING<br>0%"
            // document.getElementById("browse-button").disabled = true
            fillListScreen(randomScreen,randomMinRange,randomMaxRange,loadAtOnce)
            // this.div.style.left = 0
        } else {
            // document.getElementById("edited-button").disabled = true
            // edited already has full entries array
            if (!showingEditors.length) {
                this.listAll(this.toList-loadAtOnce)
            } else {
                this.listCustom(this.toList-loadAtOnce)
            }
            this.div.style.left = 0
            this.bottomPanel.style.bottom = 0
        }
        // this.bottomPanel.style.bottom = 0
    }
    this.slideOut = function() {
        if (id==="random-list") {
            document.getElementById("browse-button").innerHTML = "BROWSE RANDOM >>"
            setTimeout(function(){
                randomScreen.clearList()
                randomScreen.button.disabled = false
            },300)
            this.div.style.left = "100vw"
        } else {
            setTimeout(function(){
                editedScreen.resetList()
                editedScreen.button.disabled = false
            },300)
            this.div.style.left = "-100vw"
            
        }
        this.bottomPanel.style.bottom = '-20vmin'

    }
    this.clearList = function() {
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
        this.div.innerHTML = ""
        this.entries.length = 0
        this.panels.length = 0
        this.toList = 0
        this.dupesListed.length = 0
    }
    this.resetList = function() {
        while (this.div.firstChild) {
            this.div.removeChild(this.div.firstChild);
        }
        this.toList = loadAtOnce
        this.dupesListed.length = 0
    }
    // if (id==="edited-screen") {
    this.addEntry = function(word,clue,editDate,editor,wordID) {
        this.entries.push([word,clue,editDate,editor,wordID])

        if (id==="random-list" && this.entries.length<=(loadAtOnce*2)) {
            var but = "browse-button"
            document.getElementById(but).innerHTML = "LOADING<br>"+(this.entries.length/loadAtOnce)*100+"%"
            if (this.entries.length===loadAtOnce) {
                document.getElementById(but).innerHTML = "LOADING<br>100%"
            }
        }

    }
    this.listEntry = function(word,clue,editDate,editor,wordID) {
        if (id==="random-list") {
            var html = '<div class="random-panel"></div>'
            this.div.innerHTML += html
            var panelArray = document.getElementsByClassName("random-panel")
            var newDiv = panelArray[panelArray.length-1]
        } else {
            var html = '<div class="edited-panel"></div>'
            this.div.innerHTML += html
            var panelArray = document.getElementsByClassName("edited-panel")
            var newDiv = panelArray[panelArray.length-1]
        }
        if (wordID) {
            var idDiv = "<div class='id-panel'>#"+(word.length)+'-'+wordID+"</div>"
        
        } else {
            wordID = "<span style='color:grey'>no record</span>"
            var idDiv = '<div class="id-panel">'+wordID+'</div>'
        
        }

        newDiv.setAttribute('id',word.toLowerCase())
        if (editDate) {
            newDiv.innerHTML = "<div class='word-panel'><span class='larger'><strong>"+word.toUpperCase()+"</strong></span>&nbsp;&nbsp;&nbsp;<button onclick='promptForNewClue(`"+word+"`,`"+newDiv+"`)' class='but add-button'>ADD</button></div>"
            newDiv.innerHTML += "<div id='"+wordID.toString()+"' class='def-panel'><div class='clue-area'><div class='clue-text'>"+clue+"</div>"+idDiv+"</div><span style='line-height:1vmin'></span><div class='edit-panel'>"+prettyDate(editDate,true)+" by "+editor[0].toUpperCase()+editor.slice(1,editor.length)+"<button onclick='promptToReplaceClue(`"+word+"`,`"+clue+"`,`"+newDiv+"`)' class='but edit-button'>EDIT</button></div></div>"
            var panelColor = "#eee"
                if (editor.toLowerCase()==="ann") {
                    panelColor = "#eef"
                }
                if (editor.toLowerCase()==="mike") {
                    panelColor = "#efe"
                }
            newDiv.style.backgroundColor = panelColor
        } else {
            newDiv.innerHTML = "<div class='word-panel'><span class='larger'><strong>"+word.toUpperCase()+"</strong></span>&nbsp;&nbsp;&nbsp;<button onclick='promptForNewClue(`"+word+"`,`"+newDiv+"`)' class='but add-button'>ADD</button></div><div class='def-panel'><div class='clue-area'><div class='clue-text'>"+clue+"</div>"+idDiv+"</div><span style='line-height:1vmin'><br></br></span><div class='edit-panel'><button onclick='promptToReplaceClue(`"+word+"`,`"+clue+"`,`"+newDiv+"`)' class='but edit-button'>EDIT</button>" 

            // newDiv.innerHTML = "<span class='larger'><strong>"+word.toUpperCase()+"</strong></span><div class='def-panel'>"+clue+"</div>"
        }
        
        // var newBut = newDiv.getElementsByClassName("but add-button")[0]
        
        
        // console.log("LISTED " + word + " len " +  this.panels.length)
        this.panels.push(newDiv)
        
    }
    this.listCustom = function(startingInd) {
        // console.log("listing custom")
        for (var e=startingInd;e<this.toList;e++) {
            var entry = this.customEntries[e]
            
            if (entry) {
                this.listEntry(entry[0],entry[1],entry[2],entry[3],entry[4])
                if (e===this.customEntries.length-1) { 
                    var html = '<div class="end-message">END OF LIST</div>'
                    this.div.innerHTML += html
                }
            } else {
                // console.log("ain't no index " + e + " in entries")
            }
        }
        this.addDuplicatesToList(this.customEntries)
    }
    this.listAll = function(startingInd,skipSort) {
        if (!skipSort) {
            this.entries = this.entries.sort(function(a,b){
                return b[2]-a[2]
            })
        }
        for (var e=startingInd;e<this.toList;e++) {
            var entry = this.entries[e]
            
            if (entry) {
                this.listEntry(entry[0],entry[1],entry[2],entry[3],entry[4])
            } else {
                return
            }
        }
        // this.sortDuplicates(this.entries)
        
        
        if (id==="random-list" && this.div.offsetLeft !== 0) {
            randomScreen.div.style.left = 0
            randomScreen.bottomPanel.style.bottom = 0
        }
        if (id==="edited-list") {
            // this.sortDuplicates(this.entries)
            this.addDuplicatesToList(this.entries)
        }
    }
    if (id==="edited-list") {
        this.continueListing = function() {
            this.toList += loadAtOnce
            if (!showingEditors.length) {
                this.listAll(this.toList-loadAtOnce,true)
                
            } else {
                this.listCustom(this.toList-loadAtOnce)
            } 
        }
    } else {
        this.continueListing = function() {
            var startInd = this.toList
            if (!this.entries[startInd]) {
                fillListScreen(this,randomMinRange,randomMaxRange,loadAtOnce)
            } else {
                this.toList += loadAtOnce
                this.listAll(startInd,true)
            }
        }
    }
    this.checkScroll = function() {
        if (this.div.style.left === "0px") {
            if (this.div.offsetHeight+this.div.scrollTop >= this.div.scrollHeight*0.9) {
                if (id==="random-list") {
                    if (this.entries.length < this.toList) {
                        this.continueListing()
                    } else {
                        var sinceFilled = Date.now()-lastFilled
                        if (sinceFilled > 300) {
                            fillListScreen(this,randomMinRange,randomMaxRange,loadAtOnce)
                        }
                    }
                } else {
                    if (this.toList < this.entries.length) {
                        this.continueListing()
                    }
                }
            }
        }
    }
    this.refreshIconRotation = 0
    this.refresh = function() {
        this.refreshIconRotation += 360
        document.getElementById("edited-button").disabled = true;
        document.getElementsByClassName('fa-sync-alt')[0].style.transform = "rotate("+this.refreshIconRotation+"deg)"
        document.getElementById("edited-button").innerHTML = "REFRESHING..."
        document.getElementById("refresh-button").disabled = true
        this.clearList()
        this.toList = 5
        for (var e=3;e<21;e++) {
            setTimeout(getEditedWordClues(e),e*10)
        }   
    }
    this.addToShow = function(editor) {
       
        if (editor==="mike") {
            document.getElementById(editor+'-button').disabled = true
            document.getElementById('ann-button').disabled = false
            document.getElementById('all-button').disabled = false
            showingEditors.length = 0
            if (showingEditors.indexOf(editor.toLowerCase())===-1) {
                showingEditors.push(editor.toLowerCase())
            }
        } else if (editor==="ann") {
            document.getElementById(editor+'-button').disabled = true
            document.getElementById('mike-button').disabled = false
            document.getElementById('all-button').disabled = false
            showingEditors.length = 0
            if (showingEditors.indexOf(editor.toLowerCase())===-1) {
                showingEditors.push(editor.toLowerCase())
            }
        } else {
            document.getElementById('all-button').disabled = true
            document.getElementById('mike-button').disabled = false
            document.getElementById('ann-button').disabled = false
            showingEditors.length = 0
        }
        this.resetList()
        this.filterEntries()
    }
    this.addClueToEntry = function(word,clueData) {
        var targetDiv = document.getElementById(word.toLowerCase())
        var word = clueData[0]
        var clue = clueData[1]
        var editDate = clueData[2]
        var editor = clueData[3]
        var wordID = clueData[4]
        if (wordID) {
            var idDiv = "<div class='id-panel'>#"+(word.length)+'-'+wordID+"</div>"
        } else {
            wordID = "<span style='color:grey'>no record</span>"
            var idDiv = '<div class="id-panel">'+wordID+'</div>'
        }
        if (targetDiv) {
            this.dupesListed.push(clueData[1])
            targetDiv.innerHTML += "<div class='def-panel'><div class='clue-area'><div class='clue-text'>"+clue+"</div>"+idDiv+"</div><span style='line-height:1vmin'></span><div class='edit-panel'>"+prettyDate(editDate,true)+" by "+editor[0].toUpperCase()+editor.slice(1,editor.length)+"<button onclick='promptToReplaceClue(`"+word+"`,`"+clue+"`,`"+targetDiv+"`)' class='but edit-button'>EDIT</button></div></div>"
        } else {
            // console.log("aint no div yet with ID " + word.toLowerCase())
        }
    }
    this.filterEntries = function(all) {
        if (all) {
            document.getElementById('all-button').classList.add("selected-button")
            document.getElementById('ann-button').classList.remove("selected-button")
            document.getElementById('mike-button').classList.remove("selected-button")
            showingEditors.length = 0
            this.customEntries.length = 0
            while (this.div.firstChild) {
                this.div.removeChild(this.div.firstChild);
                
            }
            this.toList = loadAtOnce
            return
        }
        var newArr = []
        for (var e=0;e<this.entries.length;e++) {
            var entry = this.entries[e]
            var entryIndex = showingEditors.indexOf(entry[3].toLowerCase())
            if (entry[3] && entryIndex>-1) {
                newArr.push(entry)
                editCounts[entry[3].toLowerCase()]++
            }
        }
        this.customEntries = newArr
        this.customEntries = this.customEntries.sort(function(a,b){
            return b[2]-a[2]
        })
        this.sortDuplicates(this.customEntries)
    }
    this.sortDuplicates = function(entryArray) {
        var sortedArray = entryArray.sort(function(a,b){
            return b[2]-a[2]
        })
        var usedWords = []
        for (var e=0;e<sortedArray.length;e++) {
            var entry = sortedArray[e]
            var word = entry[0].toLowerCase()
            // console.log(word + " " + entry[1])
            if (usedWords.indexOf(word)===-1) {
                usedWords.push(word)
            } else {
                entryArray.splice(e,1)
                this.duplicateEntries.push(entry)
            }
        }
    }
    this.addDuplicatesToList = function() {
        for (var d=0;d<this.duplicateEntries.length;d++) {
            var dupe = this.duplicateEntries[d]
            if (this.dupesListed.indexOf(dupe[1])===-1) {
                this.addClueToEntry(dupe[0],dupe) 
            }
        }
    }
}
function fillListScreen(list,rangeMin,rangeMax,reps,customArray) {
    lastFilled = Date.now();
    // console.log("calling fillist")
    list.repleneshing = true
    cacheEntries = reps-1
    var rando = randomInt(rangeMin,rangeMax)
    var newWord = sortedWords[rando][randomInt(0,sortedWords[rando].length-1)]
    if (newWord.length) {        
        getRandomWordClue(list,newWord)
    }
}

