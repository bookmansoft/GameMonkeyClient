/**
 *  正在挂机界面
 */
class HangUpingWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/revive/HangUpWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._stopBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStopClick, this);
		this._rightNowBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnRightNowClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.RegisterDataSourceFunction();
        FacadeApp.dispatchAction(CommandList.M_CMD_UiOpened_HangUp);
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面。mediator上的。偷懒了
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_CMD_UiOpened_HangUp,
        ]); 
    }

    /**
     * 刷新
     */
    public async Render(){
		this.dianAni();
        let _num = (FacadeApp.read(CommandList.Re_FightInfo).his - 10);

	    this._maxLevelLabel.text = _num.toString() ;         		// 最高可达关卡
        this._curLevelLabel.text = FacadeApp.read(CommandList.Re_FightInfo).LEVEL;         		// 当前关卡

        let interval = 1;
        let recy = 0;
        this.timeObj = new ChangeLabelValue(this, id => {
            this._timeLabel.text = this.timeObj.getValue(id);
            this._curLevelLabel.text = FacadeApp.read(CommandList.Re_FightInfo).LEVEL + (++recy / GameConfigOfRuntime.HangupInterval) ;         		// 当前关卡
        }, id => {
            if(this.continueAni){
                this._OnRightNowClick(null);
            }
        });
        this.timeObj.setValue('HangUpWindow_Time', (_num - FacadeApp.read(CommandList.Re_FightInfo).LEVEL) * GameConfigOfRuntime.HangupInterval);
    }

	/**
	 * 挂机点点点动画
	 */
	private dianAni(){
        this.continueAni = true;
		var timeFun=setTimeout(() => {
			this._diIma1.visible=true;this._diIma2.visible=false;this._diIma3.visible=false;
			timeFun=setTimeout(() => {
				this._diIma1.visible=true;this._diIma2.visible=true;this._diIma3.visible=false;
				timeFun=setTimeout(() => {
					this._diIma1.visible=true;this._diIma2.visible=true;this._diIma3.visible=true;

                    if(this.continueAni){
    					this.dianAni();
                    }
				},500);
			},500);
		},500);
	}

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        this.continueAni = false;
        this._OnStopClick(event);
    }

	/**
     * 停止挂机按钮响应
     */
    private _OnStopClick(event : egret.TouchEvent){
        this.continueAni = false;
        this.timeObj.destory();

        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=11"], [data=>{
            FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if (data["code"] == FacadeApp.SuccessCode){
                SoundManager.PlayCloseWinMusic();
                this.UnRegister();
                UIPage.inst(UIPage).ShowHangUpRewardsWindow();
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
    }
    
	/**
     * 立即完成按钮响应
     */
    private _OnRightNowClick(event : egret.TouchEvent){
        this.continueAni = false;
        this.timeObj.destory();

        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=10"], [data=>{
            FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if (data["code"] == FacadeApp.SuccessCode){
                SoundManager.PlayCloseWinMusic();
                this.UnRegister();
                UIPage.inst(UIPage).ShowHangUpRewardsWindow();
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
    }

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    private _curLevelLabel : eui.Label;         		// 当前关卡
	private _maxLevelLabel : eui.Label;         		// 最高可达关卡
    private _timeLabel : eui.Label;            			// 所需时间

	private _stopBtn : eui.Button;						// 停止挂机按钮
	private _rightNowBtn : eui.Button;					// 立即完成按钮

	private _diIma1 : eui.Image;						// 挂机点
	private _diIma2 : eui.Image;						// 挂机点
	private _diIma3 : eui.Image;						// 挂机点

    private continueAni = false;
    private timeObj: ChangeLabelValue = null;
}