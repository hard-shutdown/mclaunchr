var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
app.get('/authfinish', function (req, res) {
	window.auth = {
		'id': req.query.id,
		'access_token': req.query.access_token,
		'name': req.query.name
	}
	res.end(atob(
		'PHNjcmlwdD53aW5kb3cuY2xvc2UoKTwvc2NyaXB0Pg=='
	));
	postAuth();
	console.log(
		`Authorized As: ${window.auth.name}`
	);
})

fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then(res => res.json()).then(json => {
	Object.entries(json.versions).forEach(([key, value]) => {
    	if(json.versions[key].type === "release"){
			console.log(json.versions[key])
			var a = document.createElement("option");
		  	a.value = json.versions[key].id;
		  	const str = json.versions[key].type;
		  	const str2 = str.charAt(0).toUpperCase() + str.slice(1);
		  	a.innerHTML = str2 + " " + json.versions[key].id;
		  	document.getElementById("versionselect").appendChild(a)
	  }
    })
})

function postAuth(){
	window.document.getElementById("welcomeu").innerHTML = `Welcome, ${window.auth.name}`
	window.document.getElementById("afterauth").style.display = '';
	window.document.getElementById("versionselect").style.display = 'block';
	var a = window.document.getElementById("beforeauth")
	a.parentNode.removeChild(a)
}


function chgVersion(){
	var a = document.getElementById("versionselect").value;
	if (a != "") {
		document.getElementById("launch").innerHTML = "LAUNCH MINECRAFT " + a;
		window.selV = a;
		document.getElementById("launch").disabled = false;
	} else {
		document.getElementById("launch").disabled = true;
		document.getElementById("launch").innerHTML = "LAUNCH MINECRAFT " + a;
	}
	
}

function startMC(version) {
	var mcDir = require(
		"minecraft-folder-path");
	const {
		Client,
		Authenticator
	} = require('minecraft-launcher-core');
	window.launcher = new Client();
	let opts = {
		clientPackage: null,
		authorization: {
			access_token: window.auth.access_token,
			client_token: '',
			uuid: window.auth.id,
			name: window.auth.name,
			user_properties: '{}',
			meta: {
				type: 'msa',
				demo: false,
				// properties only exists for specific Minecraft versions.
				xuid: '',
				clientId: ''
			}
		},
		//customArgs: "".split(" "),
		javaPath: path.join(global.__dirname,
			"java", "bin", "java.exe"),
		root: mcDir,
		version: {
			number: version,
			type: "release"
		},
		overrides: {
			gameDirectory: mcDir
		},
		memory: {
			max: "1500M",
			min: "128M"
		}
	}
	launcher.launch(opts);
	launcher.on('debug', (e) => console.log(e));
	launcher.on('data', (e) => console.log(e));
}
app.listen(8867);
process.env.PATH = "";