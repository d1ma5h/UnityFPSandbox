#pragma strict
// FPS KIT [www.armedunity.com]

var maxRayDistance : float = 2.0; 
var layerMask : LayerMask;
var mySkin : GUISkin;
var showGui : boolean = false;
var hit : RaycastHit;

function Update() {
	var dir : Vector3 = gameObject.transform.TransformDirection(Vector3.forward);
	if (Physics.Raycast(transform.position, dir, hit, maxRayDistance, layerMask)) {
		showGui = true;
		if(Input.GetButtonDown("Use")) {
			var target : GameObject = hit.collider.gameObject;
			target.BroadcastMessage("Action");
		}		
	}else{
		showGui = false;
	}
}

function OnGUI(){
	if(showGui){
		GUI.Label(Rect(Screen.width/2 - 400,Screen.height - (Screen.height/1.4),800,100),"Press key <color=#88FF6AFF> << E >> </color> to Use", mySkin.customStyles[1]);	
	}
}
