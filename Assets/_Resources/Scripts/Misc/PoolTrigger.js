#pragma strict
// FPS KIT [www.armedunity.com]

function OnTriggerEnter (other : Collider) {
	if(other.CompareTag("Player"))
		other.SendMessage("PlayerInWater", transform.position.y, SendMessageOptions.DontRequireReceiver);
}