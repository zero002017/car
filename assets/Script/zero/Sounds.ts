import { GlobalStorage } from "./GlobalStorage";

export namespace Sounds {

	const clips: { [key: string]: cc.AudioClip } = {};

	let currMusicName: string;
	let muteMusicName: string;
	let pausedMusicName: string;

	export function init(_clips: Array<cc.AudioClip>): void {
		for (const clip of _clips) {
			clips[clip.name] = clip;
		}
		updateMusic();
	}

	export function stopMusic(): void {
		if (currMusicName) {
			currMusicName = null;
			//console.log("stopMusic");
			cc.audioEngine.stopMusic();
		}
	}

	export function playMusic(name: string): void {
		if (currMusicName == name) {
			return;
		}
		stopMusic();
		if (GlobalStorage.musicOn) {
			currMusicName = name;
			if (clips[name]) {
				//console.log("playMusic " + name);
				cc.audioEngine.playMusic(clips[name], true);
			} else {
				console.error("木有音乐：" + name);
			}
		} else {
			muteMusicName = name;
		}
	}

	export function pauseMusic(): void {
		if (currMusicName) {
			pausedMusicName = currMusicName;
			stopMusic();
		}
	}

	export function resumeMusic(): void {
		if (pausedMusicName) {
			playMusic(pausedMusicName);
			pausedMusicName = null;
		}
	}

	export function updateMusic(): void {
		if (GlobalStorage.musicOn) {
			playMusic(muteMusicName);
		} else {
			muteMusicName = currMusicName;
			stopMusic();
		}
	}

	export function playFX(name: string): void {
		if (GlobalStorage.soundOn) {
			switch (name) {
				case "-1":
				case "":
				case "0":
					break;
				default:
					if (clips[name]) {
						//console.log("playFX " + name);
						cc.audioEngine.playEffect(clips[name], false);
					} else {
						console.error("木有音效：" + name);
					}
					break;
			}
		}
	}

}