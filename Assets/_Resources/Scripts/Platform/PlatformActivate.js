#pragma strict
// FPS KIT [www.armedunity.com]

var gateAnims : Animation;
var aSource : AudioSource;
var sounds : AudioClip[];
var anims : String[] = [ "PlatformUp", "PlatformDown"];
var waitTime : float = 4.0;
private var state : int = 0;
private var inTransition : boolean = false;


function ApplyDamage(){
	Action ();
}

function Action(){
	if(inTransition) return;
	inTransition = true;
	
	aSource.clip = sounds[state];	
	aSource.Play();
	gateAnims.CrossFade(anims[state]);
	state = state ? 0 : 1;
	yield WaitForSeconds(waitTime);
	
	inTransition = false;
}
