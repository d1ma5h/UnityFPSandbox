#pragma strict
// FPS KIT [www.armedunity.com]

var mainDamageReceiver : Target;
var multiplier : float;
var head : boolean = false;

function ApplyDamage (hPoints : float ) {
	mainDamageReceiver.FinalDamage(hPoints * multiplier, head);
}