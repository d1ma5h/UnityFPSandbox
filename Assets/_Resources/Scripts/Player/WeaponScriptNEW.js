#pragma strict
// FPS KIT [www.armedunity.com]

enum fireMode { none, semi, auto, burst, shotgun, launcher}
@HideInInspector
var currentMode = fireMode.semi;
var firstMode = fireMode.semi;
var secondMode = fireMode.launcher;

enum Ammo { Magazines, Bullets }
var ammoMode : Ammo = Ammo.Magazines;

enum Aim { Simple, Sniper }
var aimMode : Aim = Aim.Simple;

@Header ("Weapon configuration")
	var layerMask : LayerMask;
	var damage : int = 50;
	var bulletsPerMag : int = 50;
	var magazines : int = 5;
	private var fireRate : float = 0.1;
	var fireRateFirstMode : float = 0.1;
	var fireRateSecondMode : float = 0.1;
	var range : float = 250.0;
	var force : float = 200.0;
	
@Header ("Accuracy Settings")
	var baseInaccuracyAIM : float = 0.005;
	var baseInaccuracyHIP : float = 1.5;
	var inaccuracyIncreaseOverTime : float = 0.2;
	var inaccuracyDecreaseOverTime : float = 0.5;
	private var maximumInaccuracy : float;
	var maxInaccuracyHIP : float = 5.0;
	var maxInaccuracyAIM : float = 1.0;
	private var triggerTime : float = 0.05;
	private var baseInaccuracy : float;
	
@Header ("Aiming")	
	var aimPosition : Vector3;
	private var aiming : boolean;
	private var curVect : Vector3;
	private var hipPosition : Vector3 = Vector3.zero;
	var aimSpeed : float = 0.25;
	var zoomSpeed : float = 0.5;
	var FOV : int = 40;
	var weaponFOV : int = 45;
	
	private var scopeTime : float;
	private var inScope : boolean = false;
	var scopeTexture : Texture;
	
@Header ("Burst Settings")
	var shotsPerBurst : int = 3;
	var burstTime : float = 0.07;	

@Header ("Shotgun Settings")	
	var pelletsPerShot : int = 10;	
	
@Header ("Launcher")
	var projectilePrefab : GameObject;
	var projectileSpeed : float = 30.0;
	var projectileGravity : float = 0.0;
	var projectiles : int = 20;
	var launchPosition : Transform;
	var reloadProjectile : boolean = false; 
	var soundReloadLauncher : AudioClip;
	var rocket : Renderer = null;
	
@Header ("Kickback")
	var kickGO : Transform;
	var kickUp : float = 0.5;
	var kickSideways : float = 0.5;
	
@Header ("Crosshair")
	var crosshairFirstModeHorizontal : Texture2D;
	var crosshairFirstModeVertical : Texture2D;
	var crosshairSecondMode : Texture2D;
	private var adjustMaxCroshairSize : float = 6.0;
	
@Header ("Bulletmarks")
	var Concrete : GameObject;
	var Wood : GameObject;
	var Metal : GameObject;
	var Dirt : GameObject;
	var Blood : GameObject;
	var Water : GameObject;
	var Untagged : GameObject;
	
@Header ("Audio")
	var aSource : AudioSource;
	var soundDraw : AudioClip;
	var soundFire : AudioClip;
	var soundReload : AudioClip;
	var soundEmpty : AudioClip;
	var switchModeSound : AudioClip;
	
@Header ("Animation Settings")
	var weaponAnim : Animation;
	var fireAnim : String = "Fire";
	@Range(0.0, 5.0)
	var fireAnimSpeed : float = 1.0;
	var drawAnim : String = "Draw";
	@Range(0.0, 5.0)
	var drawAnimSpeed : float = 1.0;
	@Range(0.0, 5.0)
	var drawTime : float = 1.5;
	var reloadAnim : String = "Reload";
	@Range(0.0, 5.0)
	var reloadAnimSpeed : float = 1.0;
	@Range(0.0, 5.0)
	var reloadTime : float = 1.5;
	var fireEmptyAnim : String = "FireEmpty"; 
	@Range(0.0, 5.0)
	var fireEmptyAnimSpeed : float = 1.0;
	var switchAnim : String = "SwitchAnim";
	@Range(0.0, 5.0)
	var switchAnimSpeed : float = 1.0;
	var fireLauncherAnim : String = "FireLauncher";
	
