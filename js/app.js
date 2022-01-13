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
	var aa = document.getElementById(
		"authlink")
	aa.parentNode.removeChild(aa)
	//document.getElementById("welcomeu").innerHTML = `Welcome, ${window.auth.name}`
	document.getElementById("launch").style
		.display = '';
	console.log(
		`Authorized As: ${window.auth.name}`
	);
})

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
	launcher.on('debug', (e) => console.log(
		e));
	launcher.on('data', (e) => console.log(
		e));
}
app.listen(8867);
process.env.PATH = "";