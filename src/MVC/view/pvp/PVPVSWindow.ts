/**
 * 
 */
class PVPVSWindow extends APanel {
    /**
     * 构造方法
     */
	public constructor() {
		super("resource/game_skins/pvp/PVPVSWindow.exml");
	}

	/**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
		this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._bzButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBzClick, this);

    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
		this._group_up.y = -500;
		this._group_down.y = 400;
    }
	
	/**
	 * 显示
	 */
	public Show(data: Object){
		this._data = data;

		this._name_1.text = data["name"];
		this._name_2.text = '我方名称';
		this._power_wo.text = FacadeApp.read(CommandList.Re_CardtInfo)["power"][0];
		this._rank_di.text = data["rank"];
		
		// 获取敌方信息
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=10&openid=",data["id"]], [data => {
            //将网络数据保存到数据仓库，自动触发数据更新
            if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            else {
				this._power_di.text = (data["data"].power) ? data["data"].power.toString():"0";
			}

			this.updataMarshaCard(data);
        }]);
		this._rank_wo.text = FacadeApp.read(CommandList.Re_RankInfo)["rank2"];

		this.showAni()
	}

	/**
	 * 创建敌方卡牌
	 */
	private updataMarshaCard(data){
		for(let i=0; i < 10; i++){
            if(!this._marshaSet[i]){
                let block = new MarshallingLine();
                this._marshaSet[i] = block;
				this._marshaSet[i].x = Math.floor(i % 5) * block.width + 15;
				this._marshaSet[i].y = Math.floor(i / 5) * (block.height+20) + 110;
                this.addChild(block);				
            }
			this._marshaSet[i].UpData(data["data"]["loc"][i]?CardManager.GetCardByID(data["data"]["loc"][i]["id"]):null);
        }

        // // 超过，移除
        // if(this._marshaSet.length > data["data"]["loc"].length){
        //     for(let i=this._marshaSet.length - 1; i > data["data"]["loc"].length-1; i--){
        //         this.removeChild(this._marshaSet[i]);
        //         this._marshaSet.splice(i,1);
        //     }
        // }
	}


	/**
	 * 显示动画
	 */
	private showAni(){
		this._group_up.y = -500;
		this._group_down.y = 400;

		egret.Tween.get(this._group_up).to({y:100},300).to({y:-50},100).to({y:0},20);
		egret.Tween.get(this._group_down).to({y:-100},300).to({y:50},100).to({y:0},20);
	}

	/**
	 * 点击关闭按钮响应
	 */
	private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
	}

	/**
	 * 点击布阵按钮
	 */
	private _OnBzClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
		this.UnRegister();
		FacadeApp.Notify(CommandList.M_CMD_ShowPVPMarshalling,this._data["id"]);
	}
	

	private _closeButton: eui.Button;			// 关闭按钮

	private _group_up: eui.Group;				// 上面显示容器
	private _group_down: eui.Group;				// 下面显示容器
	private _name_1: eui.Label;
	private _name_2: eui.Label;
	private _power_wo: eui.BitmapLabel;
	private _power_di: eui.BitmapLabel;
	private _rank_wo: eui.BitmapLabel;
	private _rank_di: eui.BitmapLabel;
	private _bzButton: eui.Button;

	private _data = null;			// 敌方信息
	private _marshaSet : MarshallingLine[] = [];	// 敌方编组集合
}