@Header ("Other")
	var fpscontroller : FPSController;
	var wepManager : WeaponManager;
	var mySkin : GUISkin; 
	var muzzleFlash : Renderer;
	var muzzleLight : Light;
	var mainCamera : Camera;
	var wepCamera : Camera;
	var withSilencer : boolean = false;
	
	@HideInInspector
	var reloading : boolean = false;
	@HideInInspector
	var selected : boolean = false;
	private var canSwicthMode : boolean = true;
	private var draw : boolean;
	private var playing : boolean = false;
	private var isFiring : boolean = false;
	private var bursting : boolean = false;
	private var m_LastFrameShot : int = -10;
	private var nextFireTime : float = 0.0;
	private var bulletsLeft : int = 0;
	private var hit : RaycastHit;
	private var camFOV : float = 60.0;

function Start(){
	//camFOV = mainCamera.fieldOfView;
    muzzleFlash.enabled = false;
	muzzleLight.enabled = false;
	bulletsLeft = bulletsPerMag;
	currentMode = firstMode;
	fireRate = fireRateFirstMode;
	aiming = false;

	if(ammoMode == Ammo.Bullets){
	    magazines = magazines * bulletsPerMag;
	}
}	
	
function Update(){
	if(selected){
		if(Cursor.lockState == CursorLockMode.None) return;
		
		if (Input.GetButtonDown ("Fire")){
			if(currentMode == fireMode.semi){
				FireSemi();
			}else if(currentMode == fireMode.launcher){
				FireLauncher();
			}else if(currentMode == fireMode.burst){
				FireBurst();
			}else if(currentMode == fireMode.shotgun){
				FireShotgun();
			}
			
			if(bulletsLeft > 0)
				isFiring = true;	
		}
		
		if (Input.GetButton ("Fire")){
			if(currentMode == fireMode.auto){
				FireSemi();
				if(bulletsLeft > 0)
					isFiring = true;
			}	
		}
		
		if (Input.GetButtonDown ("Reload")){
			Reload();
		}
	}

	if (Input.GetButton("Fire2") && !reloading && selected){		
		if (!aiming){
			aiming = true;
			curVect = aimPosition - transform.localPosition;
			scopeTime = Time.time + aimSpeed;
		}
		if (transform.localPosition != aimPosition && aiming){
			if(Mathf.Abs(Vector3.Distance(transform.localPosition , aimPosition)) < curVect.magnitude/aimSpeed * Time.deltaTime){
				transform.localPosition = aimPosition;
			} else {
				transform.localPosition += curVect/aimSpeed * Time.deltaTime;					
			}
		}
		
		if(aimMode == aimMode.Sniper){
			if (Time.time >= scopeTime && !inScope){
				inScope = true;
				var gos : Component[] = GetComponentsInChildren(Renderer);
				for( var go in gos){
					var a : Renderer = go as Renderer;
					a.enabled = false;
				}
			}
		}
		
	} else {
		if (aiming){
			aiming = false;
			inScope = false;
			curVect = hipPosition - transform.localPosition;
			if(aimMode == aimMode.Sniper){
				var go : Component[] = GetComponentsInChildren(Renderer);
				for( var g in go){
					var b : Renderer = g as Renderer;
					if (b.name != "muzzle_flash")
						b.enabled = true;
				}
			}	
		}
		
		if(Mathf.Abs(Vector3.Distance(transform.localPosition , hipPosition)) < curVect.magnitude/aimSpeed * Time.deltaTime){
			transform.localPosition = hipPosition;
		}else{
			transform.localPosition += curVect/aimSpeed * Time.deltaTime;
		}
	}
		
	if(aiming){
		maximumInaccuracy = maxInaccuracyAIM;
		baseInaccuracy = baseInaccuracyAIM;
		mainCamera.fieldOfView -= FOV * Time.deltaTime/zoomSpeed;
		if(mainCamera.fieldOfView < FOV){
			mainCamera.fieldOfView = FOV;
		}

	}else{
		maximumInaccuracy = maxInaccuracyHIP;
		baseInaccuracy = baseInaccuracyHIP;
		mainCamera.fieldOfView += camFOV * Time.deltaTime * 3;
		if(mainCamera.fieldOfView > camFOV){
			mainCamera.fieldOfView = camFOV;
		}
	}
	
	if(fpscontroller.velMagnitude > 3.0){
		triggerTime += inaccuracyDecreaseOverTime;
	}

	if(isFiring){
		triggerTime += inaccuracyIncreaseOverTime;
	}else{
		if(fpscontroller.velMagnitude < 3.0)
		triggerTime -= inaccuracyDecreaseOverTime;
	}
	
	if (triggerTime >= maximumInaccuracy) {
		triggerTime = maximumInaccuracy;
	}
	
	if (triggerTime <= baseInaccuracy) {
		triggerTime = baseInaccuracy;
	}

	if(nextFireTime > Time.time){
		isFiring = false;
	}	
	
	if(Input.GetButtonDown("switchFireMode") && secondMode != fireMode.none && canSwicthMode){
		if(currentMode != firstMode){
			FirstFireMode();
		}else{
			SecondFireMode();
		}
	}			
}

