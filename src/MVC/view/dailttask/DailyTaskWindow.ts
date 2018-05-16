/**
 * 每日任务界面
 */
class DailyTaskWindow extends APanelList<DailyTaskLine> /* 动画面板需要指定的条目类型 */{
    /**
     * 构造方法
     */
    public constructor() {
        //载入皮肤
        super("resource/game_skins/ui/DailyTaskSkins.exml");

        //动画面板需要设置的环境变量
        super.InitComponent(
            this._taskGroup, 
            this._taskList, 
            [
                function():DailyTaskLine { return DailyTaskWindow.genericsFactory(DailyTaskLine);}
            ],
            [function(){
                let taskList = FacadeApp.read(CommandList.Re_TaskInfo).list;
                let indexList = Object.keys(taskList).filter(id=>{
                    return parseInt(id)>=2000 && parseInt(id) < 3000 && taskList[id].status != 2;
                }, this);
                return [taskList, indexList];
            }],
            aniControlStatus.StartWave,
        );
        //End

        //绑定逻辑类 
        FacadeApp.inst.removeMediator(ViewerName.DailyTaskWindowMediator); //先移除之前存在的
        FacadeApp.inst.registerMediator(new DailyTaskWindowMediator(this));
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		//添加界面事件
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 登上舞台时调用
     */
    public ComponentDidMount() {
        this.firstOpen = true;
        this._refreshGroup.visible = false;
        //获取网络数据
        FacadeApp.Notify(CommandList.M_CMD_UiOpened_Task);
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    

    // 变量
    protected _taskList : eui.Scroller;                   // 物品列表
    protected _taskGroup : eui.Group;                     // 滚动容器

    public _closeButton : eui.Button;                  // 关闭按钮响应
    private _petAttackLabel: eui.BitmapLabel;           // 宠物攻击力文本
    private _itemAttackLabel: eui.BitmapLabel;          // 物品攻击力文本
    private _refreshLabel: eui.BitmapLabel;             // 刷新次数文本
    private _desImage: eui.Image;                       // 描述图片
    public _refreshGroup: eui.Group;                   // 刷新容器
    private _refreshButton: eui.Button;                 // 刷新按钮
    private _consumeLabel: eui.BitmapLabel;             // 刷新消耗文本
}
