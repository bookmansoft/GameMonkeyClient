/**
 * 符咒行
 */
class AmuletLine extends eui.Component implements IGroupLine{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/amulet/AmuletListSkins.exml";
    }

    //实现接口
    public get getId(): number{
        return this._amulet ? this._amulet.ID : -1;
    };

    /**
     * 更新
     */
    public update(_amulet: any): AmuletLine{
        this._amulet = AmuletManager.fromData(_amulet);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpLevelClick, this);
        this._icoIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnImageClick, this);
        this._isCreatCom = true;
        this.Render();
    }

    /**
     * 刷新页面
     */
    public Render(){
        if(this._isCreatCom == false) return;

        // if(AmuletPokedexWindow.inst(AmuletPokedexWindow).parent){
        //     this._upButton.visible = false;
        // }else{
        //     this._upButton.visible = true;
        // }

        this._icoIma.source = this.Amulet.Icon + "_png";
        this._nameIma.source = this.Amulet.NameIma + "_png";
        this._leveLabel.text = "Lv." + this.Amulet.Level.toString() + "/" + this.Amulet.MaxLevel;
        // this._descriptionLabel.text = this.Amulet.Description;

        this._upNDString = this._amulet.UpLVInternaldan.ShowToString;
        this._upButton.updateShow(1, [this._upNDString,"升级"]);

        
        if(this.Amulet.MaxLevel == "无限" || this.Amulet.Level < parseInt(this.Amulet.MaxLevel)){
            this._stateIma.visible = false;
            this._upButton.visible = true;
        }else{
            this._stateIma.visible = true;
            this._upButton.visible = false;
        }
        

        // 测试灰度效果
        // this.changeState("huidu");
    }

    /**
     * 点击升级响应
     */
    private _OnUpLevelClick(event : TouchEvent){
        
        FacadeApp.fetchData([CommandList.M_NET_Amulet, "&oper=2&pm=1&id="+this.Amulet.ID], [data => {
            //将网络数据保存到数据仓库，自动触发数据更新
            FacadeApp.dispatchAction(CommandList.M_DAT_Amulet, data['data']);
            if (data["code"] == FacadeApp.SuccessCode){
                SoundManager.PlayLvupMusic();
            }
            else{
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }
            
        }]);
    }

    /**
     * 取得显示物品
     */
    public get Amulet(): Amulet{
        return this._amulet;
    }

    /**
     * 图标点击响应
     */
    private _OnImageClick(event: egret.TouchEvent){
        FacadeApp.Notify(CommandList.M_CMD_ShowAmuletDetail, this._amulet);
    }

    /**
     * 更改状态，灰度，高亮，正常
     */
    public changeState($state){
        if($state == "huidu"){
            this._bgIma.setHuiduState();
            this._icoIma.filters = [FilterManage.HuiDu];
            this._upButton.setEnabled(false);
            this._upButton.setDisabled();
        }
        else if($state == "gaoliang"){
            this._bgIma.setGaoLiangState();
            this._icoIma.filters = null;
            this._upButton.setEnabled(true);
            this._upButton.setNormal();
        }
        else if($state == "normal"){
            this._bgIma.setNormalState();
            this._icoIma.filters = null;
            this._upButton.setEnabled(true);
            this._upButton.setNormal();
        }
    }

    //  变量
    private _bgIma: ListBgImage;                // 可更换背景
    private _icoIma : eui.Image;                // 物品图标
    private _nameIma : eui.Image;               // 物品名字
    private _leveLabel: eui.Label;              // 等级
    // private _descriptionLabel: eui.Label;       // 符咒效果描述

    private _upButton: LabelButton;             // 升级按钮

    private _upNDString : String;               // 升级消耗的内丹数量
    private _stateIma : eui.Image;              // 符咒状态，用于满级或者已召唤的显示
    private _amulet: Amulet;                    // 显示的物品
    private _isCreatCom: boolean = false;       // 是否创建完成
}