#pragma strict
// FPS KIT [www.armedunity.com]

var timeOut : float = 1.0;
var detachChildren : boolean = false;

function Awake (){
	Invoke ("DestroyNow", timeOut);
}

function DestroyNow (){
	if (detachChildren) 
		transform.DetachChildren ();
	
	Destroy(gameObject);
}