function LateUpdate(){
	if(withSilencer || inScope) return;
	
	if (m_LastFrameShot == Time.frameCount){
		muzzleFlash.transform.localRotation = Quaternion.AngleAxis(Random.value * 360, Vector3.forward);
		muzzleFlash.enabled = true;
		muzzleLight.enabled = true;		
    }else{
		muzzleFlash.enabled = false;
		muzzleLight.enabled = false;
	}	
}

function OnGUI (){
	if(selected){
		GUI.skin = mySkin;
		var style1 = mySkin.customStyles[0];	
		
		if(scopeTexture != null && inScope){
			GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), scopeTexture, ScaleMode.StretchToFill);
			
		}else{	
		
			if(currentMode == fireMode.launcher){
				if(crosshairSecondMode == null) return;
				
				var wi : float = crosshairSecondMode.width/2;
				var he : float = crosshairSecondMode.height/2;
				var pos : Rect = Rect((Screen.width - wi)/2,(Screen.height - he )/2, wi, he);
				if (!aiming) { 
					GUI.DrawTexture(pos, crosshairSecondMode);
				}
			}else{
				var w : float = crosshairFirstModeHorizontal.width;
				var h : float  = crosshairFirstModeHorizontal.height;
				var position1 : Rect = Rect((Screen.width + w)/2 + (triggerTime * adjustMaxCroshairSize),(Screen.height - h)/2, w, h);
				var position2 : Rect = Rect((Screen.width - w)/2,(Screen.height + h)/2 + (triggerTime * adjustMaxCroshairSize), w, h);
				var position3 : Rect = Rect((Screen.width - w)/2 - (triggerTime * adjustMaxCroshairSize) - w,(Screen.height - h )/2, w, h);
				var position4 : Rect = Rect((Screen.width - w)/2,(Screen.height - h)/2 - (triggerTime * adjustMaxCroshairSize) - h, w, h);
				if (!aiming) { 
					GUI.DrawTexture(position1, crosshairFirstModeHorizontal); 	//Right
					GUI.DrawTexture(position2, crosshairFirstModeVertical); 	//Up
					GUI.DrawTexture(position3, crosshairFirstModeHorizontal); 	//Left
					GUI.DrawTexture(position4, crosshairFirstModeVertical);		//Down
				}
			}
		}

		if(firstMode != fireMode.none && firstMode != fireMode.launcher || secondMode != fireMode.none && secondMode != fireMode.launcher){
			GUI.Label (Rect(Screen.width - 200,Screen.height-35,200,80),"Bullets : ");
			GUI.Label (Rect(Screen.width - 110,Screen.height-35,200,80),"" + bulletsLeft, style1);
			GUI.Label (Rect(Screen.width - 80,Screen.height-35,200,80)," |  " + magazines);
		}	
		
		if(firstMode != fireMode.none || secondMode != fireMode.none){
			GUI.Label (Rect(Screen.width - 200,Screen.height-65,200,80),"Firing Mode :");
			GUI.Label (Rect(Screen.width - 110,Screen.height-65,200,80),"" + currentMode, style1);
		}
		
		if(firstMode == fireMode.launcher || secondMode == fireMode.launcher){
			GUI.Label (Rect(Screen.width - 200,Screen.height-95,200,80),"Projectiles : ");
			GUI.Label (Rect(Screen.width - 110,Screen.height-95,200,80),"" + projectiles, style1);
		}
	}	
}

function FirstFireMode(){
	
	canSwicthMode = false;
	selected = false;
	weaponAnim.Rewind(switchAnim);
	weaponAnim.Play(switchAnim);
	aSource.clip = switchModeSound;
	aSource.Play();
	yield WaitForSeconds(0.6);
	currentMode = firstMode;
	fireRate = fireRateFirstMode;
	selected = true;
	canSwicthMode = true;
}

