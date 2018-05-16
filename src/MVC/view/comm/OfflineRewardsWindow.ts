/**
 * 离线奖励页面
 */
class OfflineRewardsWindow extends APanel{
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/ui/OfflineRewardsWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSureClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.RegisterDataSourceFunction();
        FacadeApp.dispatchAction(CommandList.M_CMD_UiOpened_Online);
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面。mediator上的。偷懒了
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_CMD_UiOpened_Online,
        ]); 
    }

    /**
     * 刷新
     */
    public async Render(){
		this._moneyLabel.text = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).offline).ShowToString;
    }

	/**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        this.UnRegister();
    }

	/**
     * 确定点击响应
     */
    private _OnSureClick(event: egret.TouchEvent){
        //领取离线收益
        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=6", "&gateNo&monsterNum"], [data=>{
            //FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
			FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if (data["code"] == FacadeApp.SuccessCode){

            }else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
        this.UnRegister();
    }

	// 变量
    private _closeButton: eui.Button;                   // 关闭按钮
    private _moneyLabel: eui.Label;                     // 离线奖励金币
    private _sureBtn:eui.Button;                    	// 确定按钮
}
