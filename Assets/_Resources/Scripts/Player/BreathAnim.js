#pragma strict
// FPS KIT [www.armedunity.com]

var anim : Animation;
var breathAnim : String = "Breath";
var idleAnim : String = "BreathIdle";

function Update () {
	if(!Input.GetButton("Fire2"))
		anim.Play(breathAnim);
	else
		anim.CrossFade(idleAnim);
}

