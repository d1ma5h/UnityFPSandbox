#pragma strict

var climbSpeed : float = 6.0;
private var climbDownThreshold : float = -0.4;
private var climbDirection : Vector3 = Vector3.zero;
private var lateralMove : Vector3 = Vector3.zero;
private var forwardMove : Vector3 = Vector3.zero;
private var ladderMovement : Vector3 = Vector3.zero;
@HideInInspector
var currentLadder : Ladder = null;
var mainCamera : GameObject;
var controller : CharacterController;
var fpscontroller : FPSController;

function OnTriggerEnter(other : Collider){
	if (other.CompareTag("Ladder")){			
		LatchLadder(other.gameObject);
    }
}

function OnTriggerExit (other : Collider) {	
	if (other.CompareTag("Ladder")) {
		UnlatchLadder();
	}
}

function LatchLadder (latchedLadder : GameObject) {
	currentLadder = latchedLadder.GetComponent(Ladder);
	climbDirection = currentLadder.ClimbDirection();
	fpscontroller.OnLadder();
}

function UnlatchLadder () {
	currentLadder = null;
	fpscontroller.OffLadder(ladderMovement);
}

function LadderUpdate () {
	var verticalMove : Vector3;
	verticalMove = climbDirection.normalized;
	verticalMove *= Input.GetAxis("Vertical");
	verticalMove *= (mainCamera.transform.forward.y > climbDownThreshold) ? 1 : -1;
	lateralMove = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
	lateralMove = transform.TransformDirection(lateralMove);
	ladderMovement = verticalMove + lateralMove;
	controller.Move(ladderMovement * climbSpeed * Time.deltaTime);
}



