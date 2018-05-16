/**
 * 商品行
 */
class ShopGoodsLine extends eui.Component implements IGroupLine{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/shop/ShopListSkins.exml";
    }

    //实现接口
    public get getId():number{
        return this.goods ? this.goods.ListID : -1;
    };

    /**
     * 更新
     */
    public update(goods:any):ShopGoodsLine{
        this.goods = GoodsManager.fromData(goods);
        this.Render();
        return this;
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this._buyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnButtonClick, this);

        this.Render();
    }

    /**
     * 购买按钮点击响应
     */
    private _OnButtonClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();

        //需要绑定this，要不然在链式调用中this可能会发生变化，从而造成调用失败
        // if(this.item.stype == ShopTypeEnum.diamond){
            FacadeApp.fetchData([CommandList.M_NET_SHOP, '&oper=2&type=1&id=' + this.goods.ID], 
            [this.onSuccess.bind(this)], true, 'order');
        // }
        // else{
        //     FacadeApp.fetchData([CommandList.M_NET_SHOP, '&id=' + this.item.id + '&oper=2&type=' + this.item.stype], [this.onSuccess.bind(this)]);
        // }
    }

    /**
     * 购买成功
     */
    private onSuccess(data:any){
        FacadeApp.fetchData([CommandList.M_NET_SHOP, "&oper=3&type=1"], [data=>{
            FacadeApp.dispatchAction(CommandList.SHOP_GET_LIST, data['data']['items']);
            if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
        }]);
        FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
            FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
            if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
        }]);
    }

    /**
     * 显示商品
     */
    public async Render(){
        if (this.goods == null){
            console.log("获取商品出错，商品ID：" + this.goods.ID);
            return;
        }

        this._shopImage.source = this.goods.IconRes;
        this._nameImage.source = this.goods.NameRes;

        // 价格显示
        if (this.goods.BuyType == ItemType.Diamond){
            this._buyButton.updateShow(1,[this.goods.Cost.toString(),"金币购买"]);
        }
        else if (this.goods.BuyType == ItemType.RMB){
            this._buyButton.updateShow(1,["y" + this.goods.Cost,"人民币购买"]);
        }

        // 描述文本显示
        if (this.goods.Description == ""){
            this._desGroup.visible = false;
            this._desLabel.visible = true;
            this._desLabel.text = this.goods.Description;
        }
        else {
            this._desGroup.visible = true;
            this._desLabel.visible = false;
            this._desImage.source = this.goods.CostTypeRes;
            this._desGLabel.text = this.goods.Description;
        }
    }

     /**
     * 创建金币飞入动画
     */
    private creatFlyMoney(){

    }

    //  变量
    private _shopImage: eui.Image;                      // 商品图标

    private _buyButton: LabelButton;                    // 购买按钮

    private _nameImage: eui.Image;                      // 名字图片
    private _desLabel: eui.Label;                       // 描述文本
    private _desGroup: eui.Group;                       // 描述组
    private _desImage: eui.Image;                       // 描述图片
    private _desGLabel: eui.Label;                      // 组中的描述文本
    public goods: Goods = null;
}