/**
 *  挂机提示界面
 */
class HangUpTipWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/revive/HangUpTipWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartClick, this);
		this._waitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this.RegisterDataSourceFunction();
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.dispatchAction(CommandList.M_CMD_UiOpened_HangUpTip);
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面。mediator上的。偷懒了
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_AT_SyncCheckpoint,
            CommandList.M_CMD_UiOpened_HangUpTip,
        ]); 
    }

    /**
     * 刷新页面
     */
    public async Render(){
        let _num = (FacadeApp.read(CommandList.Re_FightInfo).his - 10);
        this._maxLevelLabel.text = _num.toString();
        this._timeLabel.text = TimeFormator.ToTimeFormat((_num - FacadeApp.read(CommandList.Re_FightInfo).LEVEL) * GameConfigOfRuntime.HangupInterval);
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

	/**
     * 开始挂机按钮响应
     */
    private _OnStartClick(event : egret.TouchEvent){
        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=9&gateNo&monsterNum"], [data=>{
            FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if (data["code"] == FacadeApp.SuccessCode){
                UIPage.inst(UIPage).ShowHangUpingWindow();
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);

        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    private _maxLevelLabel : eui.Label;         		// 最高可达关卡
    private _timeLabel : eui.Label;            			// 所需时间

	private _startBtn : eui.Button;						// 开始挂机按钮
	private _waitBtn : eui.Button;						// 再想想按钮
	
}