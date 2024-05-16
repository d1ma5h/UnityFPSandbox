#pragma strict
// FPS Kit [www.armedunity.com]

var concrete : AudioClip[];
var grass : AudioClip[];
var wood : AudioClip[];
var dirt : AudioClip[];
var metal : AudioClip[];

private var audioStepLengthCrouch : float = 0.75;
private var audioStepLengthWalk : float = 0.45;
private var audioStepLengthRun : float = 0.25;
private var minWalkSpeed : float = 5;
private var maxWalkSpeed : float = 9.0;
private var audioVolumeCrouch : float = 0.1;
private var audioVolumeWalk : float = 0.2;
private var audioVolumeRun : float = 0.3;
private var step : boolean = true;
var soundsGO : AudioSource; 
var cc : CharacterController;
var fpscontroller : FPSController;
private var curMat : String;

function OnEnable () {
	step = true;
}

function OnControllerColliderHit (hit : ControllerColliderHit) {
	var speed : float = cc.velocity.magnitude;
	curMat = hit.gameObject.tag;
	
	// Push Rigidbodys
	var body : Rigidbody = hit.collider.attachedRigidbody;
	if (body != null && !body.isKinematic && body.mass < 10){
		var pushDir : Vector3 = Vector3(hit.moveDirection.x, 0, hit.moveDirection.z);
		body.velocity += pushDir * 5;
	  //body.velocity += cc.velocity;
	}
    
	if(fpscontroller.state == 2 || !step) return;
	
	if (cc.isGrounded && hit.normal.y > 0.3 ){
		
		if( curMat == "Untagged" || curMat == "Concrete"){
			if( speed > maxWalkSpeed) RunOnConcrete();
			else if( speed < maxWalkSpeed && speed > minWalkSpeed) WalkOnConcrete();
			else if( speed < minWalkSpeed && speed > 0.5) CrouchOnConcrete();
		
		}else if( curMat == "Grass"){
			if( speed > maxWalkSpeed) RunOnGrass();
			else if( speed < maxWalkSpeed && speed > minWalkSpeed) WalkOnGrass();
			else if( speed < minWalkSpeed && speed > 0.5) CrouchOnGrass();
			
		}else if( curMat == "Wood"){
			if( speed > maxWalkSpeed) RunOnWood();
			else if( speed < maxWalkSpeed && speed > minWalkSpeed) WalkOnWood();
			else if( speed < minWalkSpeed && speed > 0.5) CrouchOnWood();

		}else if( curMat == "Dirt"){
			if( speed > maxWalkSpeed) RunOnDirt();
			else if( speed < maxWalkSpeed && speed > minWalkSpeed) WalkOnDirt();
			else if( speed < minWalkSpeed && speed > 0.5) CrouchOnDirt();
			
		}else if( curMat == "Metal"){
			if( speed > maxWalkSpeed) RunOnMetal();
			else if( speed < maxWalkSpeed && speed > minWalkSpeed) WalkOnMetal();
			else if( speed < minWalkSpeed && speed > 0.5) CrouchOnMetal();
		}	
	}
}	

function JumpLand(){
	if(!soundsGO.enabled) return;
	
	if(curMat == "Untagged" || curMat == "Concrete"){
		soundsGO.PlayOneShot(concrete[Random.Range(0, concrete.Length)], 0.5);
			yield WaitForSeconds(0.1);
		soundsGO.PlayOneShot(concrete[Random.Range(0, concrete.Length)], 0.4);
	} else if(curMat == "Grass"){
		soundsGO.PlayOneShot(grass[Random.Range(0, grass.Length)], 0.5);
			yield WaitForSeconds(0.12);
		soundsGO.PlayOneShot(grass[Random.Range(0, grass.Length)], 0.4);			
	} else if(curMat == "Wood"){
		soundsGO.PlayOneShot(wood[Random.Range(0, wood.Length)], 0.5);
			yield WaitForSeconds(0.12);
		soundsGO.PlayOneShot(wood[Random.Range(0, wood.Length)], 0.4);		
	} else if(curMat == "Dirt"){
		soundsGO.PlayOneShot(dirt[Random.Range(0, dirt.Length)], 0.5);
			yield WaitForSeconds(0.11);
		soundsGO.PlayOneShot(dirt[Random.Range(0, dirt.Length)], 0.4);	
	}else if(curMat == "Metal"){
		soundsGO.PlayOneShot(metal[Random.Range(0, metal.Length)], 0.5);
			yield WaitForSeconds(0.12);
		soundsGO.PlayOneShot(metal[Random.Range(0, metal.Length)], 0.4);
	}	
}


// Concrete	or Untagged
function CrouchOnConcrete() {
	step = false;
	soundsGO.PlayOneShot(concrete[Random.Range(0, concrete.Length)], audioVolumeCrouch);
	yield WaitForSeconds (audioStepLengthCrouch);
	step = true;
}

function WalkOnConcrete() {
	step = false;
	soundsGO.PlayOneShot(concrete[Random.Range(0, concrete.Length)], audioVolumeWalk);
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnConcrete() {
	step = false;
	soundsGO.PlayOneShot(concrete[Random.Range(0, concrete.Length)], audioVolumeRun);
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}

// Grass
function CrouchOnGrass() {
	step = false;
	soundsGO.PlayOneShot(grass[Random.Range(0, grass.Length)], audioVolumeCrouch);
	yield WaitForSeconds (audioStepLengthCrouch);
	step = true;
}

function WalkOnGrass() {
	step = false;
	soundsGO.PlayOneShot(grass[Random.Range(0, grass.Length)], audioVolumeWalk);
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnGrass() {
	step = false;
	soundsGO.PlayOneShot(grass[Random.Range(0, grass.Length)], audioVolumeRun);
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}

// Wood
function CrouchOnWood() {
	step = false;
	soundsGO.PlayOneShot(wood[Random.Range(0, wood.Length)], audioVolumeCrouch);
	yield WaitForSeconds (audioStepLengthCrouch);
	step = true;
}

function WalkOnWood() {
	step = false;
	soundsGO.PlayOneShot(wood[Random.Range(0, wood.Length)], audioVolumeWalk);
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnWood() {
	step = false;
	soundsGO.PlayOneShot(wood[Random.Range(0, wood.Length)], audioVolumeRun);
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}

// Dirt
function CrouchOnDirt() {
	step = false;
	soundsGO.PlayOneShot(dirt[Random.Range(0, dirt.Length)], audioVolumeCrouch);
	yield WaitForSeconds (audioStepLengthCrouch);
	step = true;
}

function WalkOnDirt() {
	step = false;
	soundsGO.PlayOneShot(dirt[Random.Range(0, dirt.Length)], audioVolumeWalk);
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnDirt() {
	step = false;
	soundsGO.PlayOneShot(dirt[Random.Range(0, dirt.Length)], audioVolumeRun);
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}

// Metal
function CrouchOnMetal() {
	step = false;
	soundsGO.PlayOneShot(metal[Random.Range(0, metal.Length)], audioVolumeCrouch);
	yield WaitForSeconds (audioStepLengthCrouch);
	step = true;
}

function WalkOnMetal() {
	step = false;
	soundsGO.PlayOneShot(metal[Random.Range(0, metal.Length)], audioVolumeWalk);
	yield WaitForSeconds (audioStepLengthWalk);
	step = true;
}

function RunOnMetal() {
	step = false;
	soundsGO.PlayOneShot(metal[Random.Range(0, metal.Length)], audioVolumeRun);
	yield WaitForSeconds (audioStepLengthRun);
	step = true;
}