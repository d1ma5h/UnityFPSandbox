#pragma strict
// FPS KIT [www.armedunity.com]

function Start(){
	Application.targetFrameRate = 120;

#if UNITY_EDITOR
	Cursor.visible = true;
	Cursor.lockState = CursorLockMode.None;
#else	
	Cursor.visible = false;
	Cursor.lockState = CursorLockMode.Locked;
#endif
}

function OnGUI(){

	 if (Event.current.type == EventType.KeyDown){
		/*
		if (Event.current.keyCode == KeyCode.P){
			Screen.SetResolution (1920, 1080, true);
			Cursor.visible = false;
			Cursor.lockState = CursorLockMode.Locked;
		}
		*/	
        if (Event.current.keyCode == KeyCode.Escape){
			Cursor.visible = true;
			Cursor.lockState = CursorLockMode.None;
		}
	}	
		
	if(Cursor.lockState == CursorLockMode.None){
		if(GUI.Button(Rect(Screen.width -120, 20, 100, 30), "Lock Cursor" )){
			Cursor.visible = false;
			Cursor.lockState = CursorLockMode.Locked;
		}	
	}
}
	 
		 