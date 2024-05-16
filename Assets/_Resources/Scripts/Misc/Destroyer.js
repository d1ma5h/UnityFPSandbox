#pragma strict
// FPS KIT [www.armedunity.com]

var e : ParticleEmitter;

function DestroyNow() {
	e.emit = false;
	Destroy(gameObject, 5.0);
}