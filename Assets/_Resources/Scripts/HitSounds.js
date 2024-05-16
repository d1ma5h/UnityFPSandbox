#pragma strict
// FPS KIT [www.armedunity.com]

var vel : float = 1.0;
var aSource : AudioSource;
var rb : Rigidbody;

function OnCollisionEnter (col : Collision) {
	vel = rb.velocity.magnitude;
	if(vel > 1){
		aSource.volume = vel/10;
		aSource.Play ();
	}	
}