#pragma strict
// FPS KIT [www.armedunity.com]

var hitPoints : float;
var maxHitPoints : int;
var regeneration : boolean = false;
var regenerationSpeed : float;
var aSource : AudioSource;
var painSound : AudioClip;
var fallDamageSound : AudioClip;
var deadReplacement : Transform;
var mySkin : GUISkin;
private var radar : GameObject;
var damageTexture : Texture;
private var t : float = 0.0;
private var alpha : float;
private var isDead : boolean = false;
private var scoreManager : ScoreManager;
var camShake : Transform;

function Start(){
	if(regeneration)
		 hitPoints = maxHitPoints;
	alpha = 0.0;
}

function Update(){
    if (t > 0.0){ 
		t -= Time.deltaTime;
		alpha = t;
	}
	
	if(regeneration){
		if( hitPoints < maxHitPoints)
			hitPoints += Time.deltaTime * regenerationSpeed;
	}		
}

function PlayerDamage (damage : int) {
	if (hitPoints < 0.0) return;
	
	hitPoints -= damage;
	aSource.PlayOneShot(painSound, 1.0);
	t = 2.0;		
	
	if (hitPoints <= 0.0) Die();
}

//Picking up MedicKit
function Medic (medic : int){
	
	hitPoints += medic;
	
	if( hitPoints > maxHitPoints){
		var convertToScore : float = hitPoints - maxHitPoints;
		scoreManager = gameObject.Find("ScoreManager").GetComponent(ScoreManager);
		scoreManager.addScore(convertToScore);
		hitPoints = maxHitPoints;
	}
}

function Die () {
	if(isDead) return;
	isDead = true;
	
	if(scoreManager == null)
		scoreManager = gameObject.Find("ScoreManager").GetComponent(ScoreManager);
	scoreManager.PlayerDead();
	
	Instantiate(deadReplacement, transform.position, transform.rotation);
	Destroy(gameObject);
}


function OnGUI () {
    GUI.skin = mySkin;

	GUI.Label (Rect(40, Screen.height - 50,60,60)," Health: ");
	GUI.Label (Rect(100, Screen.height - 50,60,60),"" +hitPoints.ToString("F0"), mySkin.customStyles[0]);
	
	
	GUI.color.a = alpha;
	GUI.DrawTexture(new Rect(0,0,Screen.width, Screen.height), damageTexture);
}


function PlayerFallDamage(dam : float){
	PlayerDamage(dam);
	if(fallDamageSound) aSource.PlayOneShot(fallDamageSound, 1.0);
}

function Shake(p : float) {
	var t : float = 1.0;
	var shakePower : float;
	while (t > 0.0) {
		t -= Time.deltaTime;
		shakePower = t/50;
		
		camShake.rotation.x += Random.Range(-shakePower, shakePower);
		camShake.rotation.y += Random.Range(-shakePower, shakePower);
		camShake.rotation.z += Random.Range(-shakePower, shakePower);
		
		yield;		
	}
}
