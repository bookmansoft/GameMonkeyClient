/**
 *  选择普通或高级转生界面
 */
class SeniorReviveWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/revive/SeniorReviveWindowSkins.exml");
        this.RegisterDataSourceFunction(); //自动调用Render
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);   //关闭窗口
        this._normalBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnNormal, this);         //普通转生
        this._senoirBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnSenoir, this);         //高级转生
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.dispatchAction(CommandList.M_CMD_UiOpened_SeniorRevive);
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面。mediator上的。偷懒了
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_AT_SyncCheckpoint,
            CommandList.M_CMD_UiOpened_SeniorRevive,
        ]); 
    }

    /**
     * 刷新
     */
    public async Render(){
        this._curReviveNumLabel.text = (FacadeApp.read(CommandList.Re_FightInfo).rt + 1);
        this._content.text = `今天还可以转生 ${FacadeApp.read(CommandList.Re_FightInfo).rl} 次`;
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }


    /**
     * 普通转生
     */
    private _OnNormal(event: egret.TouchEvent){
        this.UnRegister();
        UIPage.inst(UIPage).ShowZSWindow();
    }
    /**
     * 高级转生
     */
    private _OnSenoir(event: egret.TouchEvent){
        UIPage.inst(UIPage).ShowConsumeTipWindow().ShowWindow('确认花费元宝进行高级转生吗?', this.StartSeniorZS.bind(this));
    }

    /**
     * 高级转生函数
     */
    public StartSeniorZS(){
        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=8&gateNo&monsterNum"], [data => {
            FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if(data["code"] == FacadeApp.SuccessCode){
                //显示转生结果界面
                SoldierManage.FightManager.GetInstance().readyZS();
				UIPage.inst(UIPage).ShowReviveTipsWindow();
                SeniorReviveWindow.inst(SeniorReviveWindow).UnRegister();
                FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{ //接收玩家初始化消息
                        FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                }]);
                UIPage.inst(UIPage).updateProperties();
                FacadeApp.fetchData([CommandList.M_NET_PetNum], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_DAT_PetList, data['data']);
                }]);
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
        }]);
    }


    // 变量
    private _curReviveNumLabel : eui.Label;         			// 第几次转生
    private _content: eui.Label;                                // 备注
	private _normalBtn : eui.Button;         					// 普通转生按钮
    private _senoirBtn : eui.Button;           					// 高级转生按钮
	private _closeButton : eui.Button;							// 关闭窗口按钮
}
