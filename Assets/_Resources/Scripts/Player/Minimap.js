#pragma strict
// FPS KIT [www.armedunity.com]

//@script ExecuteInEditMode()
var minimapSize : float = 2.0;
private var offsetX : float = 10.0;
private var offsetY : float = 10.0;
private var adjustSize : float = 0.0;

var borderTexture : Texture;
var effectTexture : Texture;
var minimapCamera : Camera;

function Start(){
	minimapCamera.enabled = true;
}

function Update() { 
	adjustSize = Mathf.RoundToInt(Screen.width/10);
	minimapCamera.pixelRect = new Rect(offsetX, (Screen.height -(minimapSize  * adjustSize)) - offsetY, minimapSize  * adjustSize, minimapSize * adjustSize);
}

function OnGUI(){
	minimapCamera.Render ();
	GUI.DrawTexture(Rect(offsetX, offsetY, minimapSize  * adjustSize, minimapSize * adjustSize), effectTexture);
	GUI.DrawTexture(Rect(offsetX, offsetY, minimapSize  * adjustSize, minimapSize * adjustSize), borderTexture);
}

