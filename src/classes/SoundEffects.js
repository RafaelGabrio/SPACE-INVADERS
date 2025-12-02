class SoundEffects {
    constructor() {
        this.shootSounds = [
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
        ];

        this.hitSounds = [
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
        ];

        this.explosionAudio = new Audio("src/assets/audios/explosion.mp3");
        this.nextLevelAudio = new Audio("src/assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    playShootSound() {
        this.shootSounds[this.currentShootSound].currentTime = 0;
        this.shootSounds[this.currentShootSound].play();
        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length;
    }

    playHitSound() {
        this.hitSounds[this.currentHitSound].currentTime = 0;
        this.hitSounds[this.currentHitSound].play();
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    playExplosionSound() {
        this.explosionAudio.play();
    }

    playNextLevelSound() {
        this.nextLevelAudio.play();
    }

    adjustVolumes() {
        this.shootSounds.forEach(sound => sound.volume = 0.5);
        this.hitSounds.forEach(sound => sound.volume = 0.2);
        this.explosionAudio.volume = 0.2;
        this.nextLevelAudio.volume = 0.4;
    }

}

export default SoundEffects;