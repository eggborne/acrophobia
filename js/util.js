Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { //To test values in nested arrays
            if (!this[i].compare(testArr[i])) return false;
        }
        else if (this[i] !== testArr[i]) return false;
    }
    return true;
}
function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
        this.splice(i, 1);
        i--;
        }
    }
    return this;
};
function mergeArrays(array1, array2) {
    var result = [];
    var arr = array1.concat(array2);
    var len = arr.length;
    var assoc = {};

    while(len--) {
        var item = arr[len];

        if(!assoc[item]) 
        { 
            result_array.unshift(item);
            assoc[item] = true;
        }
    }

    return result;
}

function fullscreen() {
	// fullscreen = true
    var el = document.body
    if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else {
        el.mozRequestFullScreen()
    }
}
function exitFullscreen() {
	// fullscreen = false
    if (document.exitFullScreen) {
        document.exitFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
};
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function promptToEnterWord() {
    var word = prompt('Enter word:')

    if (word) { promptForNewClue(word) }
}
function promptForNewClue(word,textObj) {
    console.log(word)
    newClue = prompt("Enter new clue to add for " + word.toUpperCase() + ":")
    if (newClue) {
        console.log("saving new clue " + newClue)
        saveIfUnlisted(word,newClue)
    }
}


function prettyDate(epoch,noBreak) {
    if (!noBreak) {
        var brk = "<br>"
    } else {
        var brk = " "
    }
    var fullDate = new Date(parseInt(epoch)).toString()
    var dayDate = fullDate.slice(0,10)
    var time = standardTime(fullDate.slice(16,21))
    return dayDate + brk + time
}
function standardTime(military) {
    var ampm = "AM"
    var hour = military.slice(0,2)
    
    var min = military.slice(3,5)
    if (hour==="00") {
        hour = "12"
    }
    if (parseInt(hour) > 12) {
        hour = (parseInt(hour)-12).toString()
        ampm = "PM"
    }
    if (hour[0]=="0") {
        hour = hour[1]
    }
    return hour+":"+min+" "+ampm
}
function compareNumbers(a,b) {
    return a-b;
}
function changeMinRange(amount) {
    if (randomMinRange+amount <= 20 && randomMinRange+amount >= 3) {
        randomMinRange += amount
        document.getElementById("min-digit").innerHTML = randomMinRange
        if (randomMinRange > randomMaxRange) {
            changeMaxRange(+1)
        }
        // if (randomScreen.entries.length) {
        //     randomScreen.div.innerHTML = ""
        //     randomScreen.entries.length = 0
        // }
    }
}
function changeMaxRange(amount) {
    if (randomMaxRange+amount <= 20 && randomMaxRange+amount >= 3) {
        randomMaxRange += amount
        document.getElementById("max-digit").innerHTML = randomMaxRange
        if (randomMaxRange < randomMinRange) {
            changeMinRange(-1)
        }
    }
}
function refreshEditCounts() {
    editCounts.ann = 0
    editCounts.mike = 0
    for (var e=0;e<editedScreen.entries.length;e++) {
        var entry = editedScreen.entries[e]
        var entryIndex = Object.keys(editCounts).indexOf(entry[3].toLowerCase())
        if (entry[3] && entryIndex>-1) {
            editCounts[entry[3].toLowerCase()]++
        }
    }
    document.getElementById("ann-button").innerHTML = "Ann<br/>(" + editCounts["ann"] + ")"
    document.getElementById("mike-button").innerHTML = "Mike<br/>(" + editCounts["mike"] + ")"
}
var pulses = 0
function pulseBG(length,freq) {
    var pulse = setInterval(function(){
        if (pulses%2===0) {
            var newScale = 'scale(1.1)'
            pulses++
        } else {
            var newScale = 'scale(1)'
            pulses++
        }
        if (pulses<length) {
            // console.log("changing to")
            document.getElementById('success-message').style.transform = newScale
        } else {
            pulses = 0
            clearInterval(pulse)
            document.getElementById('success-message').style.transform = 'scale(1)'
        }
        
    },freq)
}
function summonSuccessScreen(word,achievement) {
    successMessage.innerHTML = achievement + " for<br><span>"+word.toUpperCase()+"</span>"
    successMessage.style.top = '40vmin'
    successMessage.style.opacity = 1
    successMessage.style.transform = 'scale(1)'
    document.getElementById("confirm-screen").style.opacity = 0.5
    // setTimeout(function(){
        pulseBG(4,75)
    // },10)
    setTimeout(function(){
        banishSuccessScreen()
    },1800)
}
function banishSuccessScreen() {
    successMessage.style.opacity = 0;
    successMessage.style.transform = 'scale(0.5)'
    document.getElementById("confirm-screen").style.opacity = 0
}
function each(arr,func) {
    for (var u=0;u<arr.length;u++) {
        var item = arr[u]
        func(item)
    }
}