function SecondFireMode(){
	
	canSwicthMode = false;
	selected = false;
	aSource.clip = switchModeSound;
	aSource.Play();
	weaponAnim.Play(switchAnim);
	yield WaitForSeconds(0.6);
	currentMode = secondMode;
	fireRate = fireRateSecondMode;
	selected = true;
	canSwicthMode = true;
}

function FireSemi (){
	if (reloading || bulletsLeft <= 0){
		if(bulletsLeft == 0){
			OutOfAmmo();
		}		
	    return;
	}
	
	if (Time.time - fireRate > nextFireTime)
		nextFireTime = Time.time - Time.deltaTime;

		while(nextFireTime < Time.time){
			FireOneBullet();
			nextFireTime = Time.time + fireRate;
    }
}

function FireLauncher (){
	if (reloading || projectiles <= 0){
		if(projectiles == 0){
			OutOfAmmo();
		}		
	    return;
	}
	
	if (Time.time - fireRate > nextFireTime)
		nextFireTime = Time.time - Time.deltaTime;

		while(nextFireTime < Time.time){
			FireProjectile();
			nextFireTime = Time.time + fireRate;
    }
}

function FireBurst (){
	var shotCounter : int = 0;
	
	if (reloading || bursting || bulletsLeft <= 0){
		if(bulletsLeft <= 0){
			OutOfAmmo();
		}		
	    return;
	}
	
	if (Time.time - fireRate > nextFireTime)
		nextFireTime = Time.time - Time.deltaTime;

	if(Time.time > nextFireTime){
		while (shotCounter < shotsPerBurst){
			bursting = true;
			shotCounter++;
			if (bulletsLeft > 0){
			    FireOneBullet();
            }			
			yield WaitForSeconds(burstTime); 
		}           
		nextFireTime = Time.time + fireRate;
    }
	bursting = false;
}

function FireShotgun (){
	if (reloading || bulletsLeft <= 0 || draw){
		if(bulletsLeft == 0){
			OutOfAmmo();
		}		
	    return;
	}
	
	var pellets : int = 0;
	
	if (Time.time - fireRate > nextFireTime)
		nextFireTime = Time.time - Time.deltaTime;
		
	if(Time.time > nextFireTime){
	    while (pellets < pelletsPerShot){
			FireOnePellet();
		    pellets++;  
		}
		bulletsLeft--;
		nextFireTime = Time.time + fireRate;
	}
	
	weaponAnim.Rewind(fireAnim);
	weaponAnim.Play(fireAnim);
	
	aSource.PlayOneShot(soundFire, 1.0);

	m_LastFrameShot = Time.frameCount;
	kickGO.localRotation = Quaternion.Euler(kickGO.localRotation.eulerAngles - Vector3(kickUp, Random.Range(-kickSideways, kickSideways), 0));
}


