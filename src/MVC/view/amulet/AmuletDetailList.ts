/**
 * 符咒召唤行
 */
class AmuletDetailList extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/amulet/AmuletDetailListSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        //this._upButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnUpLevelClick, this);
        //this._icoIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnImageClick, this);
    }

    /**
     * 点击升级响应
     */
    private _OnUpLevelClick(event : TouchEvent){
        SoundManager.PlayButtonMusic();
        /*if (UnitManager.Player.TestMoney(this._item.UpLVMoney)){
            FacadeApp.fetchData([CommandList.M_NET_ItemNum, "&oper=", NetFuctionCode.Item_UpLevel, "&id=", this._item.ID, "&pm=1"],
                                     this._ReceveUpdate.bind(this));
        }
        else{
            console.log("金币不足!");
            this._upButton.enabled = false;
        }*/
    }

    /**
     * 接受升级信息
     */
    private _ReceveUpdate(data: Object){

        /*if (data["code"] == FacadeApp.SuccessCode){
            if (this._item.Level == 0){
                this._item.Level += 1;
            }
            else{
                this._item.Level += 1;
            }
            UIPage.getInstance().ItemWindow.UpdateTotalGJ();
            UnitManager.Player.Money = CalculateMgr.Sub(UnitManager.Player.Money, this._item.UpLVMoney);
		    UIPage.getInstance().UpdateItemGJ();
            this.UpdateShow();
        }*/
    }

    /**
     * 更新显示
     */
    /*public UpdateShow(){

        this._stateIma.visible=true;
        //this._amuletNameIma;
        this._leveLabel.text = "Lv." + this._amulet.Level.toString();
        this._descriptionLabel.text = "50";//this._item.Gongji.ShowToString;
        this._upNDLabel.text = this._amulet.UpLVMoney.ShowToString;
        //this._stateIma.text = CalculateMgr.Sub(this._item.NextLVGJ, this._item.Gongji).ShowToString;

        if (UnitManager.Player.TestMoney(this._amulet.UpLVMoney)){
            this._upButton.enabled = true;
        }
        else{
            this._upButton.enabled = false;
        }
    }*/

    /**
     * 显示物品
     */
    public ShowAmulet(amulet: Amulet){
        if (amulet == null) return;
        this._amulet = amulet;
        this._iconIma.texture=RES.getRes(amulet.Icon + "_png");
        this._nameIma.texture=RES.getRes(amulet.NameIma + "_png");
        //this._leveLabel.text="Lv." + amulet.Level.toString()+"/"+amulet.MaxLevel;

        //this._descriptionLabel.text=amulet.Description;

        this._stateIma.visible=true;

        //this._addGJLabel.text = CalculateMgr.Sub(this._item.NextLVGJ, this._item.Gongji).ShowToString;
        /*if (amulet.Level > 0){
            if (UnitManager.Player.TestMoney(amulet.UpLVMoney)){
                this._upButton.enabled = true;
            }
            else{
                this._upButton.enabled = false;
            }
        }
        else{
            var preItem : Item = ItemManager.GetItemByID(item.ID - 1);
            if (preItem != null){
                if (preItem.HasGet){
                    if (UnitManager.Player.TestMoney(item.UpLVMoney)){
                        this._upButton.enabled = true;
                    }
                    else{
                        this._upButton.enabled = false;
                    }
                }
                else{
                    this._upButton.enabled = false;
                }
            }
            else{
                this._upButton.enabled = true;
            }
        }*/
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
    /*private _OnImageClick(event: egret.TouchEvent){
        UIPage.getInstance().ShowAmuletDetail(this._amulet);
    }*/

    //  变量
    private _iconIma : eui.Image;                // 物品图标
    private _nameIma : eui.Image;               // 物品名字
    //private _leveLabel: eui.Label;              // 等级
    //private _descriptionLabel: eui.Label;       // 符咒效果描述
    //private _upButton:eui.Button;               // 升级按钮
   // private _upNDLabel : eui.Label;             // 升级消耗的内丹数量
    private _stateIma : eui.Image;              // 符咒状态，用于满级或者已召唤的显示
   // private _upNDIma : eui.Image;               // 升级内丹图片
    private _amulet: Amulet;                    // 显示的物品
}