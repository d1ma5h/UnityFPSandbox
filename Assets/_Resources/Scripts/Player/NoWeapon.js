#pragma strict
// FPS KIT [www.armedunity.com]

var cSize : float = 32.0;
var crossTexture : Texture2D;

function Start () {
}

function OnGUI(){
	var pos : Rect = Rect((Screen.width - cSize)/2,(Screen.height - cSize)/2, cSize, cSize);
	GUI.DrawTexture(pos, crossTexture);
}

function DrawWeapon(){
}

function Deselect(){
}