/**
 * 符咒界面
 * 如何召唤符咒？首先要将和符咒相关的技能升级到相应等级，然后就可以召唤符咒了。这就要在列表中罗列全部符咒及其激活条件
 * 召唤符咒后，可以对其持续升级，直至达到最大等级上限，部分符咒无等级上限。
 */
class AmuletWindow extends APanelList<AmuletLine>{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/amulet/AmuletWindowSkins.exml");

        //  动画面板需要设置的环境变量
        super.InitComponent(
            this._amuletGroup,      // 设置列表容器
            this._amuletList,       // 设置列表滚动控制器
            // 设置数据条目类工厂
            [
                function():AmuletLine { return AmuletWindow.genericsFactory(AmuletLine); }
            ],
            // 获取需要列表显示的数据内容
            [function(){
                let amulet = FacadeApp.read(CommandList.Re_AmuletInfo).list;
                let indexList = Object.keys(amulet).filter(id=>{
                    return true;
                });
                this._listLength = indexList.length;
                return [amulet, indexList];
            }]
        );

        FacadeApp.inst.removeMediator(ViewerName.AmuletWindowMediator);
        FacadeApp.inst.registerMediator(new AmuletWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this.y = GameConfigOfRuntime.gameHeight;
        this._totalNDLabel.rotation = 4;
        this._totalXWLabel.rotation = 4;
        this._amuletList.height = 250;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._upOrDownButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpOrDownPanel, this);
        // this._pokedexButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._PokedexWindow, this);
    }

    /**
     *  被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Amulet);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();

        // 图鉴按钮位置
        // if(this._amuletList.viewport.contentHeight == 0 || this._amuletList.viewport.contentHeight == this._pokedexButton.height){
        //     this._pokedexButton.y = this._listLength * 125;
        // }else{
        //     this._pokedexButton.y = this._amuletList.viewport.contentHeight - this._pokedexButton.height;
        // }

        // 更新总内丹，总修为
        this._totalNDLabel.text = FacadeApp.read(CommandList.Re_AmuletInfo).stoneHero;
        this._totalXWLabel.text = FacadeApp.read(CommandList.Re_AmuletInfo).stone;
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
        SoundManager.PlayButtonMusic();
        super._UpOrDown(this._upOrDownButton.selected, this._amuletList);
	}

    /**
     * 滚动完成
     */
    private _Compelet(){
        if(this._amuletGroup.y < Math.min(this._amuletGroup.height - 820, 0)){
            this._amuletGroup.y = Math.min(this._amuletGroup.height - 820, 0);
        }        
    }

    /**
     * 打开图鉴页面
     */
    // private _PokedexWindow(event: egret.TouchEvent){
    //     SoundManager.PlayButtonMusic();
    //     FacadeApp.Notify(CommandList.M_CMD_ShowAmuletPokedex);
    // }

    // 变量
    private _closeButton : eui.Button;                      // 关闭按钮
    public _upOrDownButton : eui.ToggleButton;              // 上下按钮
    private _totalNDLabel : eui.BitmapLabel;                // 总内丹
    private _totalXWLabel : eui.BitmapLabel;                // 总修为
    private _amuletList : eui.Scroller;                     // 物品列表
    private _amuletGroup : eui.Group;                       // 滚动容器
    private _amuletLineSet : AmuletLine[];                  // 符咒行集合
    // private _pokedexButton:eui.Button;                      // 图鉴按钮
    private _listLength: number = AmuletManager.AmuletSet.length - 1;                        // 列表长度
}