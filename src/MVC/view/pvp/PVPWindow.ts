/**
 * PVP界面
 */
class PVPWindow extends APanel{
	public constructor() {
		super("resource/game_skins/pvp/PVPWindowSkins.exml");
		
		FacadeApp.inst.removeMediator(ViewerName.PVPWindowMediator); 
		FacadeApp.inst.registerMediator(new PVPWindowMediator(this)); //注册Mediator
	}

	/**
     * 素材加载完毕时自动调用
     */
	public ComponentWillMount(){
		//近景
		if(!this.contains(Decoration.GetInstance2())){
			this.addChildAt(Decoration.GetInstance2(),0);
		}

		//背景
		if(!this.contains(BG.GetInstance2())){
			this.addChildAt(BG.GetInstance2(),0);
		}
		
		//战斗场景
		if(!this.contains(PVPManager.PVPFightManager.GetInstance())){
			this.addChild(PVPManager.PVPFightManager.GetInstance());
		}

		FacadeApp.AddListener(CommandList.PVP_RemoveFightWindow, ()=>{
			this.UnRegister();
		});
    }

	/**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){

    }

	/**
	 * 进入PVP战场
	 */
	public EnterPVPFight(){
		//PVP战斗
		PVPManager.PVPFightManager.GetInstance().loadData();
        FacadeApp.dispatchAction(CommandList.PVP_SRART);
	}

	public _endButton: eui.Button;					// 立即结束按钮
	public _pauseButton: eui.Button;				// 暂停按钮
	public _jiasuButton: eui.Button;				// 加速按钮
}