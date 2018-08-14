<html>
	<head>
		<meta charset="UTF-8">
		<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<title>Acrophobia</title>
		<link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
		<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/solid.js" integrity="sha384-+Ga2s7YBbhOD6nie0DzrZpJes+b2K1xkpKxTFFcx59QmVPaSA8c7pycsNaFwUK6l" crossorigin="anonymous"></script>
		<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/fontawesome.js" integrity="sha384-7ox8Q2yzO/uWircfojVuCQOZl+ZZBg2D2J5nkpLqzH1HY0C1dHlTKIbpRz/LG23c" crossorigin="anonymous"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" type="text/css" href="css/styles.css">
	</head>
	<body onload="checkCookie()" oncontextmenu="return false">
		<div id="bg">
			<div id="user-list">
				<div id="user-label">PLAYERS</div>
			</div>
			<div id="acro-display">
				<div id="acro-theme"></div>
				<div class="acro-char" id="acro0"></div>
				<div class="acro-char" id="acro1"></div>
				<div class="acro-char" id="acro2"></div>
				<div class="acro-char" id="acro3"></div>
			</div>
			<div id="progress-display">
				<div id="timer">30</div>
				<div id="status">
					waiting for players to be ready...
				</div>
			</div>
			<div id="chat-box"></div>
			<div id="chat-field">
				<input placeholder="chat here..." type="text" id="chat-input"></input>
				<button onclick="sendChatMessage()" id="chat-button">Chat</button>
			</div>
			<div id="acro-input">
				<!-- <div id="acro-instructions"></div> -->
				<input disabled placeholder="put acronym here..." type="text" id="acro-field"></input>
				<button disabled onclick="submitAcro()" id="acro-submit-button">Submit</button>
				<button onclick="setUserReady(currentUser,1)" id="ready-button">READY!</button>
				<!-- <button onclick="beginVotingRound()" id="acro-submit-button">Submit</button> -->
			</div>
			<div id="voting-screen">
				Select your favorite acronym:
				<div id="submitted-acros"></div>
				<div id="vote-timer">30</div>
			</div>
		</div>
		<script src="js/db.js"></script>
		<script src="js/util.js"></script>
		<script src="js/board.js"></script>
		<script src="js/init.js"></script>
	</body>
</html>