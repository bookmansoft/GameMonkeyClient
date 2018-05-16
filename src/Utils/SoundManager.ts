/**
 * 音频管理
 */
class SoundManager{
    /**
     * 背景音乐
     */
    public static get BG_Music(): string {return "bg_music_mp3";}
    /**
     * 攻击1音乐
     */
    public static get Attack1_Music(): string {return "attack1_music_mp3";}
    /**
     * 攻击2音乐
     */
    public static get Attack2_Music(): string {return "attack2_music_mp3";}
    /**
     * 攻击3音乐
     */
    public static get Attack3_Music(): string {return "attack3_music_mp3";}
    /**
     * 攻击4音乐
     */
    public static get Attack4_Music(): string {return "attack4_music_mp3";}
    /**
     * 攻击5音乐
     */
    public static get Attack5_Music(): string {return "attack5_music_mp3";}
    /**
     * 攻击6音乐
     */
    public static get Attack6_Music(): string {return "attack6_music_mp3";}
    /**
     * 攻击7音乐
     */
    public static get Attack7_Music(): string {return "attack7_music_mp3";}
    /**
     * 宠物攻击1音乐
     */
    public static get PetAttack1_Music(): string {return "petattack1_music_mp3";}
    /**
     * 宠物攻击2音乐
     */
    public static get PetAttack2_Music(): string {return "petattack2_music_mp3";}
    /**
     * 宠物攻击3音乐
     */
    public static get PetAttack3_Music(): string {return "petattack3_music_mp3";}
    /**
     * 打开界面音乐
     */
    public static get OpenWin_Music(): string {return "openwin_music_mp3";}
    /**
     * 关闭界面音乐
     */
    public static get CloseWin_Music(): string {return "closewin_music_mp3";}
    /**
     * 按钮音乐
     */
    public static get Button_Music(): string {return "button_music_mp3";}
    /**
     * 宝箱出现音乐
     */
    public static get BoxApp_Music(): string {return "boxapp_music_mp3";}
    /**
     * 奖励领取音乐
     */
    public static get Reward_Music(): string {return "reward_music_mp3";}
    /**
     * 金币掉落
     */
    public static get Gold_Music(): string {return "gold_music_mp3";}
    /**
     * 升级
     */
    public static get Lvup_Music(): string {return "lvup_music_mp3";}
    /**
     * 弹窗1
     */
    public static get Error1_Music(): string {return "error1_music_mp3";}

    /**
     * 弹窗2
     */
    public static get Error2_Music(): string {return "error2_music_mp3";}

     /**
     * 点击主动技能
     */
    public static get Skill_Music(): string {return "skill_music_mp3";}

    /**
     * 播放音乐
     * @param name          音乐名字
     * @param count         播放次数（0为循环播放）
     * @return              返回egret.Sound
     */
    public static async PlayMusic(name: string, count: number) {
        // 如果是调试模式则不播放音乐（测试使用）
        // if(GameConfigOfRuntime.IsDebug) {
        //     return;
        // }
        // 判断音效是否不播放
        if (name != SoundManager.BG_Music && !SoundManager._isPlayYinxiao) return;
        // 确保只有一个背景音乐
        if (name == SoundManager.BG_Music && SoundManager._bgSound != null) return;

        var sound: egret.Sound = <egret.Sound> await MovieManage.PromisifyGetRes(name, this);
        if (sound == null){
            console.log(name);
            return null;
        }
        // 不是背景音乐的时候直接播放
        if (name != SoundManager.BG_Music){
            this._channel = sound.play(0, count);
        }
        else {
            this._bgSound = sound.play(0,count);
        }
    }

    /**
     * 播放背景音乐
     */
    public static PlayBackgroundMusic(){
        SoundManager.PlayMusic(SoundManager.BG_Music, 0);
    }

    /**
     * 关闭音乐
     */
    public static StopBackgroundMusic(){
        if(this._bgSound.volume != 0)this._bgSound.volume = 0;
        else this._bgSound.volume = 1;
    }
    /**
     * 关闭音效
     */
    public static StopEffectsMusic(){
        if(this._channel.volume != 0)this._channel.volume = 0;
        else this._channel.volume = 1;
    }
    /**
     * 播放按钮声音
     */
    public static PlayButtonMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Button_Music, 1);
    }

    /**
     * 打开界面声音
     */
    public static PlayOpenWinMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.OpenWin_Music, 1);
    }

    /**
     * 关闭界面声音
     */
    public static PlayCloseWinMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.CloseWin_Music, 1);
    }

    /**
     * 关闭界面声音
     */
    public static set YinYue(isPlay: boolean){
        if (SoundManager._isPlayYinyue == isPlay) return;
        SoundManager._isPlayYinyue = isPlay;
        if (SoundManager._bgSound != null){
            if (isPlay){
                SoundManager._bgSound.volume = 1;
            }
            else{
                SoundManager._bgSound.volume = 0;
            }
            // console.log(SoundManager._bgSound.volume);
        }
    }


    /**
     * 关闭界面音效
     */
    public static set YinXiao(isPlay: boolean){
        if (SoundManager._isPlayYinxiao == isPlay) return;
        SoundManager._isPlayYinxiao = isPlay;
    }

    public static PlayGoldMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Gold_Music, 1);
    }
    public static PlayLvupMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Lvup_Music, 1);
    }
    public static PlayError1Music(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Error1_Music, 1);
    }
    public static PlayError2Music(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Error2_Music, 1);
    }
    public static PlaySkillMusic(){
        if (!SoundManager._isPlayYinxiao) return;
        SoundManager.PlayMusic(SoundManager.Skill_Music, 1);
    }
    // 变量
    private static _bgSound: egret.SoundChannel;                       // 背景音乐
    private static _isPlayYinyue: boolean = true;               // 是否播放音乐
    private static _isPlayYinxiao: boolean = true;              // 是否播放音效
    private static _channel: egret.SoundChannel;
}