function FireOneBullet (){
    if (nextFireTime > Time.time || draw){
		if(bulletsLeft <= 0){
			OutOfAmmo();
		}	
		return; 
	}
	
    var dir : Vector3 = gameObject.transform.TransformDirection(Vector3(Random.Range(-0.01, 0.01) * triggerTime, Random.Range(-0.01, 0.01) * triggerTime,1));
	var pos : Vector3 = transform.parent.position;
		
	if (Physics.Raycast(pos, dir, hit, range, layerMask)) {
	
	    var contact : Vector3 = hit.point;
		var rot : Quaternion = Quaternion.FromToRotation(Vector3.up, hit.normal);
		var rScale : float = Random.Range(0.5, 1.0);
		
		if (hit.rigidbody)
			hit.rigidbody.AddForceAtPosition(force * dir, hit.point);
		
		if (hit.collider.tag == "Concrete") {
			var concMark : GameObject = Instantiate (Concrete, contact, rot);
			concMark.transform.localPosition += .02 * hit.normal;
			concMark.transform.localScale = Vector3(rScale, rScale, rScale);
			concMark.transform.parent = hit.transform;
	
		}else if (hit.collider.tag == "Enemy") {
			Instantiate (Blood, contact, rot);
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);	

		}else if (hit.collider.tag == "Damage") {
			Instantiate (Blood, contact, rot);
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);				
			
		}else if (hit.collider.tag == "Wood") {
            var woodMark : GameObject = Instantiate (Wood, contact, rot);
			woodMark.transform.localPosition += .02 * hit.normal;
			woodMark.transform.localScale = Vector3(rScale, rScale, rScale);
			woodMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Metal") {
            var metalMark : GameObject = Instantiate (Metal, contact, rot);
			metalMark.transform.localPosition += .02 * hit.normal;
			metalMark.transform.localScale = Vector3(rScale, rScale, rScale);
			metalMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Dirt" || hit.collider.tag == "Grass") {
            var dirtMark : GameObject = Instantiate (Dirt, contact, rot);
			dirtMark.transform.localPosition += .02 * hit.normal;
			dirtMark.transform.localScale = Vector3(rScale, rScale, rScale);
			dirtMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Water") {
           Instantiate (Water, contact, rot);

		}else if (hit.collider.tag == "Usable") {
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			
		}else{
			var def : GameObject = Instantiate (Untagged, contact, rot);
			def.transform.localPosition += .02 * hit.normal;
			def.transform.localScale = Vector3(rScale, rScale, rScale);
			def.transform.parent = hit.transform;
		}
	}
	
	aSource.PlayOneShot(soundFire);
	m_LastFrameShot = Time.frameCount;
	
	weaponAnim[fireAnim].speed = fireAnimSpeed;
	weaponAnim.Rewind(fireAnim);
	weaponAnim.Play(fireAnim);
	
	kickGO.localRotation = Quaternion.Euler(kickGO.localRotation.eulerAngles - Vector3(kickUp, Random.Range(-kickSideways, kickSideways), 0));
	
	bulletsLeft--;
}

function FireOnePellet(){

    var dir : Vector3 = gameObject.transform.TransformDirection(Vector3(Random.Range(-0.01, 0.01) * triggerTime, Random.Range(-0.01, 0.01) * triggerTime,1));
	var pos : Vector3 = transform.parent.position;

	if (Physics.Raycast(pos, dir, hit, range, layerMask)) {
	
	    var contact : Vector3 = hit.point;
		var rot : Quaternion = Quaternion.FromToRotation(Vector3.up, hit.normal);
		var rScale : float = Random.Range(0.5, 1.0);
		
		if (hit.rigidbody)
			hit.rigidbody.AddForceAtPosition(force * dir, hit.point);
		
		if (hit.collider.tag == "Concrete") {
			var concMark : GameObject = Instantiate (Concrete, contact, rot);
			concMark.transform.localPosition += .02 * hit.normal;
			concMark.transform.localScale = Vector3(rScale, rScale, rScale);
			concMark.transform.parent = hit.transform;
	
		}else if (hit.collider.tag == "Enemy") {
			Instantiate (Blood, contact, rot);
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);	

		}else if (hit.collider.tag == "Damage") {
			Instantiate (Blood, contact, rot);
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);				
			
		}else if (hit.collider.tag == "Wood") {
            var woodMark : GameObject = Instantiate (Wood, contact, rot);
			woodMark.transform.localPosition += .02 * hit.normal;
			woodMark.transform.localScale = Vector3(rScale, rScale, rScale);
			woodMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Metal") {
            var metalMark : GameObject = Instantiate (Metal, contact, rot);
			metalMark.transform.localPosition += .02 * hit.normal;
			metalMark.transform.localScale = Vector3(rScale, rScale, rScale);
			metalMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Dirt" || hit.collider.tag == "Grass") {
            var dirtMark : GameObject = Instantiate (Dirt, contact, rot);
			dirtMark.transform.localPosition += .02 * hit.normal;
			dirtMark.transform.localScale = Vector3(rScale, rScale, rScale);
			dirtMark.transform.parent = hit.transform;
			
		}else if (hit.collider.tag == "Water") {
           Instantiate (Water, contact, rot);

		}else if (hit.collider.tag == "Usable") {
			hit.collider.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			
		}else{
			var def : GameObject = Instantiate (Untagged, contact, rot);
			def.transform.localPosition += .02 * hit.normal;
			def.transform.localScale = Vector3(rScale, rScale, rScale);
			def.transform.parent = hit.transform;
		}
	}
}


function FireProjectile (){
	if (projectiles < 1 || draw){	
		return; 
	}
	
	var info : float[] = new float[2];
	info[0] = projectileSpeed;
	info[1] = projectileGravity;

	var projectile : GameObject = Instantiate (projectilePrefab, launchPosition.position, launchPosition.rotation);
	var g : Projectile = projectile.GetComponent(Projectile);
	g.SetUp(info);
	
	weaponAnim[fireAnim].speed = fireAnimSpeed;
	weaponAnim.Rewind(fireAnim);
	weaponAnim.Play(fireAnim);
		
	projectiles--;
	
	if(reloadProjectile)
		ReloadLauncher();
}

