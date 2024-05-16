#pragma strict

var	hitPrefab : GameObject;	

function OnTriggerEnter () {
	Instantiate( hitPrefab, transform.position, transform.rotation );
}

function OnCollisionEnter(col : Collision){
    var contact : ContactPoint = col.contacts[0];
    Instantiate( hitPrefab, contact.point, Quaternion.LookRotation(contact.normal)); 
}