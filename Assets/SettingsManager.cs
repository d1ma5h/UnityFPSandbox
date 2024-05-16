using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.IO;
public class SettingsManager : MonoBehaviour {
    public Toggle fstoggle;
    public Dropdown qualitydd;
    public Dropdown resdd;
    public Slider musicVolumeSlider;
    public Button applyButton;

    public AudioSource musicSource;
    public Resolution[] resolutions;
    public GameSettings gameSettings;
    void OnEnable()
    {
        gameSettings = new GameSettings();

        fstoggle.onValueChanged.AddListener(delegate { OnFullscreenToggle(); });
        resdd.onValueChanged.AddListener(delegate { OnResolutionChange(); });
        qualitydd.onValueChanged.AddListener(delegate { OnQualityChange(); });
        musicVolumeSlider.onValueChanged.AddListener(delegate { OnVolumeChange(); });
        applyButton.onClick.AddListener(delegate { OnApplyButtonClick(); });

        resolutions = Screen.resolutions;
        foreach (Resolution resolution in resolutions)
        {
            resdd.options.Add(new Dropdown.OptionData(resolution.ToString()));
        }
        LoadSettings();


    }
    public void OnFullscreenToggle()
    {
        gameSettings.fullscreen = Screen.fullScreen = fstoggle.isOn;
    }
    public void OnResolutionChange()
    {
        Screen.SetResolution(resolutions[resdd.value].width, resolutions[resdd.value].height, Screen.fullScreen);
    }
    public void OnQualityChange()
    {
        QualitySettings.masterTextureLimit = gameSettings.quality = qualitydd.value;
    }
    public void OnVolumeChange()
    {
        musicSource.volume = gameSettings.musicVolume = musicVolumeSlider.value;
    }
    public void OnApplyButtonClick()
    {
        SaveSettings();
    }
    public void SaveSettings()
    {
        string dimaData = JsonUtility.ToJson(gameSettings,true);
        File.WriteAllText(Application.persistentDataPath+ "/gamesettings.json",dimaData);
    }
    public void LoadSettings()
    {
        gameSettings = JsonUtility.FromJson<GameSettings>(File.ReadAllText(Application.persistentDataPath + "/gamesettings.json"));

        musicVolumeSlider.value = gameSettings.musicVolume;
        qualitydd.value = gameSettings.quality;
        resdd.value = gameSettings.resindex;
        fstoggle.isOn = gameSettings.fullscreen;
    }

}
