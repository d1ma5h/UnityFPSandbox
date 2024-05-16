#pragma strict
// FPS KIT [www.armedunity.com]

var currentScore : int = 0; 	
var hitCrosshairTexture : Texture;
private var alphaHit : float;
var hitSound : AudioClip;
	
var mySkin : GUISkin;
	
var pointsToNextRank : int = 50;
var lvl : int = 0;
var levelUpSound : AudioClip;
private var playerDead : boolean = false;
var aSource : AudioSource;

function Update () {
	if (alphaHit > 0) 
		alphaHit -= Time.deltaTime;
}

function DrawCrosshair(){
	yield WaitForSeconds(0.05);
	alphaHit = 1.0;
	aSource.PlayOneShot(hitSound, 0.2);
}

function addScore(val : int){
	currentScore += val;
	
	if(currentScore >= pointsToNextRank){
		lvl++;
		aSource.PlayOneShot(levelUpSound, 0.2);	
		pointsToNextRank += currentScore;
	}
}

function PlayerDead(){
	playerDead = true;
}

function OnGUI(){
	if(playerDead) return;
	
	GUI.skin = mySkin;
	GUI.depth = 2;
	
	GUI.Label (Rect(40, Screen.height - 80,100,60)," SCORE :");
	GUI.Label (Rect(100, Screen.height - 80,160,60),"" + currentScore, mySkin.customStyles[0]);
	
	GUI.Label (Rect(40, Screen.height - 110,100,60)," LVL :");
	GUI.Label (Rect(100, Screen.height - 110,160,60),"" + lvl, mySkin.customStyles[0]);
	
	GUI.color = Color(1.0, 1.0, 1.0, alphaHit);
	GUI.DrawTexture (Rect ((Screen.width /2) - 16, (Screen.height/2) - 16, 32, 32), hitCrosshairTexture);
}	