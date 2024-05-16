#pragma strict
// FPS KIT [www.armedunity.com]

var vel : float = 1.0;
var aSource : AudioSource;
var rb : Rigidbody;

function OnTriggerEnter (other : Collider) {
	vel = rb.velocity.magnitude;
	if(vel > 1){
		aSource.volume = vel/40;
		aSource.Play ();
		if(other.CompareTag ("Enemy") || other.CompareTag ("Metal")){
			other.BroadcastMessage("ApplyDamage", vel * 3000, SendMessageOptions.DontRequireReceiver);
		}	
	}	
}


