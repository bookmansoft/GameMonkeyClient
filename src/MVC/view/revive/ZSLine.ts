/**
 * 转生行
 */
class ZSLine extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/revive/ZSListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._zsButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnZSClick, this);
        FacadeApp.AddListener(CommandList.M_AT_SyncCheckpoint, ()=>{
            this.Render();
        });
        this.Render();
    }

    private Render(){
        this._csLabel.text = FacadeApp.read(CommandList.Re_FightInfo).rl;
        this._zsButton.enabled = FacadeApp.read(CommandList.Re_FightInfo).rl > 0;
    }

    /**
     * 点击转生响应
     */
    private _OnZSClick(event : TouchEvent){
        SoundManager.PlayButtonMusic();
        UIPage.inst(UIPage).ShowSeniorReviveWindow();
    }

    //  变量
    private _petImage: eui.Image;               // 头像
    private _csLabel: eui.Label;                // 次数文本
    private _zsButton: eui.Button;              // 转生按钮
}