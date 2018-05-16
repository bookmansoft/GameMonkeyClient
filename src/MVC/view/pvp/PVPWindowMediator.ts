/**
 * pvp界面中介
 */
class PVPWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
    /**
     * 和指定UI建立关联，为UI上的控件订阅界面事件，并提供对应的响应函数
     */
    public constructor(viewComponent: any) {
        super(ViewerName.PVPWindowMediator, viewComponent);

        //监听UI事件
        this.page._endButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnEndFight, this);
        this.page._pauseButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnPauseFight, this);
        this.page._jiasuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._JisSuFight, this);
	}

	/**
	 * 结束战斗
	 */
	public _OnEndFight(e){
		PVPManager.PVPFightManager.GetInstance().EndFight();
	}

    /**
	 * 暂停战斗
	 */
	public _OnPauseFight(e){
        if(PVPManager.PVPFightManager.GetInstance().status.current == "running"){
            PVPManager.PVPFightManager.GetInstance().PauseFight();
        }else if(PVPManager.PVPFightManager.GetInstance().status.current == "pause"){
            PVPManager.PVPFightManager.GetInstance().ContinueFight();
        }
		
	}

	/**
	 * 加速战斗
	 */
	public _JisSuFight(e){
        if(PVPManager.PVPFightManager.TIMESCALE == 1){
            PVPManager.PVPFightManager.TIMESCALE = 2;
            FacadeApp.dispatchAction(CommandList.pvp_ChangTimeScale);
        }else{
            PVPManager.PVPFightManager.TIMESCALE = 1;
            FacadeApp.dispatchAction(CommandList.pvp_ChangTimeScale);
        }
	}



	/**
     * 返回关联的UI单元
     */
    public get page(): PVPWindow {
        return <PVPWindow><any>(this.viewComponent);
    }
}