function OutOfAmmo(){
	if(reloading || playing) return;
	
	playing = true;
	aSource.PlayOneShot(soundEmpty, 0.3);
	if(fireEmptyAnim != ""){
		weaponAnim.Rewind(fireEmptyAnim);
		weaponAnim.Play(fireEmptyAnim);
	}	
	yield WaitForSeconds(0.2);
	playing = false;

}

//For RPG
function ReloadLauncher(){
	if(projectiles > 0){
		wepManager.canSwitch = false;
		reloading = true; 
		canSwicthMode = false;
		
		if(rocket != null)
			DisableProjectileRenderer();	
			
		yield WaitForSeconds(0.5);
		if(soundReloadLauncher)
			aSource.PlayOneShot(soundReloadLauncher);
			
		weaponAnim[reloadAnim].speed = reloadAnimSpeed;
		weaponAnim.Play(reloadAnim);
		
		yield WaitForSeconds(reloadTime);	
		canSwicthMode = true;
		reloading = false;
		wepManager.canSwitch = true;
	}else{
		if(rocket != null && projectiles == 0){
			rocket.enabled = false;
		}
	}	
}

function DisableProjectileRenderer(){
	rocket.enabled = false;
	yield WaitForSeconds(reloadTime/1.5);
	rocket.enabled = true;
}

function EnableProjectileRenderer(){
	if(rocket != null){
		rocket.enabled = true;
	}
}

function Reload (){
	if(reloading) return;
	
	if(ammoMode == Ammo.Magazines){
		reloading = true;
		canSwicthMode = false;
		if (magazines > 0 && bulletsLeft != bulletsPerMag) {
			weaponAnim[reloadAnim].speed = reloadAnimSpeed;
			weaponAnim.Play(reloadAnim, PlayMode.StopAll);
			//weaponAnim.CrossFade(reloadAnim);
			aSource.PlayOneShot(soundReload);
			yield WaitForSeconds(reloadTime);
			magazines --;
			bulletsLeft = bulletsPerMag;
		}
		reloading = false;
		canSwicthMode = true;
		isFiring = false;
	}	
	
	if(ammoMode == Ammo.Bullets){
	    if(magazines > 0 && bulletsLeft != bulletsPerMag){
		    if(magazines > bulletsPerMag){
				canSwicthMode = false;
				reloading = true;
				weaponAnim[reloadAnim].speed = reloadAnimSpeed;
				weaponAnim.Play(reloadAnim, PlayMode.StopAll);
				//weaponAnim.CrossFade(reloadAnim);
				aSource.PlayOneShot(soundReload, 0.7);
				yield WaitForSeconds(reloadTime);
				magazines -= bulletsPerMag - bulletsLeft;
				bulletsLeft = bulletsPerMag;
				canSwicthMode = true;
				reloading = false;
				return;
            }else{
				canSwicthMode = false;
				reloading = true;
				weaponAnim[reloadAnim].speed = reloadAnimSpeed;
				weaponAnim.Play(reloadAnim, PlayMode.StopAll);
				//weaponAnim.CrossFade(reloadAnim);
				aSource.PlayOneShot(soundReload);
				yield WaitForSeconds(reloadTime);
				var bullet = Mathf.Clamp(bulletsPerMag, magazines, bulletsLeft + magazines);
				magazines -= (bullet - bulletsLeft);
				bulletsLeft = bullet;
				canSwicthMode = true;
				reloading = false;
				return;
			}	
        }	
    }
}

function DrawWeapon(){
	draw = true;
	wepCamera.fieldOfView = weaponFOV;
	canSwicthMode = false;
	aSource.clip = soundDraw;
	aSource.Play();
	
	weaponAnim[drawAnim].speed = drawAnimSpeed;
	weaponAnim.Rewind(drawAnim);
	weaponAnim.Play(drawAnim, PlayMode.StopAll);
	yield WaitForSeconds(drawTime);
	
	draw = false;
	reloading = false;
	canSwicthMode = true;
	selected = true;
	
}

function Deselect(){
	selected = false;
	mainCamera.fieldOfView = camFOV;
	transform.localPosition = hipPosition;
}


	
	