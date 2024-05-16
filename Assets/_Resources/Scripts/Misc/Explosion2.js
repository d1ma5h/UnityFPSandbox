#pragma strict

var explosionRadius : float = 5.0;
var explosionPower : float = 10.0;
var explosionDamage : float = 100.0;
var explosionTimeout : float = 2.0;
var explosionSounds : AudioClip[];
var aSource : AudioSource;

function Start () {
	
	var explosionPosition : Vector3 = transform.position;

	// Apply damage to close by objects first
	var colliders : Collider[] = Physics.OverlapSphere (explosionPosition, explosionRadius);
	for (var hit in colliders) {
		// Calculate distance from the explosion position to the closest point on the collider
		var closestPoint : Vector3 = hit.ClosestPointOnBounds(explosionPosition);
		var distance : float = Vector3.Distance(closestPoint, explosionPosition);

		// The hit points we apply fall decrease with distance from the explosion point
		var hitPoints : float = 1.0 - Mathf.Clamp01(distance / explosionRadius);
		hitPoints *= explosionDamage;

		// Tell the rigidbody or any other script attached to the hit object how much damage is to be applied!
		hit.SendMessageUpwards("ApplyDamage", hitPoints, SendMessageOptions.DontRequireReceiver);
		hit.SendMessageUpwards("PlayerDamage", hitPoints, SendMessageOptions.DontRequireReceiver);
		hit.SendMessageUpwards("Shake", hitPoints, SendMessageOptions.DontRequireReceiver);
	}

	// Apply explosion forces to all rigidbodies
	// This needs to be in two steps for ragdolls to work correctly.
	// (Enemies are first turned into ragdolls with ApplyDamage then we apply forces to all the spawned body parts)
	colliders = Physics.OverlapSphere (explosionPosition, explosionRadius);
	for (var hit in colliders) {
		if (hit.GetComponent.<Rigidbody>())
			hit.GetComponent.<Rigidbody>().AddExplosionForce(explosionPower, explosionPosition, explosionRadius, 3.0);
	}
	
	PlaySounds();
}

function PlaySounds () {
	if(explosionSounds.length > 0){
		aSource.clip = explosionSounds[Random.Range(0, explosionSounds.length)];
		aSource.Play();
	}
	
	Destroy (gameObject, explosionTimeout);
}	