// /**
//  * 积分兑换条
//  */
// class IntegralExchangeList extends AWindow{
// 	public constructor() {
// 		super();
//         this.skinName = "resource/game_skins/IntegralExchangeListSkins.exml";
//     }

// 	/**
//      * 子项创建完成
//      */
//     protected createChildren() {
//         super.createChildren();

// 		GameEvent.AddEventListener(EventType.ActivityScore, this.upDataScore.bind(this), this);
// 		this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onReceiveClick,this);
// 	}

//     /**
//      * 更新语言文本
//      */
//     protected _UpdataText(){
//         var lg: string = StringMgr.LanguageSuffix;
// 		this._haveReceiveIma.source = "jifen_yilingqu" + lg + "_png";
//         this._textLabel.text = StringMgr.GetText("integraltext1");
//         this._receiveButton.skinName = SkinCreateMgr.CreateButton("jifen_an_lingqu_l" + lg + "_png", "jifen_an_lingqu_l" + lg + "_png", "jifen_an_lingqu_h" + lg + "_png");
		
// 		this._receiveButton.enabled = true;
// 		// 领奖按钮状态
// 		if(this._exchangInfo["condition"] && IntegralManager.Score >= this._exchangInfo["condition"]){
// 			this._receiveButton.enabled = true;
// 		}else{
// 			this._receiveButton.enabled = false;
// 		}
// 	}

// 	/**
// 	 * 点击领奖
// 	 */
// 	private onReceiveClick(){
//         SoundManager.PlayButtonMusic();
// 		// 领奖
//         NetManager.SendRequest(["func=" + NetNumber.ActivityGetBonus + "&id=" + this._gitId], this._ReveiveActivityGetBonus.bind(this));
// 	}

// 	/**
//      * 领奖返回
//      */
//     private _ReveiveActivityGetBonus(jsonData: Object){
//         let code: number = jsonData["code"];
// 		let data: Object = jsonData["data"];

//         if(code == NetManager.SuccessCode){
// 			IntegralManager.GitStateById(this._gitId, 1);
// 			PromptManager.ShowGit(data["bonus"]);
//         }

//         this.upDataShow(null);
//     }

// 	/**
// 	 * 更新
// 	 */
// 	public upDataShow($info: Object){
// 		if($info){
// 			this._exchangInfo = $info;
// 			this._gitId = this._exchangInfo["stageid"];
// 		}

// 		this.upDataScore();

// 		// 显示奖励
// 		let rewardsSet = this._exchangInfo["rewards"].split(";");
// 		for(let i = 0; i<rewardsSet.length; i++){
// 			let itemSet: string[] = rewardsSet[i].split(",");
// 			let resSet = this.showItemIma(itemSet);

// 			let _bonusNum = resSet[1];
// 			if(parseInt(resSet[1]) > 10000){
// 				let qian:number = parseInt(resSet[1])/1000;
// 				_bonusNum = qian + "k";
// 			}

// 			if(i == 0){
// 				this._itemIcon1.source = resSet[0];
// 				this._itemNumLabel1.text = _bonusNum;
// 			}else{
// 				this._itemIcon2.source = resSet[0];
// 				this._itemNumLabel2.text = _bonusNum;
// 			}
// 		}
// 	}

// 	/**
// 	 * 更新积分
// 	 */
// 	private upDataScore(){
		
// 		this._integralNumLabel.text = IntegralManager.Score + "/" + this._exchangInfo["condition"];

// 		// 领奖按钮状态
// 		if(IntegralManager.Score >= this._exchangInfo["condition"]){
// 			this._receiveButton.enabled = true;
// 		}else{
// 			this._receiveButton.enabled = false;
// 		}
// 		// 已领取状态
// 		if( IntegralManager.GitState[ this._gitId ] == 1){
// 			this._haveReceiveIma.visible = true;
// 			this._receiveButton.visible = false;
// 			this._integralNumLabel.visible = false;
// 		}
// 		else{
// 			this._haveReceiveIma.visible = false;
// 			this._receiveButton.visible = true;
// 			this._integralNumLabel.visible = true;
// 		}
// 	}

