#pragma strict
// FPS KIT [www.armedunity.com]

private var weaponCamera : GameObject;  
var vehicleCam : GameObject;			
var vehicleCameraTarget : Transform;
var vehicle : GameObject; 
private var Player : GameObject;
var GetOutPosition : Transform;  					
private var waitTime : float = 0.5; 					

private var mainCamera : GameObject;
var inVehicle : boolean = false;	


function Start () {
	vehicleCam.GetComponent.<Camera>().enabled = false;
	vehicle.SendMessage("Status", inVehicle);
	vehicleCam.GetComponent(AudioListener).enabled = false;  
}

function Update() {
	if(!inVehicle) return;
	if(Input.GetKeyDown("e")) GetOut();
}

function Action (){
	if(!inVehicle) GetIn();
}

function GetIn() {
	Player = GameObject.FindWithTag("Player"); 		
	mainCamera = GameObject.FindWithTag("MainCamera");
	weaponCamera = GameObject.FindWithTag("WeaponCamera");
	Player.SetActive(false);

	var changeTarget : VehicleCamera = vehicleCam.transform.GetComponent(VehicleCamera);
	changeTarget.target = vehicleCameraTarget;
	Player.transform.parent = vehicle.transform;
	Player.transform.position = vehicleCameraTarget.transform.position;
	
	weaponCamera.GetComponent.<Camera>().enabled = false;
	mainCamera.GetComponent(AudioListener).enabled = false;
	mainCamera.GetComponent.<Camera>().enabled = false;
	
	vehicleCam.GetComponent.<Camera>().enabled = true;
	vehicle.SendMessage("Status", true);

	vehicleCam.GetComponent(AudioListener).enabled = true;
	yield WaitForSeconds(waitTime);
	inVehicle = true;
}


function GetOut() {
	
	Player.transform.parent = null;
	Player.transform.position = GetOutPosition.position;
	Player.SetActive(true);
	Player.SendMessage("SetRotation", GetOutPosition.transform.rotation.eulerAngles.y);
	
	weaponCamera.GetComponent.<Camera>().enabled = true;
	mainCamera.GetComponent(AudioListener).enabled = true;
	mainCamera.GetComponent.<Camera>().enabled = true;
	vehicleCam.GetComponent.<Camera>().enabled = false;
	vehicleCam.GetComponent(AudioListener).enabled = false;
	vehicle.SendMessage("Status", false);
	inVehicle = false;
}


