/**
 *  挂机收益界面
 */
class HangUpRewardsWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/revive/HangUpGetWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    private _levelLabel : eui.Label;         			// 经历关卡
    private _moneyLabel1 : eui.Label;            		// 获得金币
    private _neidangLabel : eui.Label;                  // 内丹
    private _petLabel : eui.Label;                      // 宠物碎片？
    private _ghostLabel : eui.Label;                    // 神魔碎片？
    private _moneyLabel2:  eui.Label;                   // 离线收益金币

	private _sureBtn : eui.Button;						// 确定按钮
}