// 	/**
// 	 * 获得奖励并且提示
// 	 */
// 	private showItemIma(bonus: string[]){
//         if (bonus != null){
// 			if (bonus[0] == "M"){
// 				return ["fenxiang_jinbi_png",bonus[1]];
// 			}
// 			else if(bonus[0] == "A"){
// 				return ["fenxiang_daoju_tili_png",bonus[1]];
// 			}
// 			else if(bonus[0] == "D"){
// 				return ["fenxiang_jifen_png",bonus[1]];
// 			}
// 			else if (bonus[0] == "I" || bonus[0] == "C"){
// 				var item: Item = ItemManager.GetItemByID(parseInt(bonus[1]));
// 				if (item != null){
// 					return [item.ImageRes,bonus[2]];
// 				}
// 				if(item == null && bonus[0] == "C" && bonus[1] == "0"){
// 					return ["suipian_weizhi_png",bonus[2]];
// 				}
// 			}
//         }
//     }


// 	// 参数
// 	private _haveReceiveIma: eui.Image;								// 已领取图标
// 	private _integralNumLabel: eui.Label;							// 积分数量文本
// 	private _receiveButton: eui.Button;								// 领取奖励按钮
// 	private _itemIcon1: eui.Image;									// 奖励道具图标1
// 	private _itemIcon2: eui.Image;									// 奖励道具图标2
// 	private _itemNumLabel1: eui.BitmapLabel;						// 奖励道具数量文本1
// 	private _itemNumLabel2: eui.BitmapLabel;						// 奖励道具数量文本2

// 	private _exchangInfo: Object;									// 兑换礼包数据数据
// 	private _gitId: number = 0;										// 礼包编号
// 	private _textLabel: eui.Label;
// }


// /**
//  * 积分排名条
//  */
// class IntegralRankList extends AWindow{
// 	public constructor() {
// 		super();
//         this.skinName = "resource/game_skins/IntegralRankListSkins.exml";
//     }

// 	/**
//      * 子项创建完成
//      */
//     protected createChildren() {
//         super.createChildren();
// 		this._playerNameLabel.multiline = false;
// 		this._playerNameLabel.height = 30;
// 	}

//     /**
//      * 更新语言文本
//      */
//     protected _UpdataText(){
// 		if(this._isPlayer){
// 			this._xiaofeiLabel.textColor = 0x935102;
// 			this._playerNameLabel.textColor = 0x935102;
// 			this._integralNumLabel.textColor = 0x935102;
// 			this._itemNumLabel1.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
// 			this._itemNumLabel2.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
// 		}else{
// 			this._xiaofeiLabel.textColor = 0x245f9d;
// 			this._playerNameLabel.textColor = 0x245f9d;
// 			this._integralNumLabel.textColor = 0x245f9d;
// 			this._itemNumLabel1.font = "inteitemnumfont1"+ StringMgr.LanguageSuffix + "_fnt";
// 			this._itemNumLabel2.font = "inteitemnumfont1" + StringMgr.LanguageSuffix + "_fnt";
// 		}

// 		if(StringMgr.LanguageSuffix == ""){
// 			this._xiaofeiLabel.text = "积分:";
// 		}else{
// 			this._xiaofeiLabel.text = "Point:";
// 		}
// 	}

// 	/**
// 	 * 更新
// 	 */
// 	public upDataShow($ifPlayer, $playerInfo: Object, $rankBonusDataSet: Object[]){
// 		this._isPlayer = $ifPlayer;

// 		let _rankNum: number = $playerInfo["rank"]; //Math.random()*100|0 + 1;
// 		let rewards = null;
// 		let rewardsSet = [];

