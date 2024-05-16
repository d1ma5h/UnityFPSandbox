#pragma strict

var target : Transform;
private var myTransform : Transform;

var targetHeight : float = 2.0;
var targetRight : float = 0.0;
private var dis : float = 10.0;

var prevButtonRight : boolean = false;

var maxDis : float = 20;
var minDis : float = 5;

var xSpeed : float = 250.0;
var ySpeed : float = 120.0;

var yMinLimit : float = -20;
var yMaxLimit : float = 80;

var zoomRate : float = 1;
var rotationDampening : float = 3.0;

private var x : float = 0.0;
private var y : float = 0.0;
private var distmod : float = 0.0;

function Start () {
	myTransform = transform;
    var angles : Vector3 = myTransform.eulerAngles;
    x = angles.y;
    y = angles.x;
}

function LateUpdate () {
   if(!target) return;
      
   if (Input.GetMouseButtonUp(0)) prevButtonRight = false;
   if (Input.GetMouseButtonUp(1)) prevButtonRight = true;
   

   if (Input.GetMouseButton(0) || Input.GetMouseButton(1)){
		x += Input.GetAxis("Mouse X") * xSpeed * 0.02;
		y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
	
   } else if(prevButtonRight) {
		var targetRotationAngle = target.eulerAngles.y;
		var currentRotationAngle = myTransform.eulerAngles.y;
		x = Mathf.LerpAngle(currentRotationAngle, targetRotationAngle, rotationDampening * Time.deltaTime);
   }
   
   dis -= Input.GetAxis("Mouse ScrollWheel") * zoomRate * Mathf.Abs(dis);
   dis = Mathf.Clamp(dis, minDis, maxDis);
   
   y = ClampAngle(y, yMinLimit, yMaxLimit);
   
   var rotation : Quaternion = Quaternion.Euler(y, x, 0);
   var targetMod : Vector3 = Vector3(0,-targetHeight,0) - (rotation * Vector3.right * targetRight);
   var layerMask = 1<<8;
   layerMask = ~layerMask;
   var pos : Vector3 = target.position - (rotation * Vector3.forward * (dis- distmod) + targetMod);
   
   myTransform.rotation = rotation;
   myTransform.position = pos;
}

function ClampAngle (angle : float, min : float, max : float) {
   if (angle < -360)
      angle += 360;
   if (angle > 360)
      angle -= 360;
   return Mathf.Clamp (angle, min, max);
}
