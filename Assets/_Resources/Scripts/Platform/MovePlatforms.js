#pragma strict
// FPS KIT [www.armedunity.com]

enum dir {Horizontal, Vertical}
var movement : dir = movement.Horizontal;

var dist : float = 10;
var movementSpeed : float = 3.0;
private var startPos : float;

function Start(){
	if(movement == movement.Horizontal)
		startPos = transform.position.x;
	else	
		startPos = transform.position.y;
}

 function Update () {
	if(movement == movement.Horizontal)
		transform.position = Vector3(startPos + Mathf.PingPong(Time.time * movementSpeed, dist), transform.position.y, transform.position.z);
	else	
		transform.position = Vector3(transform.position.x, startPos + Mathf.PingPong(Time.time * movementSpeed, dist), transform.position.z);
}