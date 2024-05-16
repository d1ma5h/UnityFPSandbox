#pragma strict
// FPS KIT [www.armedunity.com]

var weaponsInUse : GameObject[];				
var weaponsInGame : GameObject[];					
var worldModels : Rigidbody[]; 						

var hit : RaycastHit;
private var dis : float = 3.0;
var layerMaskWeapon : LayerMask;
var layerMaskAmmo : LayerMask;
	
var dropPosition : Transform;
	
private var switchWeaponTime : float = 0.25;
//@HideInInspector
var canSwitch : boolean = true;
@HideInInspector
var showWepGui : boolean = false;
@HideInInspector
var showAmmoGui : boolean = false;
private var equipped : boolean = false;
@HideInInspector
var weaponToSelect : int;
@HideInInspector
var setElement : int;
@HideInInspector
var weaponToDrop : int;

var mySkin : GUISkin;
var pickupSound : AudioClip;
var aSource : AudioSource;
var hs : HealthScript;
private var textFromPickupScript : String = "";
private var notes : String = "";
private var note : String = "Press key <color=#88FF6AFF> << E >> </color> to pick up Ammo";
private var wrongType : String = "Select appropriate weapon to pick up";


var selectWepSlot1 : int = 0;
var selectWepSlot2 : int = 0;


function Start (){
	for (var h : int = 0; h < worldModels.length; h++){
		weaponsInGame[h].SetActive(false);
	}	
	
	weaponsInUse[0] = weaponsInGame[selectWepSlot1];
	weaponsInUse[1] = weaponsInGame[selectWepSlot2]; 

	weaponToSelect = 0;
	DeselectWeapon();
}


function Update () {
	if(Cursor.lockState == CursorLockMode.None) return;
	
	if (Input.GetKeyDown("1") && weaponsInUse.length >= 1 && canSwitch && weaponToSelect != 0) {
        DeselectWeapon();
		weaponToSelect = 0;

	} else if (Input.GetKeyDown("2") && weaponsInUse.length >= 2 && canSwitch && weaponToSelect != 1) {
		DeselectWeapon();
		weaponToSelect = 1;

	}
	
	if (Input.GetAxis("Mouse ScrollWheel") > 0 && canSwitch){
		    weaponToSelect++;
		if (weaponToSelect > (weaponsInUse.length - 1)){
		    weaponToSelect = 0;
		}
		DeselectWeapon();
	}
	
	if (Input.GetAxis("Mouse ScrollWheel") < 0 && canSwitch){
		weaponToSelect--;
		if (weaponToSelect < 0){
			weaponToSelect = weaponsInUse.length - 1;
		}
		DeselectWeapon();
	}
	
	var pos : Vector3 = transform.parent.position;
	var dir : Vector3 = transform.TransformDirection (Vector3.forward);
	if (Physics.Raycast (pos, dir, hit, dis, layerMaskWeapon)){

		var pre : WeaponIndex = hit.transform.GetComponent(WeaponIndex);
		setElement = pre.setWeapon;
		showWepGui = true;
																											
		if(weaponsInUse[0] != weaponsInGame[setElement] && weaponsInUse[1] != weaponsInGame[setElement]){ 
			equipped = false;
		}else{
			equipped = true;
		}
		
		if(canSwitch && !equipped){
			if(Input.GetKeyDown ("e")){
				DropWeapon(weaponToDrop);
				DeselectWeapon();
				weaponsInUse[weaponToSelect] = weaponsInGame[setElement];	
				Destroy(hit.transform.gameObject);
			}			
		}
	
	} else {
		showWepGui = false;
	}
	
	if (Physics.Raycast (pos, dir, hit, dis, layerMaskAmmo)){
		showAmmoGui = true;
		if(hit.transform.CompareTag("Ammo")){
			var pickupGO : Pickup = hit.transform.GetComponent(Pickup);
			
			//bullets/magazines
			if(pickupGO.pickupType == PickupType.Magazines) {
				var mags : WeaponScriptNEW = weaponsInUse[weaponToSelect].transform.GetComponent(WeaponScriptNEW);
				if(mags == null){ 
					textFromPickupScript = "";
					return; 
				}				
				if(mags.firstMode != fireMode.launcher){
					notes = "";
					textFromPickupScript = note;
					if(Input.GetKeyDown ("e")){
						if(mags.ammoMode == Ammo.Magazines)
							mags.magazines += pickupGO.amount;
						else 
							mags.magazines += pickupGO.amount * mags.bulletsPerMag;
						
						aSource.PlayOneShot(pickupSound, 0.3);
						Destroy(hit.transform.gameObject);
					}	
				}else{
					textFromPickupScript = pickupGO.AmmoInfo;
					notes = wrongType;
				}
			}

			//projectiles/rockets
			if (pickupGO.pickupType == PickupType.Projectiles) {
				var projectile : WeaponScriptNEW = weaponsInUse[weaponToSelect].transform.GetComponent(WeaponScriptNEW);
				if(projectile == null){
					textFromPickupScript = "";
					return; 
				}
				if(projectile.secondMode == fireMode.launcher || projectile.firstMode == fireMode.launcher){
					notes = "";
					textFromPickupScript = note;
					if(Input.GetKeyDown ("e")){
						projectile.projectiles += pickupGO.amount;
						aSource.PlayOneShot(pickupSound, 0.3);
						Destroy(hit.transform.gameObject);
					}	
				}else{
					textFromPickupScript = pickupGO.AmmoInfo;
					notes = wrongType;
				}
			}

			//health
			if (pickupGO.pickupType == PickupType.Health) {
				textFromPickupScript = pickupGO.AmmoInfo;
				notes = "";
				if(Input.GetKeyDown ("e")){
					hs.Medic(pickupGO.amount);
					aSource.PlayOneShot(pickupSound, 0.3);
					Destroy(hit.transform.gameObject);
				}
			}
		}	
	
	}else{
		showAmmoGui = false;
	}	
}