// 		// 根据排名获取排名奖励
// 		for(let i=0; i<$rankBonusDataSet.length; i++){
// 			if(_rankNum <= $rankBonusDataSet[i]["endrank"]){
// 				rewards = $rankBonusDataSet[i]["rewards"];
// 				break;
// 			}
// 		}


// 		this._integralNumLabel.text = $playerInfo["score"];
// 		this._playerNameLabel.text =  decodeURIComponent($playerInfo["name"]);

// 		this._playerIconIma.source = RES.getRes("touxiang_mr_jpg");
// 		// 加载资源
// 		if($playerInfo["icon"] != ""){
// 			let imaLoad = new egret.ImageLoader();
// 			imaLoad.load($playerInfo["icon"]);
// 			imaLoad.addEventListener(egret.Event.COMPLETE,
// 				function (){
// 					this._playerIconIma.source = imaLoad.data;
// 				},this);
// 		}

// 		// 解析奖励图片
// 		rewardsSet = rewards.split(";");
// 		for(let i = 0; i<rewardsSet.length; i++){
// 			let itemSet: string[] = rewardsSet[i].split(",");
// 			let resSet = this.showItemIma(itemSet);

// 			let _bonusNum = resSet[1];
// 			if(parseInt(resSet[1]) > 10000){
// 				let qian:number = parseInt(resSet[1])/1000;
// 				_bonusNum = qian + "k";
// 			}

// 			if(i==0){
// 				this._itemIcon1.source = resSet[0];
// 				this._itemNumLabel1.text = resSet[1];
// 			}else{
// 				this._itemIcon2.source = resSet[0];
// 				this._itemNumLabel2.text = resSet[1];
// 			}
// 		}

// 		// 设置排名头像框
// 		if(_rankNum <= 3){
//         	var lg: string = StringMgr.LanguageSuffix;
// 			this._rankNumBgIma.texture = RES.getRes("jifen_paiming_" + _rankNum + lg + "_png");
// 			this._rankNumLabel.visible = false;
// 		}
// 		else{
// 			this._rankNumBgIma.texture = RES.getRes("jifen_paiming_mr_png");
// 			this._rankNumLabel.visible = true;
// 			this._rankNumLabel.text = "d" + _rankNum.toString() + "m";
// 		}

// 		// 是否是玩家自己
// 		this._rankListGroup.visible = !this._isPlayer;
// 		this._MyRankListGroup.visible = this._isPlayer;
// 		if(this._isPlayer){
// 			this._xiaofeiLabel.textColor = 0x935102;
// 			this._playerNameLabel.textColor = 0x935102;
// 			this._integralNumLabel.textColor = 0x935102;
// 			this._itemNumLabel1.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
// 			this._itemNumLabel2.font = "inteitemnumfont2" + StringMgr.LanguageSuffix + "_fnt";
// 		}else{
// 			this._xiaofeiLabel.textColor = 0x245f9d;
// 			this._playerNameLabel.textColor = 0x245f9d;
// 			this._integralNumLabel.textColor = 0x245f9d;
// 			this._itemNumLabel1.font = "inteitemnumfont1"+ StringMgr.LanguageSuffix + "_fnt";
// 			this._itemNumLabel2.font = "inteitemnumfont1" + StringMgr.LanguageSuffix + "_fnt";
// 		}

// 		if(StringMgr.LanguageSuffix == ""){
// 			this._xiaofeiLabel.text = "积分:";
// 		}else{
// 			this._xiaofeiLabel.text = "Point:";
// 		}
		
// 	}

// 	/**
// 	 * 获得奖励并且提示
// 	 */
// 	private showItemIma(bonus: string[]){
//         if (bonus != null){
// 			if (bonus[0] == "M"){
// 				return ["fenxiang_jinbi_png",bonus[1]];
// 			}
// 			else if(bonus[0] == "A"){
// 				return ["fenxiang_daoju_tili_png",bonus[1]];
// 			}
// 			else if(bonus[0] == "D"){
// 				return ["fenxiang_jifen_png",bonus[1]];
// 			}
// 			else if (bonus[0] == "I" || bonus[0] == "C"){
// 				var item: Item = ItemManager.GetItemByID(parseInt(bonus[1]));
// 				if (item != null){
// 					return [item.ImageRes,bonus[2]];
// 				}
// 				if(item == null && bonus[0] == "C" && bonus[1] == "0"){
// 					return ["suipian_weizhi_png",bonus[2]];
// 				}
// 			}
//         }
//     }


