var currentUser = "anonymous"
var users = []
var readyUsers = []
var cacheEntries = 0
var lastFilled = -99
var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints
var viewWidth = window.innerWidth;
var viewHeight = window.innerHeight;
var cellSize = Math.round(window.innerHeight/33)
document.body.style.fontSize = Math.round(cellSize/1.5)
document.body.style.fontSize = '1em'
var landscape = true
if (window.innerWidth < window.innerHeight) {
	landscape = false
}
var HWRatio = viewHeight/viewWidth

var timer = requestAnimationFrame(update)

// handshake('cock')
// getUserData()

var counter = 0
var handshakeFrequency = 20
var updateFrequency = 60
acroTimer = undefined
votingTimer = undefined

acroCreationTime = 30
voteTime = 30
roundBegun = false
votingBegun = false
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

var currentAcro = undefined
var themes = ["Animals","Crime","Movies","Television","Science","Politics"]
var currentTheme = undefined
var submissions = []
var round = 1
var chatInput = document.getElementById('chat-input')
var chatBox = document.getElementById('chat-box')
var chatButton = document.getElementById('chat-button')

getUserData()
updateChatBox(true)
chatBox.scrollTop = chatBox.scrollHeight;

// displayAcro(currentAcro)

getAcro(1)

// document.getElementsByClassName("user-acro").style.backgroundColor = "red"

chatInput.onkeypress=function(e){
    if(e.keyCode==13){
        document.getElementById('chat-button').click();
    }
}
function update() {
	if (counter%handshakeFrequency===0) {
		each(users,function(username){
			// console.log('shaking ' + username)
			handshake(currentUser)
		})
	}
	if (counter > 0 && counter%updateFrequency===0) {
        getUserData()
        // checkReadiness()
        updateChatBox()
    }
    if (counter%60===0 && roundBegun && acroTimer) {
        console.log("oulse")
        document.getElementById("acro-field").style.backgroundColor = "white"
        setTimeout(function(){
            document.getElementById("acro-field").style.backgroundColor = "lightgreen"
        },500)
    }
	counter++
	requestAnimationFrame(update)

}
function displayAcro(acro) {
    console.log("DISPLAYING -----------------")
    roundBegun = true
    document.getElementById('acro-theme').style.opacity = 1
	document.getElementById('acro0').innerHTML = acro[0]
	document.getElementById('acro1').innerHTML = acro[1]
	document.getElementById('acro2').innerHTML = acro[2]
    document.getElementById('acro3').innerHTML = acro[3]
    
    setTimeout(function(){
        document.getElementById('acro0').style.opacity = 1
        document.getElementById('acro0').style.transform = "scale(1)"
        setTimeout(function(){
            document.getElementById('acro1').style.opacity = 1
            document.getElementById('acro1').style.transform = "scale(1)"
            setTimeout(function(){
                document.getElementById('acro2').style.opacity = 1
                document.getElementById('acro2').style.transform = "scale(1)"
                setTimeout(function(){
                    document.getElementById('acro3').style.opacity = 1
                    document.getElementById('acro3').style.transform = "scale(1)"
                    setTimeout(function(){
                        document.getElementById('acro-field').disabled = 0
                        document.getElementById('acro-submit-button').disabled = 0
                        document.getElementById('acro-field').style.backgroundColor = "lightgreen"
                        startTimerCountdown("acro",function(){
                            console.log("timer out nigguh")
                            beginVotingRound()
                        })
                    },200)
                },400)
            },400)
        },400)
    },400)
	// document.getElementById('acro-instructions').innerHTML = "Enter acronym for "+(acro[0])+" "+(acro[1])+" "+(acro[2])+" "+(acro[3])
}
function submitAcro() {
	var fail = false
	var sub = document.getElementById('acro-field')
	// var instruc = document.getElementById('acro-instructions')
	console.log("submitted " + sub.value)
	var split = sub.value.split(" ").clean("")
	console.log("split ")
	console.log(split)
	if (split.length !== currentAcro.length) {
        document.getElementById("acro-field").placeholder = "INVALID"
        setTimeout(function(){
            document.getElementById("acro-field").placeholder = "put acronym here"
        },1000)
		fail = true
	} else {
		var newArr = []
		for (var w=0;w<split.length;w++) {
			var word = split[w]
			if (word[0].toUpperCase() !== currentAcro[w].toUpperCase()) {
                document.getElementById("acro-field").placeholder = "INVALID"
                setTimeout(function(){
                    document.getElementById("acro-field").placeholder = "put acronym here"
                },1000)
				fail = true
				continue
			} else {
				word = word[0].toUpperCase()+word.slice(1,word.length)
				newArr.push(word)
			}
		}
		if (!fail) {
			var cleanSub = newArr.join(" ")
			// submissions.push({acro:cleanSub,username:currentUser})
			sendSubmission(currentUser,cleanSub)
			// instruc.innerHTML = cleanSub
			sub.disabled = true
		}
	}
	if (fail) {
		sub.value = ""
	} else {
		        
	}
	console.log(newArr)
	

}

function beginVotingRound() {
    votingBegun = true
    document.getElementById('voting-screen').style.top = 0;
    document.getElementById("ready-button").style.display = "block"
    document.getElementById("ready-button").innerHTML = "Cast Vote"
    document.getElementById("ready-button").onclick = function(){
        console.log("vote cast!")
        document.getElementById("ready-button").style.display = "none"
        document.getElementById("ready-button").innerHTML = "Ready"
        document.getElementById("ready-button").onclick = function(){
            setUserReady(currentUser,1)
        }
    }
    getSubmissions()
	
}
function highlightAcro(acroDiv) {
	acroDiv.style.backgroundColor = "green"
	var voted = acroDiv.innerHTML
	console.log("voted " + voted)
}
function startTimerCountdown(timer,after) {
    document.getElementById('timer').style.opacity = 1
    document.getElementById('status').innerHTML = ""
    timerStarted = true
    timerDigit = acroCreationTime
    if (timer==="acro") {
        console.log("startig time")
        acroTimer = setInterval(function(){
            timerDigit--
            document.getElementById('timer').innerHTML = timerDigit.toString()
            if (timerDigit<0) {
                document.getElementById('timer').innerHTML = "<span style='color:red;font-size:4vh'>TIME UP!</span>"
                setTimeout(function(){
                    document.getElementById('timer').style.opacity = "0"
                },1000)
                timerStarted = false
                clearInterval(acroTimer)
                acroTimer = undefined
                after()
            }
        },1000)
    } else if (timer==="voting") {
        votingTimer = setInterval(function(){
            timerDigit--
            document.getElementById('vote-timer').innerHTML = timerDigit.toString()
            if (timerDigit<0) {
                document.getElementById('vote-timer').innerHTML = "<span style='color:red;font-size:4vh'>TIME UP!</span>"
                setTimeout(function(){
                    document.getElementById('vote-timer').style.opacity = "0"
                },1000)
                timerStarted = false
                clearInterval(votingTimer)
                votingTimer = undefined
                after()
            }
        },1000)
    }
    
}