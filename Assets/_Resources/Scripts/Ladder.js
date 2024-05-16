#pragma strict

private var climbDir : Vector3 = Vector3.zero;
var col : BoxCollider;

function Start () {
	climbDir = (transform.position + Vector3(0, col.size.y/2, 0)) - (transform.position - Vector3(0, col.size.y/2, 0));
}

function ClimbDirection () {
	return climbDir;
}

