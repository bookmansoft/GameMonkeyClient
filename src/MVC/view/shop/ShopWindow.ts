/**
 * 物品界面
 */
class ShopWindow extends APanelList<ShopGoodsLine>{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/shop/ShopWindowSkins.exml");

        //  动画面板需要设置的环境变量
        super.InitComponent(
            this._shopGroup,    // 设置列表容器
            this._shopList,     // 设置列表滚动控制器
            // 设置数据条目类工厂
            [
                function():ShopGoodsLine { return ShopWindow.genericsFactory(ShopGoodsLine); }
            ],
            // 获取需要列表显示的数据内容
            [function(){
                let goods = FacadeApp.read(CommandList.Re_ShopInfo).list;
                let indexList = Object.keys(goods).filter(id=>{
                    return true;
                });
                return [goods, indexList];
            }]
        );

        FacadeApp.inst.removeMediator(ViewerName.ShopWindowMediator); 
        FacadeApp.inst.registerMediator(new ShopWindowMediator(this)); 
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this.y = GameConfigOfRuntime.gameHeight;
        this._totalGJLabel.rotation = 8;
        this._shopList.height = 250;

		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._upOrDownButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpOrDownPanel, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Shop);
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
		this.CloseWindow();
    }

	/**
	 * 上或下面板
	 */
	private _UpOrDownPanel(): void {
        super._UpOrDown(this._upOrDownButton.selected, this._shopList);

        SoundManager.PlayButtonMusic();
	}

    /**
     * 刷新页面
     */
    public async Render(){
        super.Render();
    }


   

    // 变量
    public _closeButton : eui.Button;                   // 关闭按钮
    public _upOrDownButton : eui.ToggleButton;          // 上下按钮
    private _totalGJLabel : eui.BitmapLabel;            // 总攻击力
    public _shopList : eui.Scroller;                    // 物品列表
    public _shopGroup : eui.Group;                      // 滚动容器
}