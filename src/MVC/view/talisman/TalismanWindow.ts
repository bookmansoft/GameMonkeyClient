/**
 *  法宝界面
 */
class TalismanWindow extends APanelList<TalismanLine> /* 动画面板需要指定的条目类型 */{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/talisman/TalismanWindowSkins.exml");

        //  动画面板需要设置的环境变量
        super.InitComponent(
            this._talismanGroup,    // 设置列表容器
            this._talismanList,     // 设置列表滚动控制器
            // 设置数据条目类工厂
            [
                function():TalismanLine { return TalismanWindow.genericsFactory(TalismanLine); }
            ],
            // 获取需要列表显示的数据内容
            [function(){
                let talismans = FacadeApp.read(CommandList.Re_TalismanInfo).list;
                let _firstUnActive = true; // 列表中，只保留第一个未激活的法宝
                let indexList = Object.keys(talismans).filter(id=>{
                    // 过滤掉未解锁的法宝，只保留第一个未激活的法宝
                    if(talismans[id].l <= 0){
                        if(_firstUnActive){
                            _firstUnActive = false;
                            return true;
                        }
                        return false;
                    }
                    return true;
                });
                return [talismans, indexList];
            }]
        );

        FacadeApp.inst.removeMediator(ViewerName.TalismanWindowMediator); 
        FacadeApp.inst.registerMediator(new TalismanWindowMediator(this)); 
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this.y = GameConfigOfRuntime.gameHeight;
        this._totalGJLabel.rotation = 4;
        this._talismanList.height = 250;
        this._upLevelLabel.touchEnabled = false;
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._upOrDownButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpOrDownPanel, this);
        this._upLevelButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._UpLevelClick, this);

    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Talisman);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();
        //更新总攻击力
        this._totalGJLabel.text = Digit.fromObject(FacadeApp.read(CommandList.Re_Status).powerClick).ShowToString;
        
    }

    /**
     * 升几级按钮响应
     */
    private _UpLevelClick(event : egret.TouchEvent){
        this._curUpLevelNum +=1;
        if(this._curUpLevelNum == 1){
            this._upLevelLabel.text = "X1";
            TalismanWindow.curUpLevel = 1;
        }
        else if(this._curUpLevelNum == 2){
            this._upLevelLabel.text = "X25";
            TalismanWindow.curUpLevel = 25;
        }
        else if(this._curUpLevelNum == 3){
            this._upLevelLabel.text = "X100";
            TalismanWindow.curUpLevel = 100;
        }
        else if(this._curUpLevelNum == 4){
            this._upLevelLabel.text = "X1000";
            TalismanWindow.curUpLevel = 1000;
        }
        else if(this._curUpLevelNum == 5){
            this._curUpLevelNum = 1;
            this._upLevelLabel.text = "X1";
            TalismanWindow.curUpLevel = 1;
        }

        this.Render();
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.CloseWindow();
    }

	/**
	 * 上或下面板
	 */
	private _UpOrDownPanel(): void {
        SoundManager.PlayButtonMusic();
        super._UpOrDown(this._upOrDownButton.selected, this._talismanList, this._talismanGroup);
	}

    // 变量
    private _talismanList : eui.Scroller;                   // 物品列表
    private _talismanGroup : eui.Group;                     // 滚动容器

    private _closeButton : eui.Button;                  // 关闭按钮
    public _upOrDownButton : eui.ToggleButton;         // 上下按钮
    private _totalGJLabel : eui.BitmapLabel;            // 总攻击力
    private _upLevelButton : eui.Button;                // 升几级按钮
    private _upLevelLabel : eui.Label;                // 升几级文本
    private _curUpLevelNum : number = 1;                // 当前升几级编号
    public static curUpLevel : number = 1;                // 当前升几级
}
