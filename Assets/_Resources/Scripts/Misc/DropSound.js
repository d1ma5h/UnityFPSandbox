#pragma strict
// FPS KIT [www.armedunity.com]

var sound : AudioClip[];
var aSource : AudioSource;

function OnCollisionEnter (collision : Collision) {
	PlayDropSound();
}

function PlayDropSound (){
	aSource.clip = sound[Random.Range(0, sound.length)];
	aSource.volume = .7;
	aSource.Play();
}