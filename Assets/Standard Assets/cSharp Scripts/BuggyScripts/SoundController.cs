using UnityEngine;
using System.Collections;

// Simple class to controll sounds of the car, based on engine throttle and RPM, and skid velocity.
[RequireComponent (typeof (Drivetrain))]
[RequireComponent (typeof (CarController))]
public class SoundController : MonoBehaviour {

	public AudioClip engine;
	public AudioClip skid;
	public bool playerIn = false;
	public GameObject go;
	public bool emit;

	AudioSource engineSource;
	AudioSource skidSource;
	
	CarController car;
	Drivetrain drivetrain;
	
	public ParticleEmitter emiterFL;
	public ParticleEmitter emiterFR;
	public ParticleEmitter emiterRL;
	public ParticleEmitter emiterRR;
	
	/*
	public AudioSource engineSource;
	public AudioSource skidSource;
	*/
	
	AudioSource CreateAudioSource (AudioClip clip) {
		GameObject go = new GameObject("audio");
		go.transform.parent = transform;
		go.transform.localPosition = Vector3.zero;
		go.transform.localRotation = Quaternion.identity;
		go.AddComponent(typeof(AudioSource));
		go.GetComponent<AudioSource>().clip = clip;
		go.GetComponent<AudioSource>().spatialBlend = 1.0f;
		go.GetComponent<AudioSource>().loop = true;
		go.GetComponent<AudioSource>().volume = 0;
		go.GetComponent<AudioSource>().Play();
		return go.GetComponent<AudioSource>();
	}
	
	void Start () {
		engineSource = CreateAudioSource(engine);
		skidSource = CreateAudioSource(skid);
		car = GetComponent (typeof (CarController)) as CarController;
		drivetrain = GetComponent (typeof (Drivetrain)) as Drivetrain;
	}
	
	void Update () {
		if(playerIn){
			engineSource.pitch = 0.5f + 1.3f * drivetrain.rpm / drivetrain.maxRPM;
			engineSource.volume = 0.4f + 0.6f * drivetrain.throttle;
			skidSource.volume = Mathf.Clamp01( Mathf.Abs(car.slipVelo) * 0.2f - 0.5f );
		} else {
			engineSource.pitch = 0.0f;
			engineSource.volume = 0.0f;
			skidSource.volume = Mathf.Clamp01( Mathf.Abs(car.slipVelo) * 0.2f - 0.5f );	
		}
		
		if(skidSource.volume > 0.1f){
			emiterFL.emit = true;
			emiterFR.emit = true;
			emiterRL.emit = true;
			emiterRR.emit = true;
		}else{
			emiterFL.emit = false;
			emiterFR.emit = false;
			emiterRL.emit = false;
			emiterRR.emit = false;
		}
	}	
}