function OnGUI(){
	GUI.skin = mySkin;
	
	if(showWepGui){
		if(!equipped)
			GUI.Label(Rect(Screen.width/2 - 400, Screen.height - (Screen.height/1.4),800,100),"Press key <color=#88FF6AFF> << E >> </color> to pickup weapon", mySkin.customStyles[1]);
		else
			GUI.Label(Rect(Screen.width/2 - 400, Screen.height - (Screen.height/1.4),800,100),"Weapon is already equipped", mySkin.customStyles[1]);
	}

	if(showAmmoGui)
		GUI.Label(Rect(Screen.width/2 - 400, Screen.height - (Screen.height/1.4),800,200), notes + "\n" + textFromPickupScript, mySkin.customStyles[1]);	
}

function DeselectWeapon(){
	canSwitch = false;
	
	for (var i : int = 0; i < weaponsInUse.length; i++){
		weaponsInUse[i].SendMessage("Deselect", SendMessageOptions.DontRequireReceiver);
		weaponsInUse[i].gameObject.SetActive(false);
	}
	
	yield WaitForSeconds(switchWeaponTime);
	SelectWeapon(weaponToSelect);
	yield WaitForSeconds(switchWeaponTime);
	canSwitch = true;
}


function SelectWeapon (i : int) {
	weaponsInUse[i].gameObject.SetActive(true);
	weaponsInUse[i].SendMessage("DrawWeapon", SendMessageOptions.DontRequireReceiver);
	var temp : WeaponIndex = weaponsInUse[i].transform.GetComponent(WeaponIndex);
	weaponToDrop = temp.setWeapon;
}

function DropWeapon(index : int){
	if(index == 0) return;
	
	for (var i : int = 0; i < worldModels.length; i++){
		if (i == index){
			var drop : Rigidbody = Instantiate(worldModels[i], dropPosition.transform.position, dropPosition.transform.rotation);
			drop.AddRelativeForce(0, 250, Random.Range(100, 200));
			drop.AddTorque(-transform.up * 40);
		}
	}	
}

function EnterWater(){
	canSwitch = false;
	for (var i : int = 0; i < weaponsInUse.length; i++){
		weaponsInUse[i].SendMessage("Deselect", SendMessageOptions.DontRequireReceiver);
		weaponsInUse[i].gameObject.SetActive(false);
	}
}

function ExitWater(){
	canSwitch = true;
	SelectWeapon(weaponToSelect);
}

	
