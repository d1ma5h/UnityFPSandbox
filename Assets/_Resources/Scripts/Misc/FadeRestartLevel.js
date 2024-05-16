#pragma strict
import UnityEngine.SceneManagement;
// FPS KIT [www.armedunity.com]

var secBeforeFade : float = 3.0;
var fadeTime : float = 5.0;
var fadeTexture : Texture;
private var fadeIn : boolean = false;
private var tempTime : float;
private var time : float = 0.0;
var die : AudioClip;

function Start(){
	AudioSource.PlayClipAtPoint(die, transform.position);
	yield WaitForSeconds(secBeforeFade);
	fadeIn = true;
}

function Update () {

	if (fadeIn){
		if(time < fadeTime) time += Time.deltaTime;
		tempTime = Mathf.InverseLerp(0.0, fadeTime, time);
	}
	
	if(tempTime >= 1.0) SceneManager.LoadScene(0, LoadSceneMode.Single);
}

function OnGUI(){
	if(fadeIn){
		GUI.color.a = tempTime;
		GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), fadeTexture);
	}
}
