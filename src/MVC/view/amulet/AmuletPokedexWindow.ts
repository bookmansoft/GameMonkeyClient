/**
 * 符咒图鉴界面
 */
class AmuletPokedexWindow extends APanelList<AmuletLine>{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/amulet/AmuletPokedexWindowSkins.exml");

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
                return [amulet, indexList];
            }]
        );

        this.RegisterDataSourceFun();
    }

    /**
     * 订阅和数据仓库相关的事件，当数据更新时自动刷新界面
     */
    public RegisterDataSourceFun(){
        this.RegisterDataSource([
            CommandList.M_DAT_Amulet,
        ]);
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this.anchorOffsetX = 640 / 2;
		this.anchorOffsetY = 1136 / 2;
		this.x = 640 / 2;
		this.y = 1136 / 2;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        this._ShowMovie();

        // 没有media，先用符咒页面的消息
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Amulet);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
    }

	/**
	 * 显示动画
	 */
    private _ShowMovie(){
        this.scaleX = 0;
        this.scaleY = 0;
        var tw = egret.Tween.get(this);
        tw.to({scaleX:1,scaleY:1}, 200);
    }

    // 变量
    private _closeButton : eui.Button;                      // 关闭按钮
    
    private _amuletList : eui.Scroller;                     // 物品列表
    private _amuletGroup : eui.Group;                       // 滚动容器
    private _amuletLineSet : AmuletLine[];                  // 符咒行集合
}