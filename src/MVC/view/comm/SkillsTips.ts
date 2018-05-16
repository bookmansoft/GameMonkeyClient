class SkillsTips extends APanel{
	/*
	* 构造方法
     */
    public constructor(){
		super("resource/game_skins/ui/SkillsTipsSkins.exml");
		// FacadeApp.inst.removeMediator(ViewerName.BuddhaManagerMediator); 
        // FacadeApp.inst.registerMediator(new BuddhaManagerMediator(this));
    }

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){

    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        // FacadeApp.Notify(CommandList.M_CMD_UIOPENED_ITEM);
    }

    /**
     * 界面介质登记的数据源发生变化时调用
     */
    public async Render(){
        //console.log("自动调用");
        
    }

    /**
     * 显示内容
     */
    public ShowData($skillNum){
        this._derLabel.text = SkillManager.GetActiveSkillByID($skillNum).Description;
    }

    /**
     * 变换方向
     */
    public changDirection($direction){
        this._bg.scaleX = $direction;
    }

    private _derArray:any[]=["技能1","技能2","技能3","技能4","技能5","技能6"];
    private _derLabel:eui.Label;                // 技能描述
    private _bg:eui.Image;                      // 技能描述背景
}