/**
 * 三界符出现的神魔
 */
class SanjieCard extends egret.DisplayObjectContainer{
    /**
     * 构造方法
     */
    public constructor(proid: number){
        super();
        this._card = CardManager.GetCardByID(proid);// FacadeApp.read(CommandList.Re_CardtInfo).GetCardProByID(proid);
        this.Init();
    }

    /**
     * 获取神魔
     */
    public get Card(){
        return this._card;
    }

    /**
     * 显示
     */
    public Init(){
        this._icon = new CardImage();
        //this._icon.source=RES.getRes("shenmo_kapai_mile"+"_png");
        this.addChild(this._icon);
        this._icon.ShowCard(this.Card, true);// ShowCardPrototype(this.Card);

        // this._icon.anchorOffsetX=this._icon.width/2;
        // this._icon.anchorOffsetY=this._icon.height/2;
        //this._icon.x=0;
        //this._icon.y=0;
        this.anchorOffsetX=this.width/2;
        this.anchorOffsetY=this.height/2;
    }

    /**
     * 获取图片
     */
    public get Icon(){
        return this._icon;
    }

    // 变量
    private _card: Card;                  // 神魔原型
    private _icon:CardImage;                       // 图片
}