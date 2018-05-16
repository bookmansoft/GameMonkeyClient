/**
 * 卡牌界面(战宠)
 * 战宠的激活、升级、出战
 * 选取战宠后，战宠将出现在战场的后排，这样就形成了天上的宠物、前排的英雄、后排的战宠三个战斗单元组成的战斗阵型，该阵型在PVE、PVP中通用。
 *  宠物作为牧和控，也提供基本的攻击，可用点击加速攻击
 *  战宠作为DPS，可使用点击加速攻击
 *  英雄作为T，不可点击加速
 */
class CardWindow extends APanelList<CardLine>{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/card/CardWindowSkins.exml");

        //  动画面板需要设置的环境变量
        super.InitComponent(
            this._cardGroup,    // 设置列表容器
            this._cardList,     // 设置列表滚动控制器
            // 设置数据条目类工厂
            [
                function():CardLine { return CardWindow.genericsFactory(CardLine); }
            ],
            // 获取需要列表显示的数据内容
            [function(){
                let card = FacadeApp.read(CommandList.Re_CardtInfo).list;
                let indexList = Object.keys(card).filter(id=>{
                    // if(id == "1"){
                    //     return false;
                    // }
                    return true;
                });
                return [card, indexList];
            }]
        );

        FacadeApp.inst.removeMediator(ViewerName.CardWindowMediator);
        FacadeApp.inst.registerMediator(new CardWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this.y = GameConfigOfRuntime.gameHeight;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		// this._tgtzButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnTGTZClick, this);
		this._tzzrButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnTZZRClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Card);
    }

    /**
	 * 弹出面板，重载了父类的同名函数
	 */
	public BouncedPanel(isSelected:boolean) {
		egret.Tween.removeTweens(this);
		egret.Tween.get(this)
        .to({y: 0 - 26}, 208)
        .to({y: 0}, 250)
        .to({y: 0 + 6}, 83)
        .to({y: 0}, 83);
        
        return this;
	}

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();

        //更新总攻击力
        // this._totalGJLabel.text = FacadeApp.read(CommandList.Re_CardtInfo).CardTotalGJ().ShowToString;
        //更新总战力
        // this._totalZLLabel.text = FacadeApp.read(CommandList.Re_CardtInfo).CardTotalGJ().ShowToString;
        //更新等级
        // this._levelLabel.text = FacadeApp.read(CommandList.Re_CardtInfo).CardTotalGJ().ShowToString;
    }

	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
		this.CloseWindow();
    }

	/**
     * 天宫挑战响应
     */
    // private _OnTGTZClick(event : egret.TouchEvent){
	// 	SoundManager.PlayCloseWinMusic();

    //     FacadeApp.fetchData([CommandList.M_NET_Card,"&oper=6&id=" + 5 + "&gid=" + MarshallingWindow.GetMarshallingID],[data=>{
    //         if(data["code"] != FacadeApp.SuccessCode){
    //             UIPage.inst(UIPage).ShowPrompt().ShowWindow("失败！，错误代码" + data["code"]);
    //         }else{
    //             PVPManager.PVPFightManager.GetInstance()._PVPFightControlSet = data["data"]["operation"];
    //             this.CloseWindow();
	// 	        FacadeApp.Notify(CommandList.M_CMD_ShowPVPFightWindow);
    //         }
    //     }]);
    // }

	/**
     * 调整阵容响应
     */
    private _OnTZZRClick(event : egret.TouchEvent){
		// this.CloseWindow();
        FacadeApp.Notify(CommandList.M_CMD_ShowPVPMarshalling,null);
    }

	// 变量
    private _closeButton : eui.Button;                  // 关闭按钮
	private _progressLabel : eui.BitmapLabel;           // 当前经验
	private _progressIma : eui.Image;					// 经验进度条
    private _totalGJLabel : eui.BitmapLabel;            // 总攻击力
	private _totalZLLabel : eui.BitmapLabel;            // 总战力
	private _levelLabel : eui.BitmapLabel;            	// 等级
    private _cardList : eui.Scroller;                  // 物品列表
    private _cardGroup : eui.Group;                    // 滚动容器
	private _tzzrButton : eui.Button;					// 调整整容按钮
	private _tgtzButton : eui.Button;					// 天宫挑战按钮
}