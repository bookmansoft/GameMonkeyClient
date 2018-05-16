/**
 * 编组条
 */
class MarshallingLine extends eui.Component{
	/**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/marshalling/MarshallingBlockSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._group.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this._isCreat = true;
        this.UpData(this._card, this._type);
    }

    /**
     * 刷新页面
     */
    public UpData(card, type = null){
        // if(!this._isCreat) return;
        if(!card){
            this._iconIma.source = "";
            this._toudi.source = this.getRtypeRes(1);
            this._touzuo.source = "";
            return;
        }

        this._card = card;
        this._type = type;
        this._iconIma.source = this._card.Prototype.HeadRes;
        this._toudi.source = this.getRtypeRes(this._card.Ad);
        this._touzuo.source = this.getTypeRes(this._card.Ad);
    }

    /**
     * 点击头像
     */
    private _OnClick(e:egret.TouchEvent){

        if(this._type == 1){// 上阵1
            this._OnQuitClick();
        }else if(this._type == 0){
            this._OnStateClick();
        }
    }


    /**
     * 加入分组按钮
     */
	private _OnStateClick(){
        SoundManager.PlayButtonMusic();
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=7&id=" + this.Card.ID + "&gid=" + this.MarshallingID], 
        [data => {
            FacadeApp.Notify(CommandList.M_CMD_Change_Marshalling);
            if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(data["code"]==2034?"角色牌必须少于4张":FacadeApp._errorCodeSet[data["code"]]);
        }]);
	}

    /**
     * 离开分组按钮
     */
    private _OnQuitClick(){
        SoundManager.PlayButtonMusic();
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=8&id=" + this.Card.ID + "&gid=" + this.MarshallingID], [data => {
            FacadeApp.Notify(CommandList.M_CMD_Change_Marshalling);
            if(data["code"] !=FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
        }]);
        this.UpData(this._card, this._type);
    }

    /**
     * 取得显示神魔
     */
    public get Card(): Card{
        return this._card;
    }

    /**
     * 取得分组
     */
    public get MarshallingID(): number{
        return MarshallingWindow.inst(MarshallingWindow).MarshallingID;
    }

    /**
     * 获取品阶的图片资源
     */
    public getRtypeRes(_rtype: number){
        switch(_rtype){
            case 1: return "shenmo_toudi_dixian_png";// 白
            case 2: return "shenmo_toudi_jinxian_png";// 绿
            case 3: return "shenmo_toudi_sanxian_png";// 蓝
            case 4: return "shenmo_toudi_tianxian_png";// 紫
            case 5: return "shenmo_toudi_zhenxian_png";// 黄
        }
    }
    
        /**
     * 获取品阶的图片资源
     */
    public getTypeRes(_rtype: number){
        switch(_rtype){
            case 1: return "shenmo_xian_dixian_png";// 白
            case 2: return "shenmo_xian_jinxian_png";// 绿
            case 3: return "shenmo_xian_sanxian_png";// 蓝
            case 4: return "shenmo_xian_tianxian_png";// 紫
            case 5: return "shenmo_xian_zhenxian_png";// 黄
        }
    }

    /**
     * 图标点击响应
     */
    // private _OnImageClick(event: egret.TouchEvent){
    //     FacadeApp.Notify(CommandList.M_CMD_ShowCard, this._card);
    // }

    /**
     * 更改状态，灰度，高亮，正常
     */
    // public changeState($state){
    //     if($state == "huidu"){
    //         this._bgIma.setHuiduState();
    //         this._iconIma.filters = [FilterManage.HuiDu];
    //         this._stateButton.enabled = false;
    //         this._stateButton.filters = [FilterManage.HuiDu];
    //     }
    //     else if($state == "gaoliang"){
    //         this._bgIma.setGaoLiangState();
    //         this._iconIma.filters = null;
    //         this._stateButton.enabled = true;
    //         this._stateButton.filters = null;

    //     }
    //     else if($state == "normal"){
    //         this._bgIma.setNormalState();
    //         this._iconIma.filters = null;
    //         this._stateButton.enabled = true;
    //         this._stateButton.filters = null;
    //     }
    // }


    //  变量
    private _bgIma: ListBgImage;                // 可更换背景
    private _group: eui.Group;                  // 神魔集合
    private _toudi: eui.Image;                  // 神魔集合底部图
    private _iconIma: eui.Image;             	// 神魔图标
    private _touzuo: eui.Image;                 //神魔左侧品阶图标
    // private _nameIma : eui.Image;             	// 神魔名字
	// private _shuxingIma : eui.Image;         	// 属性
	// private _progressIma : eui.Image;           // 碎片进度条
	// private _progressLabel : eui.Label;         // 碎片数量
	// private _pinzhiIma : eui.Image;             // 物品图标
    // private _stateButton:eui.Button;            // 出战按钮 休息按钮
    // private _quitButton: eui.Button;            // 退出分组按钮

    private _card: Card = null;                        // 显示的物品
    private _isCreat: boolean = false;          // 是否创建完成

    private _type: number = null;                      // 上阵1，未上阵0
}