/**
 * 普通转生界面
 */
class ZSWindow extends APanel {
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/revive/ZSWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._waitZSButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnWaitZSButtonClick, this);
        this._starZSButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStarZSButtonClick, this);
        this._lookButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnLookButtonClick, this);
         
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.RegisterDataSourceFunction();
        FacadeApp.dispatchAction(CommandList.M_CMD_UiOpened_ZS);
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面。mediator上的。偷懒了
     */
    public RegisterDataSourceFunction(){
        this.RegisterDataSource([
            CommandList.M_AT_SyncCheckpoint,
            CommandList.M_DAT_PetList,
            CommandList.M_CMD_UiOpened_ZS,
        ]); 
    }

    /**
	 * 显示物品
	 */
	public async Render(){
        let si = FacadeApp.read(CommandList.Re_Status);

        this._zsNumLabel.text = FacadeApp.read(CommandList.Re_FightInfo).rt + 1; // 当前转生次数
        this._curLevelLabel.text = FacadeApp.read(CommandList.Re_FightInfo).LEVEL;			    // 当前关卡等级
        this._curMoneyLabel.text = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).money).ShowToString;			    // 当前金币
        this._cueNDLabel.text = si.stoneHero;	    // 当前内丹 - 英魂
        this._curXWLabel.text = si.stone;		    // 当前修为 - 魂石

        this._laterLevelLabel.text = '1';			// 转生后关卡等级
        this._laterMoneyLabel.text = '100000';		// 转生后金币
        this._laterNDLabel.text = si.stoneHero + si.stone;			    // 转生后内丹
        this._laterXWLabel.text = '0';			    // 转生后修为

        this._curFBLevLabel.text = FacadeApp.read(CommandList.Re_PetInfo).PetLevel;			        // 当前法宝等级 - 应该是宠物等级
        this._curFBNumLabel.text = FacadeApp.read(CommandList.Re_TalismanInfo).talismansNumOfActive();	    // 当前法宝数量
        this._curFBAllLevLabel.text = FacadeApp.read(CommandList.Re_TalismanInfo).talismansTotalLevel();	// 当前法宝总等级
        this._laterFBLevLabel.text = '1';			// 转生后法宝等级 - 应该是宠物等级
        this._laterFBNumLabel.text = '0';			// 转生后法宝数量
        this._laterFBAllLevLabel.text = '0';		// 转生后法宝总等级

        this._canXWLabel.text = si.stone;			// 可增加的修为 - 应该是可获得的英魂
        //todo:需要带入正式的公式 - 英魂对攻击的加成作用
        let _rate = GameConfigOfRuntime.getStoneEffect();
        this._canPlayerGJLabel.text = `${_rate}%`;			// 可增加的人物攻击 - 新增英魂可提供的人物攻击
        this._canPetGJLabel.text = `${_rate}%`;			    // 可增加的宠物攻击 - 新增英魂可提供的宠物攻击
	}

    /**
     * 实例被访问时调用
     */
    public onAccess(){
        super.onAccess();

		this.anchorOffsetX = 640 / 2;
		this.anchorOffsetY = 1136 / 2;
		this.x = 640 / 2;
		this.y = 1136 / 2;
        this.scaleX = 0;
        this.scaleY = 0;
        egret.Tween.get(this).to({scaleX:1,scaleY:1}, 200);
    }

	/**
	 * 点击关闭按钮响应
	 */
	private _OnCloseClick(event: TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
	}

    /**
	 * 点击稍等再说按钮响应
	 */
	private _OnWaitZSButtonClick(event: TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
	}

    /**
	 * 点击开始转生按钮响应
	 */
	private _OnStarZSButtonClick(event: TouchEvent){
        UIPage.inst(UIPage).ShowConsumeTipWindow().ShowWindow('确认进行普通转生吗?', this.StartNormalZS.bind(this));
	}

    /**
	 * 点击查看按钮响应
	 */
	private _OnLookButtonClick(event: TouchEvent){
        // TODO 待定，目前无效果
        // SoundManager.PlayCloseWinMusic();
		// this.parent.removeChild(this);
	}

    /**
     * 普通转生函数
     */
    public StartNormalZS(){
        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=7&gateNo&monsterNum"], [data => {
            FacadeApp.dispatchAction(CommandList.M_AT_SyncCheckpoint, data['data']);
            FacadeApp.dispatchAction(CommandList.M_DAT_Change_Money, data['data']['money']);
            if(data["code"] == FacadeApp.SuccessCode){
                //显示转生结果界面
                SoldierManage.FightManager.GetInstance().readyZS();
				UIPage.inst(UIPage).ShowReviveTipsWindow();
                ZSWindow.inst(ZSWindow).UnRegister();
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
	private _closeButton: eui.Button;			            // 关闭按钮
    private _waitZSButton: eui.Button;			            // 稍等再说
    private _starZSButton: eui.Button;			            // 开始转生
    private _lookButton: eui.Button;			            // 查看

    private _zsNumLabel: eui.BitmapLabel;			        // 当前转生次数
    private _curFBLevLabel: eui.BitmapLabel;			    // 当前法宝等级
    private _curFBNumLabel: eui.BitmapLabel;			    // 当前法宝数量
    private _curFBAllLevLabel: eui.BitmapLabel;			    // 当前法宝总等级
    private _curLevelLabel: eui.BitmapLabel;			    // 当前等级
    private _curMoneyLabel: eui.BitmapLabel;			    // 当前金币
    private _cueNDLabel: eui.BitmapLabel;			        // 当前内丹
    private _curXWLabel: eui.BitmapLabel;			        // 当前修为

    private _laterFBLevLabel: eui.BitmapLabel;			    // 转生后法宝等级
    private _laterFBNumLabel: eui.BitmapLabel;			    // 转生后法宝数量
    private _laterFBAllLevLabel: eui.BitmapLabel;			// 转生后法宝总等级
    private _laterLevelLabel: eui.BitmapLabel;			    // 转生后等级
    private _laterMoneyLabel: eui.BitmapLabel;			    // 转生后金币
    private _laterNDLabel: eui.BitmapLabel;			        // 转生后内丹
    private _laterXWLabel: eui.BitmapLabel;			        // 转生后修为

    private _canXWLabel: eui.BitmapLabel;			        // 可增加的修为
    private _canPlayerGJLabel: eui.BitmapLabel;			    // 可增加的人物攻击
    private _canPetGJLabel: eui.BitmapLabel;			    // 可增加的宠物攻击
}