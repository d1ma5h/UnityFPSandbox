#pragma strict
// FPS Kit [www.armedunity.com]

var proneSpeed : int = 1;
var crouchSpeed : int = 4;
var walkSpeed : int = 6;
var runSpeed : int = 10;
var jumpSpeed : float = 8.0;
private var gravity : float = 24;
var baseGravity : float = 24;
var proneGravity : float = 15;
private var normalFDTreshold : float = 8;
private var proneFDTreshold : float = 4;
private var fallingDamageThreshold : float;
var fallDamageMultiplier : float = 5.0;
private var slideSpeed : float = 8.0;
private var antiBumpFactor = .75;
private var antiBunnyHopFactor : float = 1;
var airControl : boolean = false;

@HideInInspector
var run : boolean;
@HideInInspector
var canRun : boolean = true;

var cameraGO : Transform;
@HideInInspector
var moveDirection = Vector3.zero;
@HideInInspector
var grounded : boolean = false;
private var myTransform : Transform;
@HideInInspector
var speed : float;
private var hit : RaycastHit;
private var fallDistance : float; 
private var falling : boolean = false;
var slideLimit : float = 45.0;
var rayDistance : float;
private var contactPoint : Vector3;
private var jumpTimer : int;
private var normalHeight : float = 0.9;
private var crouchHeight : float = 0.2;
private var proneHeight : float = -0.4;

@HideInInspector
var state : int = 0;
// 0 = standing
// 1 = crouching
// 2 = prone

private var adjustAnimSpeed : float = 7.0;

//Ladders
@HideInInspector
var onLadder = false;
var useladder : UseLadder;

private var currentPosition : Vector3;
private var lastPosition : Vector3;
private var highestPoint : float;
var hs : HealthScript;
var wm : WeaponManager;
var footsteps : FootSteps;

private var crouchProneSpeed : float = 3;
private var distanceToObstacle : float;

private var sliding : boolean = false;
@HideInInspector
var velMagnitude : float;

var controller : CharacterController;
var walkRunAnim : Animation;
var cameraAnimations : Animation;
private var runAnimation : String = "CameraRun";
private var idleAnimation : String = "IdleAnimation";

// WATER
var underWater : boolean = false;
var swimming : boolean = false; 
private var swimAccel : float; 
private var underWaterTimer : float = 0.0;
var blur : UnityStandardAssets.ImageEffects.BlurOptimized;
private var waterLevel : float;
private var underwaterLevel : float;
var aSource : AudioSource;
var waterSource : AudioSource;
var enterPool : AudioClip;
var enterPoolSplash : AudioClip;
var bodyHitSound : AudioClip;
var inhale : AudioClip;

var fallEffect : Transform;
var fallEffectWep : Transform;

var waterSplash : GameObject;
var waterFoam : ParticleEmitter;
private var emiter : ParticleEmitter;

function Start () {

    myTransform = transform;
    rayDistance = controller.height/2 + 1.1;
    slideLimit = controller.slopeLimit - .2;
	walkRunAnim.wrapMode = WrapMode.Loop;
	walkRunAnim.Stop();
	cameraAnimations[runAnimation].speed = 0.8;
}

