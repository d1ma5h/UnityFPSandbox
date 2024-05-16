#pragma strict
// FPS KIT [www.armedunity.com]

private var hitPoints : float = 100;
@HideInInspector
var baseHitPoints : float = 100;
private var targetrotation : Quaternion;
private var targetAngle : float;
private var smooth : float = 10.0;
private var showTarget : boolean;
var pivot : Transform;
var scoreManager : ScoreManager;
var targetManager : TargetManager; 
var resetTime : float = 5.0;
@HideInInspector
var trainingMode : boolean;


function FinalDamage (damage : float, head : boolean) {
	if(hitPoints < 0.0) return;
	
	if(showTarget){
		var score : int = 100;
		
		if(damage >= hitPoints && head)
			score = 250;
	
		scoreManager.DrawCrosshair();
		hitPoints -= damage;
		
		if(hitPoints <= 0){
			TargetDown();
			scoreManager.addScore(score);
			if(targetManager.state == 2) 
				targetManager.SetScore(score, head);
		}
	}	
}

function TargetDown(){
	showTarget = false;	
			
	targetAngle = 0.0;
	targetrotation = Quaternion.Euler (0, targetAngle, 0);
	while(pivot.localRotation != targetrotation){
		pivot.localRotation = Quaternion.Slerp(pivot.localRotation, targetrotation, Time.deltaTime * smooth);
		yield;
	}	
		
	if(!trainingMode) 
		ResetTarget();
	else
		if(targetManager.state == 2)
			targetManager.NextTarget();
}

function TargetUp(){
	showTarget = true;
	targetAngle = -90.0;
	targetrotation = Quaternion.Euler (0, targetAngle, 0);
	
	while(pivot.localRotation != targetrotation){
		pivot.localRotation = Quaternion.Slerp(pivot.localRotation, targetrotation, Time.deltaTime * smooth);
		yield;
	}	
	
	hitPoints = baseHitPoints;
}

function ResetTarget(){
	yield WaitForSeconds(resetTime);
	if(!trainingMode) TargetUp();
}

