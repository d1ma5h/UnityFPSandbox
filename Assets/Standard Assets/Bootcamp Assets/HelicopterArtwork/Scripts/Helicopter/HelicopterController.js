#pragma strict

var main_Rotor_GameObject : GameObject;				// gameObject to be animated
var	tail_Rotor_GameObject : GameObject;				// gameObject to be animated

var	max_Rotor_Force : float = 22241.1081;			// newtons
static var max_Rotor_Velocity : float = 7200;		// degrees per second
var rotor_Velocity : float = 0.0;					// value between 0 and 1
private var rotor_Rotation : float = 0.0; 			// degrees... used for animating rotors

var max_tail_Rotor_Force : float = 15000.0; 		// newtons
var max_Tail_Rotor_Velocity : float = 2200.0; 		// degrees per second
private var tail_Rotor_Velocity : float = 0.0; 		// value between 0 and 1
private var tail_Rotor_Rotation : float = 0.0; 		// degrees... used for animating rotors
	
var forward_Rotor_Torque_Multiplier : float = 0.5;	// multiplier for control input
var sideways_Rotor_Torque_Multiplier : float = 0.5;	// multiplier for control input

static var main_Rotor_Active : boolean = true;		// boolean for determining if a prop is active
static var tail_Rotor_Active : boolean = true;		// boolean for determining if a prop is active

var fuel : float = 100.0;
var noFuelSoundGO : GameObject;
var rotatorSound : AudioClip;
var rotatorTextureGO1 : Renderer;
var rotatorTextureGO2 : Renderer;
var bladesTextureGO : Renderer;
var alpha : float;
var mySkin : GUISkin;

var grounded : boolean;
@HideInInspector
var disabled : boolean = false;
@HideInInspector
var controlsEnabled : boolean = false;
var aSource : AudioSource;

var hit : RaycastHit;
var rayDistance : float = 3.0;
var PlayerInCar : GameObject;
	
var rb : Rigidbody;	

function Awake(){
	rotatorTextureGO1.enabled = false;
	rotatorTextureGO2.enabled = false;
}

function Start(){
	aSource.clip = rotatorSound;
	aSource.loop = true;
	aSource.Play();	
}

function FixedUpdate () {
	
	if(controlsEnabled){
		var torqueValue : Vector3;
		var controlTorque : Vector3 = Vector3( Input.GetAxis( "HeliVertical1" ) * forward_Rotor_Torque_Multiplier, 1.0, -Input.GetAxis( "HeliHorizontal2" ) * sideways_Rotor_Torque_Multiplier );
	}
	// Now check if the main rotor is active, if it is, then add it's torque to the "Torque Value", and apply the forces to the body of the 
	// helicopter.
	if ( main_Rotor_Active == true ) {
		torqueValue += (controlTorque * max_Rotor_Force * rotor_Velocity);
		
		// Now the force of the prop is applied. The main rotor applies a force direclty related to the maximum force of the prop and the 
		// prop velocity (a value from 0 to 1)
		rb.AddRelativeForce( Vector3.up * max_Rotor_Force * rotor_Velocity/3 );
		
		// This is simple code to help stabilize the helicopter. It essentially pulls the body back towards neutral when it is at an angle to
		// prevent it from tumbling in the air.
		if ( Vector3.Angle( Vector3.up, transform.up ) < 80 ) {
			transform.rotation = Quaternion.Slerp( transform.rotation, Quaternion.Euler( 0, transform.rotation.eulerAngles.y, 0 ), Time.deltaTime * rotor_Velocity * 2 );
		}
	}
	
	// Now we check to make sure the tail rotor is active, if it is, we add it's force to the "Torque Value"
	if ( tail_Rotor_Active == true ) {
		torqueValue -= (Vector3.up * max_tail_Rotor_Force * tail_Rotor_Velocity);
	}
	
	// And finally, apply the torques to the body of the helicopter.
	rb.AddRelativeTorque( torqueValue );
	grounded = false;
}

function OnCollisionStay (col : Collision){
	if (Physics.Raycast(transform.position, -Vector3.up, hit, rayDistance)) {
		grounded = true;
	}	
}

