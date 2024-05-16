#pragma strict
// FPS KIT [www.armedunity.com]

var explosion : GameObject;
private var activated : boolean = false;

function OnTriggerEnter (other : Collider) { 
    if (other.CompareTag ("Enemy") || other.CompareTag ("Player")) 
       Explosion();
}

function ApplyDamage(){
	yield WaitForSeconds(.2);
	Explosion();
}

function Explosion(){
	if(activated) return;
	activated = true;

	Instantiate (explosion, transform.position, transform.rotation);
	Destroy(gameObject);
}

