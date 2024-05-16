#pragma strict
//  FPS Kit [www.armedunity.com]

var gateAnims : Animation;
var aSource : AudioSource;
var sounds : AudioClip[];
var anims : String[] = [ "OpenGate", "CloseGate"];
private var state : int = 0;
private var inTransition : boolean = false;
var map : GameObject;

function Action(){
	if(inTransition) return;
	inTransition = true;
	
	if(!map.activeSelf) 
		map.SetActive(true);
		
	aSource.clip = sounds[state];	
	aSource.Play();
	gateAnims.Play(anims[state]);
	state = state ? 0 : 1;
	yield WaitForSeconds(1.5);
	
	inTransition = false;
}