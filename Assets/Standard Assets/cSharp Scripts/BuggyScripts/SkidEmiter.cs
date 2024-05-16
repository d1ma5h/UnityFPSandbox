using UnityEngine;
using System.Collections;

public class SkidEmiter : MonoBehaviour {

	public ParticleEmitter[] allEmiters;

	public void Emiters (bool s) {
		for (int i = 0; i < allEmiters.Length; i++){
			allEmiters[i].emit = s;
		}
	}
}