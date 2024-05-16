#pragma strict
// FPS KIT [www.armedunity.com]

var hitPoints : float = 50.0;
var sound : AudioClip;

function OnTriggerEnter (other : Collider) { 
	if (other.CompareTag ("Player")){
		other.SendMessageUpwards("Medic", hitPoints, SendMessageOptions.DontRequireReceiver);
		AudioSource.PlayClipAtPoint(sound, transform.position, 0.3);
		Destroy(gameObject);
	}
}