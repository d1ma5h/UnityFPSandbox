#pragma strict
// FPS KIT [www.armedunity.com]

var allTargets : Target[];
var hitpoints : float = 100;

private var timer : float = 0.0;
var duration : float = 30.0; 
private var trainingScore : int = 0;
private var kills : int = 0;
private var headshots : int = 0;
@HideInInspector
var state : int = 0;

var aSource : AudioSource;
var countdownSound : AudioClip;
var mySkin : GUISkin;

function Start () {
	state = 0;
	
	for (var i : int = 0; i < allTargets.length; i++){
		allTargets[i].baseHitPoints = hitpoints;
		allTargets[i].trainingMode = false;
		allTargets[i].TargetUp();
	}	
}

function NextTarget(){
	allTargets[Random.Range(0, allTargets.length)].TargetUp();
}

function StartTraining(){

	for (var i : int = 0; i < allTargets.length; i++){
		allTargets[i].baseHitPoints = hitpoints;
		allTargets[i].trainingMode = true;
		allTargets[i].TargetDown();
	}
	
	trainingScore = 0;
	headshots = 0;
	kills = 0;
	timer = duration;
	state = 1;
	Ready();
}

function Ready(){
	aSource.PlayOneShot(countdownSound, 0.5);
	yield WaitForSeconds(6.0);
	state = 2;
	NextTarget();
}

function Update(){
	if(state == 2){
		timer -= Time.deltaTime;
		
		if(timer <= 0.0){
			TrainingEnds();
		}
	}	
}

function SetScore(s : int, hs : boolean){
	trainingScore += s;
	kills ++;
	if(hs) headshots ++;
}

function TrainingEnds(){
	state = 3;
	yield WaitForSeconds(10.0);
	state = 0;
	for (var i : int = 0; i < allTargets.length; i++){
		allTargets[i].baseHitPoints = hitpoints;
		allTargets[i].trainingMode = false;
		allTargets[i].TargetUp();
	}
}

function OnGUI(){
	if(state == 1 || state == 2)
		GUI.Label (Rect(Screen.width/2 - 60, Screen.height - 50,100,60), "<color=#88FF6AFF>TIME LEFT  </color>" + FormatSeconds(timer), mySkin.customStyles[0]);
	if(state == 3){	
		GUI.Label (Rect(Screen.width/2 - 45, Screen.height/2 - 150,100,60), "<color=#88FF6AFF>SCORE :  </color>" + trainingScore, mySkin.customStyles[0]);
		GUI.Label (Rect(Screen.width/2 - 45, Screen.height/2 - 120,100,60), "<color=#88FF6AFF>KILLS :  </color>" + kills, mySkin.customStyles[0]);
		GUI.Label (Rect(Screen.width/2 - 45, Screen.height/2 - 90,100,60), "<color=#88FF6AFF>HEADSHOTS :  </color>" + headshots, mySkin.customStyles[0]);
	}	
}

function FormatSeconds(elapsed : float) : String {
	var d : int = (elapsed * 100.0);
	var minutes : int = d / (60 * 100);
	var seconds : int = (d % (60 * 100)) / 100;
	return String.Format("{0:00}:{1:00}", minutes, seconds);
}


function Action(){
	if(state == 0) StartTraining();
}
	