// 	// 参数
// 	private _rankListGroup: eui.Group;								// 其他玩家排名容器
// 	private _MyRankListGroup: eui.Group;							// 玩家自己排名容器

// 	private _rankNumBgIma: eui.Image;								// 排名背景图
// 	private _playerIconIma: eui.Image;								// 玩家头像
// 	private _rankNumLabel: eui.BitmapLabel;							// 玩家排名文本

// 	private _integralNumLabel: eui.Label;							// 积分数量文本
// 	private _playerNameLabel: eui.Label;							// 名称文本

// 	private _itemIcon1: eui.Image;									// 奖励道具图标1
// 	private _itemIcon2: eui.Image;									// 奖励道具图标2
// 	private _itemNumLabel1: eui.BitmapLabel;						// 奖励道具数量文本1
// 	private _itemNumLabel2: eui.BitmapLabel;						// 奖励道具数量文本2

// 	private _isPlayer: boolean;										// 是否是玩家自己

// 	private _xiaofeiLabel: eui.Label;								// 积分


// }


/**
 * 排行榜行
 */
class IntegralExchangeList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/IntegralExchangeListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }

    /**
     * 设置显示
     */
    public async SetShow(data:Object,index){
        this._haveReceiveIma.visible = false;
        this._receiveButton.visible = false;
        let temp = FacadeApp.read(CommandList.Re_ActivityInfo);
        this._integralNumLabel.text = Math.floor(temp.score) +"/"+ data["score"];
        this._itemNumLabel1.text = "X"+data["bonus"][0]["num"].toString();
        this._itemNumLabel2.text = "X"+data["bonus"][1]["num"].toString();
        switch(data["bonus"][0]["type"]){
            case ItemType.Diamond:
                this._itemIcon1.source = RES.getRes("ding_yb_png");
                break;
            case ItemType.Gold:
                this._itemIcon1.source = RES.getRes("ding_jb_png");
                break;
            case ItemType.PetChipHead:
                this._itemIcon1.source = RES.getRes("jifen_suipianty_png");
                break;
        }
        switch(data["bonus"][1]["type"]){
            case ItemType.Diamond:
                this._itemIcon2.source = RES.getRes("ding_yb_png");
                break;
            case ItemType.Gold:
                this._itemIcon2.source = RES.getRes("ding_jb_png");
                break;
            case ItemType.PetChipHead:
                this._itemIcon2.source = RES.getRes("jifen_suipianty_png");
                break;
        }
        if(temp.score>=data["score"]&&temp.act[index] == 0) this._receiveButton.visible = true;
        if(temp.act[index] != 0){
            this._haveReceiveIma.visible = true;
            this._integralNumLabel.visible = false;
        }
        this._index = index;
        this._receiveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReceiveClick, this);
    }
    private onReceiveClick(event : egret.TouchEvent){
        FacadeApp.fetchData([CommandList.M_NET_Activity, "&oper=3&id=",this._index], [data=>{
            if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            else{
                this._receiveButton.visible = false;
                this._integralNumLabel.visible = false;
                this._haveReceiveIma.visible = true;
                FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                }]);
            }
        }]);
    }
    // 变量
    private _haveReceiveIma : eui.Image;        
    private _receiveButton : eui.Button;
    private _integralNumLabel : eui.Label;
    private _index:any;
    private _itemIcon1 : eui.Image;
    private _itemIcon2 : eui.Image;
    private _itemNumLabel1 : eui.Label;
    private _itemNumLabel2 : eui.Label;
}