function Update () {
	// This line simply changes the pitch of the attached audio emitter to match the speed of the main rotor.
	aSource.pitch = rotor_Velocity;
	alpha = rotor_Velocity;
	bladesTextureGO.material.color = Color(1.0, 1.0, 1.0, 1.2 - alpha);
	if(fuel > 0 && rotor_Velocity > 0.2){
		fuel -= rotor_Velocity/3 * Time.deltaTime;
	}
	if(alpha > 0.2){
		rotatorTextureGO1.enabled = true;
		rotatorTextureGO2.enabled = true;
	}else{
		rotatorTextureGO1.enabled = false;
		rotatorTextureGO2.enabled = false;
	}	
	
	// Now we animate the rotors, simply by setting their rotation to an increasing value multiplied by the helicopter body's rotation.
	if ( main_Rotor_Active == true ) {
		main_Rotor_GameObject.transform.rotation = transform.rotation * Quaternion.Euler( 0, rotor_Rotation/2, 0 );
	}
	if ( tail_Rotor_Active == true ) {
		tail_Rotor_GameObject.transform.rotation = transform.rotation * Quaternion.Euler( tail_Rotor_Rotation, 0, 0 );
	}
		
	// this just increases the rotation value for the animation of the rotors.
	rotor_Rotation += max_Rotor_Velocity * rotor_Velocity * Time.deltaTime;
	tail_Rotor_Rotation += max_Tail_Rotor_Velocity * rotor_Velocity * Time.deltaTime;
	
	// here we find the velocity required to keep the helicopter level. With the rotors at this speed, all forces on the helicopter cancel 
	// each other out and it should hover as-is.
	var hover_Rotor_Velocity : float = (rb.mass * Mathf.Abs(( Physics.gravity.y ) / max_Rotor_Force));
	var hover_Tail_Rotor_Velocity : float = (max_Rotor_Force * rotor_Velocity) / max_tail_Rotor_Force;
	
	if(disabled){
		controlsEnabled = false;	
	}
	
	if(controlsEnabled){
		if ( Input.GetAxis( "HeliVertical2" ) > 0.2 && fuel > 0.3) {
			rotor_Velocity += Input.GetAxis( "HeliVertical2" ) * 0.001;
		}else if(Input.GetAxis( "HeliVertical2" ) == 0 && fuel > 0.3){
			rotor_Velocity = Mathf.Lerp( rotor_Velocity, Random.Range (0.796, 0.797), Time.deltaTime/6);
		}	
		if ( Input.GetAxis( "HeliVertical2" ) < -0.2 ) {
			rotor_Velocity = Mathf.Lerp( rotor_Velocity, hover_Rotor_Velocity, Time.deltaTime/3);
		}
		if(rotor_Velocity > 0.4){
			tail_Rotor_Velocity = hover_Tail_Rotor_Velocity - Input.GetAxis( "HeliHorizontal1" );
		}else{
			tail_Rotor_Velocity = hover_Tail_Rotor_Velocity;
		}
		
	}else{
		if(!disabled){
			rotor_Velocity = Mathf.Lerp( rotor_Velocity, 0, Time.deltaTime/20);
			tail_Rotor_Velocity = 0;
		}else{
			tail_Rotor_Velocity = hover_Tail_Rotor_Velocity - Input.GetAxis( "HeliHorizontal1" );
		}	 
	}
	
	if(fuel < 0.3){
		rotor_Velocity = Mathf.Lerp( rotor_Velocity, 0, Time.deltaTime/15);
		noFuelSoundGO.GetComponent(AudioSource).enabled = true;
	}
	if(grounded && rotor_Velocity < 0.1 && fuel <= 0.0){
		noFuelSoundGO.GetComponent(AudioSource).enabled = false;
	}


	// now we set velocity limits. The multiplier for rotor velocity is fixed to a range between 0 and 1. You can limit the tail rotor velocity 
	// too, but this makes it more difficult to balance the helicopter variables so that the helicopter will fly well.
	if ( rotor_Velocity > 1.0 ) {
		rotor_Velocity = 1.0;
	}else if ( rotor_Velocity < 0.0 ) {
		rotor_Velocity = 0.0;
	}
	
	if(fuel < 0.1){
		fuel = 0;
	}
}

function OnGUI(){
	GUI.skin = mySkin;
	var style1 = mySkin.customStyles[0];
	
	if(controlsEnabled){
		GUI.Label (Rect(40, 40, 150, 80)," Fuel: ");
		GUI.Label (Rect(90, 40, 150, 80), "" +fuel.ToString("f2"), style1);
	}
}

function Status(s : boolean){
	controlsEnabled = s;
	PlayerInCar.SetActive(s);
}