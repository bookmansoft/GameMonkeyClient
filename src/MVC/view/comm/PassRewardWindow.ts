/**
 * 过关奖励页面
 */
class PassRewardWindow extends APanel{
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/ui/PassRewardWindowSkins.exml");
	}

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this.creatList();
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

	/**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    /**
     * 创建条
     */
    private creatList(){

        // 测试显示，测试用宠物
        // var pet:Pet = new Pet(Pr_petInfo);
        // PetManager.GetPetByID(2); 


        // 如果是宠物，那么是获得的奖励，如果是神魔，那么是神魔碎片
        var num:number = 56789;

        for(var i:number=0;i<3;i++){
            var line = new PassRewardList;
            this._group.addChild(line);
            line.y = i*125;
            line.upDataShow("魔宠",null,num);
            line.SureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);

            this._lineSet.push(line);
        }
    }


	// 变量
    private _closeButton: eui.Button;                   // 关闭按钮
    private _list : eui.Scroller;                       // 物品列表
    private _group : eui.Group;                         // 滚动容器
    private _lineSet: PassRewardList[] = [];                 // 条集合
}