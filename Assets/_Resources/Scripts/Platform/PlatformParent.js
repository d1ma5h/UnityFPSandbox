#pragma strict
// FPS KIT [www.armedunity.com]

var platform : Transform;
private var player : Transform;
private var cc : CharacterController;

function OnTriggerEnter (other : Collider) {
	if(player) return;	
	
	if(other.CompareTag("Player")){
		player = other.transform;
		player.transform.parent = platform.transform;
		cc = player.GetComponent(CharacterController);
		CheckStatus();
	}
}

function CheckStatus(){
	
	while(player){
		if(!cc.isGrounded) {
			player.parent = null;
			player = null;
			cc = null;
		}	
		yield;
	}
}

//function OnTriggerExit (hit : Collider) {	
//	if(player) player.parent = null;
//}