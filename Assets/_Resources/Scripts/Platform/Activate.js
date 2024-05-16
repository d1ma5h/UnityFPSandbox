#pragma strict
// FPS KIT [www.armedunity.com]

var GO : GameObject;

function ApplyDamage (s : float){
	Action ();
}

function Action(){
	GO.SendMessage("Action", SendMessageOptions.DontRequireReceiver);
}