function sendAcro(round) {
    var acro = alphabet[randomInt(0,25)]+alphabet[randomInt(0,alphabet.length-1)]+alphabet[randomInt(0,alphabet.length-1)]+alphabet[randomInt(0,alphabet.length-1)]
    var theme = themes[randomInt(0,themes.length-1)]
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/sendacro.php", 
        data: {round:round,acro:acro,theme:theme,tbl:'acros'},
        success : function(data)
        {
            // currentTheme = theme
            // currentAcro = acro
            // document.getElementById('acro-theme').innerHTML = "Theme: " + currentTheme
            getAcro(round)
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}
function getAcro(round) {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/getacro.php", 
        data: {round:round,tbl:'acros'},
        success : function(data)
        {
            console.log(data)
            data = data.split("__").clean("")
            console.log(data)
            var split = data[0].split("||")
            console.log(split)
            currentAcro = split[0]
            currentTheme = split[1]
            document.getElementById('acro-theme').innerHTML = "Theme: " + currentTheme
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}

function sendMessage(username,message) {
    var dateNow = Date.now().toString()
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/sendmessage.php", 
        data: {username:username,message:message,date:dateNow,tbl:'chat'},
        success : function(data)
        {
            
            // chatInput.value = ""
            // chatInput.style.color = "black"
            chatButton.disabled = false
            updateChatBox(true)
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}
function addUser(username) {
    var dateNow = Date.now().toString()
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/adduser.php", 
        data: {username:username,date:dateNow,tbl:'users'},
        success : function(data)
        {
            console.log("added " + username)
            if (users.indexOf(username)===-1) {
                users.push(username)    
                document.getElementById('user-list').innerHTML += "<div class='throbber' id='"+username+"'>"+username+"</div>"
            } else {
                setUserReady(username,0)
                readyUsers.splice(readyUsers.indexOf(username),1)
                console.log(username + " already in users, removed from readyusers and set unready")
            }
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function setUserReady(username,ready) {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/setuserready.php", 
        data: {username:username,ready:ready,tbl:'users'},
        success : function(data)
        {
            if (ready==1) {
                console.log("set " + username + " ready")
                document.getElementById(username).style.color = "green"
                document.getElementById("ready-button").style.display = "none"
                if (readyUsers.indexOf(username)===-1) {
                    readyUsers.push(username)
                    // checkReadiness()
                } else {
                    console.log(username + " already ready")
                }
                // checkReadiness()
            } else {
                document.getElementById(username).style.color = "yellow"
                document.getElementById("ready-button").style.display = "block"
            }
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function checkReadiness() {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/checkacroreadiness.php", 
        data: {tbl:'users'},
        success : function(data)
        {
            console.log(data)
            data = data.split("-").clean("")
            console.log(data)
            if (!roundBegun && data.indexOf("0")===-1) {
                console.log("ALL ARE READY!------------")
                displayAcro(currentAcro)
            } else {
                console.log("data contains zeroes!")
            }
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function checkSubmitted() {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/checksubmitted.php", 
        data: {tbl:'users'},
        success : function(data)
        {
            console.log(data)
            data = data.split("-").clean("")
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function removeUser(username) {
    var dateNow = Date.now().toString()
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/removeuser.php", 
        data: {username:username,tbl:'users'},
        success : function(data)
        {
            console.log("removed " + username)   
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}

function handshake(username) {
    var dateNow = Date.now().toString()
    // console.log("shake date " + dateNow)
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/handshake.php", 
        data: {username:username,date:dateNow,tbl:'users'},
        success : function(data)
        {
            // console.log("shook " + username)

            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function checkHandshakes() {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/checkhandshakes.php", 
        data: {username:username,date:dateNow,tbl:'users'},
        success : function(data)
        {
            // console.log("shook " + username)

            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}

function getSubmissions() {
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/getsubmissions.php", 
        data: {round:round},
        success : function(data)
        {
            console.log(data)
            data = data.split("__").clean("")
            for (var u=0;u<data.length;u++) {
                var split = data[u].split("||")
                console.log(split)
                var user = split[0]
                var phrase = split[1]
                var votes = split[2]
                document.getElementById('submitted-acros').innerHTML += '<div id="'+user+'-acro" class="user-acro">'+phrase+'<div class="vote-count">Votes: '+votes+'</div></div>'
            }
            for (var c=0;c<document.getElementById('submitted-acros').children.length;c++) {
                var panel = document.getElementById('submitted-acros').children[c]
                console.log("seting panel " + c)
                console.log(panel)
                panel.onclick = function(){
                    if (this.style.backgroundColor!=="lightgreen") {
                        this.style.backgroundColor = "lightgreen"
                        
                    } else {
                        this.style.backgroundColor = "transparent"
                    }
                
                }
            }
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}
function getUserData() {
    each(users,function(username){
        // if (document.getElementById(username)) {
        //     document.getElementById(username).style.color = '#69aa36'
        // }
    })
    var dateNow = Date.now().toString()
    // console.log("date " + dateNow)
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/getusers.php", 
        
        success : function(data)
        {
            
            data = data.split("__").clean("")
            var dateNow = Date.now()
            var subTotal = 0
            var readyTotal = 0
            for (var u=0;u<data.length;u++) {
                var split = data[u].split("||")
                var username = split[0]
                var lastPing = split[1]
                var ready = split[2]
                var submitted = split[3]
                // console.log(username + " submitted? " + submitted)
                var pingLimit = updateFrequency*500
                if (dateNow-lastPing < pingLimit) {
                    // document.getElementById(username).style.color = "green"
                    // console.log(username + " ping age OKAY at " + (dateNow-lastPing))
                    if (users.indexOf(username)===-1) {
                        users.push(username)
                        
                        document.getElementById('user-list').innerHTML += "<div class='throbber' id='"+username+"'>"+username+"</div>"
                    }
                    if (ready==1) {
                        readyTotal++
                        if (readyUsers.indexOf(username)===-1) {
                            readyUsers.push(username)
                            document.getElementById(username).style.color = "green"
                            
                        }
                    } else {
                        if (readyUsers.indexOf(username)!==-1) {
                            document.getElementById(username).style.color = "yellow"
                            readyUsers.splice(readyUsers.indexOf(username),1)
                        }
                    }
                    if (submitted==1) {
                        subTotal++
                        document.getElementById(username).style.fontWeight = "bold"
                        document.getElementById(username).style.color = "lightgreen"
                    } else {
                        document.getElementById(username).style.fontWeight = "normal"
                    }

                    // if (counter > 60 && users.length === readyUsers.length && !roundBegun) {
                    //     console.log(readyUsers)
                    //     console.log(users)
                    //     displayAcro(currentAcro)
                    // }

                    // if (document.getElementById(username)) {
                    //     document.getElementById(username).style.color = 'green'
                    // }
                    // setTimeout(function(){
                    //     document.getElementById(username).style.color = '#69aa36'
                    //     setTimeout(function(){
                    //         document.getElementById(username).style.color = 'green'
                    //     },100)
                    // },100)
                } else {
                    console.log(username + " too old ping at " + (dateNow-lastPing))
                    if (users.indexOf(username)!==-1) {
                        users.splice(users.indexOf(username),1)
                        document.getElementById(username).parentElement.removeChild(document.getElementById(username))
                        // document.getElementById('user-list').innerHTML += username+" too old ping at " + (dateNow-lastPing)
                    }
                    removeUser(username)
                }
            }
            if (subTotal===data.length && !votingBegun) {
                console.log("ALL SUBMITTED!!-------------------------------")
                clearInterval(acroTimer)
                document.getElementById('timer').style.opacity = "0"
                timerStarted = false
                beginVotingRound()
            }
            if (readyTotal===data.length && !roundBegun) {
                console.log("ALL READY!!-------------------------------")
                
                displayAcro(currentAcro)
                
            }
            
            // console.log("LOCAL USERS -------------------")
            // console.log(users)
            // console.log("DB USERS -------------------")
            // console.log(data)
            
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
function sendSubmission(username,phrase) {
    console.log("it's round " + round)
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/savesubmission.php", 
        data: {round:round,username:username,phrase:phrase,acro:currentAcro,tbl:'submissions'},
        success : function(data)
        {
            console.log("sent submission!")
            document.getElementById('acro-field').value = "Submitted!"
            document.getElementById('acro-submit-button').disabled = true
            document.getElementById(username).style.fontWeight = "bold"
            document.getElementById(username).style.color = "lightgreen"
            // checkSubmitted()
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        console.log("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
    if (!username) {
        username = "anonymous"
    }
    currentUser = username
    addUser(username)
}
function sendChatMessage() {

    sendMessage(currentUser,chatInput.value)
    // chatInput.style.color = 'grey'
    // chatInput.value = "sending..."
    chatInput.value = ""
    chatButton.disabled = true
    
}
function removeChatEntry(id) {
    var dateNow = Date.now().toString()
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/removechatentry.php", 
        data: {id:id,tbl:'chat'},
        success : function(data)
        {
            console.log("removed " + id)   
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });

}
var chatLimit = 12
function updateChatBox(scroll) {
    var initialEntries = chatBox.children.length
    var changed = false
    $.ajax({ type: "post",   
        url: "http://www.eggborne.com/scripts/getchat.php", 
        // data: {username:username,message:message,date:dateNow,tbl:'chat'},
        success : function(data)
        {
            
            chatBox.innerHTML = ""
            data = data.split("__").clean("")
            data = data.reverse()
            each(data,function(entry){
                if (chatBox.children.length > chatLimit) {
                    console.log("oh snap, length is " + chatBox.children.length)
                    removeChatEntry(chatBox.children[0].id)
                    console.log("removing first " + chatBox.children[0].id)
                    changed = true
                }
                var split = entry.split("||")
                var username = split[0]
                var message = split[1]
                var date = prettyDate(split[2],true).slice(11,19)
                var id = split[3]
                
                chatBox.innerHTML += "<div id='"+id+"'><div class='chat-entry'>" + username + ": " + message + "</div><div style='float:right;display:inline;font-size:0.75em;float:right'>" + date + "</div></div>"

            })
            if (scroll || changed) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        },
        error: function(){
            console.log('Could not connect to post!')
        }
    });
}