function Update() {
	
	velMagnitude = controller.velocity.magnitude;
	var inputX : float = Input.GetAxis("Horizontal");
    var inputY : float = Input.GetAxis("Vertical");
    var inputModifyFactor : float = (inputX != 0.0 && inputY != 0.0)? .7071 : 1.0;
	
	if(onLadder) {
		useladder.LadderUpdate();
		highestPoint = myTransform.position.y;
		run = false;
		fallDistance = 0.0;
		grounded = false;
		walkRunAnim.CrossFade(idleAnimation);
		cameraAnimations.CrossFade(idleAnimation);
		return;
	}
	
	if(swimming) {
		highestPoint = myTransform.position.y;
		run = false;
		fallDistance = 0.0;
		grounded = false;
		state = 2;
		walkRunAnim.CrossFade(idleAnimation);
		cameraAnimations.CrossFade(idleAnimation);	
	}
	
    if (grounded) {
		gravity = baseGravity;
		
        if (Physics.Raycast(myTransform.position, -Vector3.up, hit, rayDistance)){
			var hitangle : float = Vector3.Angle (hit.normal, Vector3.up);
            if (hitangle > slideLimit){
				sliding = true;
			}else{
				sliding = false;
			}
        }

		if(canRun && state == 0){
			if(Input.GetButton("Run") && Input.GetKey("w") && !Input.GetButton("Fire2")){
				run = true;
			}else{
				run = false;
			}
		}	
		
		if (falling) {
			if(state == 2) 
				fallingDamageThreshold = proneFDTreshold;
			else
				fallingDamageThreshold = normalFDTreshold;
			
			falling = false;
			fallDistance = highestPoint - currentPosition.y;
			if( fallDistance > fallingDamageThreshold){
				ApplyFallingDamage(fallDistance);
			}
			
			if(fallDistance < fallingDamageThreshold && fallDistance > 0.1){
				if(state < 2) footsteps.JumpLand();
				else if(bodyHitSound) aSource.PlayOneShot(bodyHitSound, 0.5);	
					
				FallCamera(Vector3(7, Random.Range(-1.0, 1.0), 0), Vector3(3, Random.Range(-0.5, 0.5), 0), 0.15);			
			}
		}		
		
        if (sliding){
            var hitNormal : Vector3 = hit.normal;
            moveDirection = Vector3(hitNormal.x, -hitNormal.y, hitNormal.z);
            Vector3.OrthoNormalize (hitNormal, moveDirection);
            moveDirection *= slideSpeed;
        }else{
			
			if(state == 0){
				if (run)
					speed = runSpeed;
				else
					if(Input.GetButton("Fire2")){
						speed = crouchSpeed;
					}else{
						speed = walkSpeed;
					}
				
			}else if(state == 1){
				speed = crouchSpeed;
				run = false;
			}else if(state == 2){
				speed = proneSpeed;
				run = false;
			}	
			if(Cursor.lockState == CursorLockMode.Locked) 
				moveDirection = Vector3(inputX * inputModifyFactor, -antiBumpFactor, inputY * inputModifyFactor); 
			else 
				moveDirection = Vector3(0, -antiBumpFactor, 0);
				
            moveDirection = myTransform.TransformDirection(moveDirection);
			moveDirection *= speed;
	
            if (!Input.GetButton("Jump")){
                jumpTimer++;
			}else if (jumpTimer >= antiBunnyHopFactor){
				jumpTimer = 0;
				if(state == 0){
					moveDirection.y = jumpSpeed;
				}
				
				if(state > 0){
					CheckDistance();
					if(distanceToObstacle > 1.6){
						state = 0;
					}
				}		
			}	
		}
	
    }else{

		currentPosition = myTransform.position;
		if(currentPosition.y > lastPosition.y){
			highestPoint = myTransform.position.y;
			falling = true;
		}

		if(!falling){
			highestPoint = myTransform.position.y;
			falling = true;
		}

		if(airControl){
			moveDirection.x = inputX * speed;
			moveDirection.z = inputY * speed;
			moveDirection = myTransform.TransformDirection(moveDirection);
		}
		
		if(swimming) {		
			if(swimAccel > 0.0)	
				swimAccel -= Time.deltaTime * 4.0; 	

			if(Input.GetButton("Run")){
				var swimDir : Vector3 = cameraGO.transform.TransformDirection(Vector3.forward);
				
				if(transform.position.y >= waterLevel && swimDir.y > 0.0)
					swimDir.y = 0.0;
				
				if(swimAccel <= 1.0) {
					FallCamera(Vector3(7, Random.Range(-5.0, 5.0), 0), Vector3(4, 0, 0), 0.15);
					swimAccel = 6.0;
				}
					
				if(swimAccel > 1.0)
					moveDirection = swimDir * swimAccel;	
				
			}else{	
				moveDirection.x = inputX * 2.0;
				moveDirection.z = inputY * 2.0;
				moveDirection = myTransform.TransformDirection(moveDirection);	
			}
			
			if(underWater){
				underWaterTimer += Time.deltaTime;
				
				if(underWaterTimer > 15.0){
					FallCamera(Vector3(Random.Range(-2.0, 5.0), Random.Range(-7.0, 7.0), 0), Vector3(4, Random.Range(-2.0, 2.0), 0), 0.1);
					hs.PlayerDamage(10);
					underWaterTimer = 12.0;
				}
			}
		}
	}

	if(grounded){
		if(velMagnitude > crouchSpeed && !run){
			walkRunAnim["Walk"].speed = velMagnitude/adjustAnimSpeed;
			walkRunAnim.CrossFade("Walk");
		}else{
			walkRunAnim.CrossFade(idleAnimation);
		}
		
		if(run && velMagnitude > walkSpeed){
			walkRunAnim.CrossFade("Run");
			cameraAnimations.CrossFade(runAnimation);
		}else{
			cameraAnimations.CrossFade(idleAnimation);
		}
		
	}else{
		walkRunAnim.CrossFade(idleAnimation);
		cameraAnimations.CrossFade(idleAnimation);
		run = false;
	}

	if (Input.GetButtonDown("Crouch")) {
		CheckDistance();

		if(state == 0){
		state = 1;
	
		}else if(state == 1){
			if(distanceToObstacle > 1.6){ 
				state = 0;
			}	
		}else if(state == 2){
			if(distanceToObstacle > 1){   
				state = 1;
			}	
		}	
	}
	
	if (Input.GetButtonDown("Prone")){
		CheckDistance();
		if(state == 0 || state == 1){
			state = 2;
		} else if(state == 2){
			if(distanceToObstacle > 1.6){
				state = 0;
			}	
		}
		
		if(!grounded) gravity = proneGravity;
	}
	
	if(state == 0){ //Stand Position
		controller.height = 2.0;
	    controller.center = Vector3 (0, 0, 0);
		
		if(cameraGO.localPosition.y > normalHeight){
			cameraGO.localPosition.y = normalHeight;
		} else if(cameraGO.localPosition.y < normalHeight){
			cameraGO.localPosition.y += Time.deltaTime * crouchProneSpeed;
		}
		
	}else if(state == 1){ //Crouch Position
		
		controller.height = 1.4;
		controller.center = Vector3 (0, -0.3, 0);
		if(cameraGO.localPosition.y != crouchHeight){
			if(cameraGO.localPosition.y > crouchHeight){
				cameraGO.localPosition.y -= Time.deltaTime * crouchProneSpeed;
			}
			if(cameraGO.localPosition.y < crouchHeight){
				cameraGO.localPosition.y += Time.deltaTime * crouchProneSpeed;
			}
			
		}
		
	} else if(state == 2){ //Prone Position
		
		controller.height = 0.6;
		controller.center = Vector3 (0, -0.7, 0);
		
		if(cameraGO.localPosition.y < proneHeight){
			cameraGO.localPosition.y = proneHeight;
		} else if(cameraGO.localPosition.y > proneHeight){
			cameraGO.localPosition.y -= Time.deltaTime * crouchProneSpeed;
		}
	}	

	if(!swimming)
		moveDirection.y -= gravity * Time.deltaTime;
	
	grounded = (controller.Move(moveDirection * Time.deltaTime) & CollisionFlags.Below) != 0;
}	

	function CheckDistance(){
		var pos : Vector3 = myTransform.position + controller.center - Vector3(0, controller.height/2, 0);
		var hit : RaycastHit;
		if(Physics.SphereCast(pos, controller.radius, myTransform.up, hit, 10)){
			distanceToObstacle = hit.distance;
			Debug.DrawLine ( pos, hit.point, Color.red, 2.0);
		}else{
			distanceToObstacle = 3;
		}
	}

	function LateUpdate(){
		lastPosition = currentPosition;
		
		if(swimming){
			moveDirection.y = 0.5 + (underwaterLevel - transform.position.y);	
			
			//if(transform.position.y > waterLevel && !grounded)
			//	transform.position.y = waterLevel;
			
			if(emiter)
				emiter.emit = !underWater;
				
		
			if (transform.position.y > underwaterLevel){
	
				if(underWaterTimer > 5.0){
					GetComponent(AudioSource).clip = inhale;
					GetComponent(AudioSource).Play();
				}
				underWater = false;
				underWaterTimer = 0.0;
				blur.enabled = false;			
				aSource.Stop();
			}
			
			if (transform.position.y > waterLevel && grounded) {			
				swimming = false;
				if(emiter){ 
					emiter.emit = false;
					emiter.transform.parent = null;
				}
				wm.ExitWater();
				state = 0;
			}	
		}
	}
	
	function FallCamera (d : Vector3, dw : Vector3, ta : float){
		var s : Quaternion = fallEffect.localRotation;
		var sw : Quaternion = fallEffectWep.localRotation;
		var e : Quaternion = fallEffect.localRotation * Quaternion.Euler(d);
		var ew : Quaternion = fallEffectWep.localRotation * Quaternion.Euler(dw);
		var r : float = 1.0/ta;
		var t : float = 0.0;
		while (t < 1.0) {
			t += Time.deltaTime * r;
			fallEffect.localRotation = Quaternion.Slerp(s, e, t);
			fallEffectWep.localRotation = Quaternion.Slerp(sw, e, t);
			yield;		
		}
	}
	
	
	function PlayerInWater (s : float){
		waterLevel = s + 0.9;
		underwaterLevel = s + 0.4;
		blur.enabled = true;
		
		if(GetComponent(AudioSource).isPlaying)
			GetComponent(AudioSource).Stop();
		
		if(!aSource.isPlaying)
			aSource.Play();
		
			
		if(!swimming){
			wm.EnterWater();
			
			if(grounded){
				Instantiate (waterSplash, transform.position + Vector3(0, -0.5, 0), transform.rotation);
				waterSource.PlayOneShot(enterPool, 1.0);
			}else{ 
				Instantiate (waterSplash, transform.position + Vector3(0, 0.5, 0.2), transform.rotation);
				Instantiate (waterSplash, transform.position, transform.rotation);
				Instantiate (waterSplash, transform.position + Vector3(0, -0.5, 0.5), transform.rotation);
				waterSource.PlayOneShot(enterPoolSplash, 1.0);
			}

			emiter = Instantiate (waterFoam, transform.position + Vector3(0, -0.7, 0), transform.rotation);
			emiter.transform.parent = this.transform;
		}
			
		underWater = true;
		swimming = true;	
	}

	function ApplyFallingDamage (fallDistance : float){	
		hs.PlayerFallDamage(fallDistance * fallDamageMultiplier);
		if(state < 2) footsteps.JumpLand();
		FallCamera(Vector3(12, Random.Range(-2.0, 2.0), 0), Vector3(4, Random.Range(-1.0, 1.0), 0), 0.1);
	}

	function OnLadder() {
		onLadder = true;
		moveDirection = Vector3.zero;
		grounded = false;	
	}	

	function OffLadder (ladderMovement) {
		onLadder = false;
		var dir : Vector3 = gameObject.transform.forward;
		if(Input.GetAxis("Vertical") > 0){
			moveDirection = dir.normalized * 5.0;
		}	
	}
