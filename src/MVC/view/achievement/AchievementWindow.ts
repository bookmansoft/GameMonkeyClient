/**
 * 成就界面
 */
class AchievementWindow extends APanelList<AchievementLine>{
	/*
	* 构造方法
     */
    public constructor(){
		super("resource/game_skins/achievement/AchievementWindowSkins.exml");

        //  动画面板需要设置的环境变量
        super.InitComponent(
            this._cjGroup,    // 设置列表容器
            this._cjScroller,     // 设置列表滚动控制器
            // 设置数据条目类工厂
            [
                function():AchievementLine { return AchievementWindow.genericsFactory(AchievementLine); }
            ],
            // 获取需要列表显示的数据内容
            [
                function(){
                    let list = FacadeApp.read(CommandList.Re_TaskInfo).list;
                    let indexList = Object.keys(list).filter(i => {
                        let achieve = list[i];
                        if(achieve.id >= 1000 && achieve.id < 2000){
                            return true;
                        }
                        return false;
                    });
                    return [list, indexList];
                }
            ]
        );

		FacadeApp.inst.removeMediator(ViewerName.AchievementWindowMediator); 
        FacadeApp.inst.registerMediator(new AchievementWindowMediator(this));
    }

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        this.firstOpen = true;
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Achievement);   //向Viewer发送界面通知
        // FacadeApp.dispatchAction(CommandList.M_CMD_Fight_Suspend);  //向Logic发送事件通知
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        super.Render();
        // if (this._cjLineSet == null) this._cjLineSet = [];
        // for (let i = 0; i  < this._cjLineSet.length; i++){
        //     if (this._cjLineSet[i] != null && this._cjLineSet[i].parent != null){
        //         this._cjLineSet[i].parent.removeChild(this._cjLineSet[i]);
        //     }
        // }

        // let taskList = FacadeApp.read(CommandList.Re_TaskInfo).list;//从数据仓库获取数据
        // if (taskList == null) return;

        // let self = this;
        // let lineHeight: number = 0;
        // Object.keys(taskList).map(i => {
        //     let achieve = taskList[i];
        //     if(achieve.id >= 1000 && achieve.id < 2000){
        //         //目前调整为每次都创建新的对象，避免数据刷新不及时
        //         //if(typeof self._cjLineSet[achieve.id] == 'undefined' || self._cjLineSet[achieve.id] == null){
        //             self._cjLineSet[achieve.id] = new AchievementLine(achieve);
        //         //}
        //         let line: AchievementLine = self._cjLineSet[achieve.id]; 
        //         line.y = lineHeight;
        //         self._cjGroup.addChild(line);

        //         lineHeight += line.height;
        //     }
        // });

    }

	/**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
		SoundManager.PlayCloseWinMusic();
        this.UnRegister();
        // this.parent.removeChild(this);

        // FacadeApp.dispatchAction(CommandList.M_CMD_FIGHT_CONTINUE);  //向Logic发送事件通知
    }

    private _cjLineSet : AchievementLine[] = [];                  // 成就行集合
    private _cjGroup : eui.Group;                            // 滚动容器

	private _closeButton : eui.Button;					     // 关闭按钮
    private _cjScroller : eui.Scroller;                          // 物品列表
    private _getLabel : eui.Label;                           // 获得的成就值文本
}