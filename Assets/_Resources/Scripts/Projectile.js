#pragma strict
// FPS KIT [www.armedunity.com]

class Projectile extends MonoBehaviour {

    private var projectileSpeed : float = 30;    
	private var projectileGravity : float = 0.0;
    private var destroyAfter : float = 5.0;  			

    private var newPos : Vector3 = Vector3.zero;   	
    private var oldPos : Vector3 = Vector3.zero;   	       	
    private var moveDir : Vector3 = Vector3.zero;               
	private var hit : RaycastHit;

	var layerMask : LayerMask;
	
	private var timer : float;
	private var myTransform : Transform;
	
	var smoke : GameObject;
	var explosion : GameObject;

    function SetUp(info : float[]) {
		myTransform = transform;
		timer = destroyAfter;

		projectileSpeed = info[0];  
		projectileGravity = info[1];
		moveDir = myTransform.TransformDirection(Vector3(0, 0, 1));
	
        newPos = myTransform.position;   
        oldPos = newPos; 
    }
 
    function Update () {

        newPos += moveDir * (Time.deltaTime * projectileSpeed);

        var dir : Vector3 = newPos - oldPos;
        var dist : float = dir.magnitude;
			dir /= dist;
		if (dist > 0){
			if(Physics.Raycast(oldPos, dir, hit, dist, layerMask)){
				if(explosion != null)
					Instantiate(explosion, transform.position, Quaternion.identity);
				
				DestroyProjectile();
			}
		}

		oldPos = myTransform.position;  
		myTransform.position = newPos;
		moveDir.y -= projectileGravity * Time.deltaTime;

		timer -= Time.deltaTime;
		if(timer <= 0.0) 
			DestroyProjectile();
    }

	function DestroyProjectile(){
		smoke.GetComponent(Destroyer).DestroyNow(); 
		smoke.transform.parent = null;

		Destroy(gameObject);
	}
}
