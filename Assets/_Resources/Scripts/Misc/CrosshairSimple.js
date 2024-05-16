#pragma strict
// FPS KIT [www.armedunity.com]

@script ExecuteInEditMode()
var crosshair : Texture2D;

function OnGUI () {
	var w : float = crosshair.width/2;
	var h : float = crosshair.height/2;
	var pos = Rect((Screen.width - w)/2,(Screen.height - h )/2, w, h);

	if (!Input.GetButton ("Fire2")) { 
		GUI.DrawTexture(pos, crosshair);
	}
}	