/**
 * PVP结算界面
 */
class PVPEndWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/pvp/PVPEndWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this._OnCloseClick,this);

    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        // FacadeApp.Notify(CommandList.M_CMD_UIOPENED_RANK_Tab1);
    }

    /**
     * 刷新
     */
    public async Render(){
        super.Render();
    }

	/**
	 * 显示页面
	 */
	public showPage(data:Object){
        if(data["params"]["victory"]){
            console.log("胜利");

            let _upRank = true;
            if(_upRank){
                this._upRankGroup.visible = true;
                this._winEndGroup.visible = false;
                this.upAni();
            }else{
                this._upRankGroup.visible = false;
                this._winEndGroup.visible = true;
                egret.Tween.removeTweens(this._upIma);
                this._winEndGroup.anchorOffsetX = this._winEndGroup.width;
                this._winEndGroup.anchorOffsetY = this._winEndGroup.height;
                this._winEndGroup.scaleX = 0;
                this._winEndGroup.scaleY = 0;
                egret.Tween.get(this._winEndGroup).to({scaleX:1,scaleY:1},1000);
            }
            
        }
        else{
            console.log("失败");
        }
	}


    /**
     * 提升标志动画
     */
    private upAni(){
        egret.Tween.removeTweens(this._upIma);
        egret.Tween.get(this._upIma).to({y:80},50).to({y:90},100).to({y:85},50).call(this.upAni);
    }
    
    

    /**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
		PVPManager.PVPFightManager.GetInstance().EndPVPFight();
        FacadeApp.fetchData([CommandList.M_NET_RankNum, "&oper=2",], [data=>{
            if(data["code"] == FacadeApp.SuccessCode)   FacadeApp.dispatchAction(CommandList.RANK_GET_LIST2, data['data']);
            else UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
        }]);
    }


    // 变量
	private _winEndGroup: eui.Group;				// 胜利显示容器
	private _upRankGroup: eui.Group;				// 排名提升显示容器
    private _upIma: eui.Image;                      // 提升图片

	private _rankLabel: eui.BitmapLabel;			// 排名文本
}