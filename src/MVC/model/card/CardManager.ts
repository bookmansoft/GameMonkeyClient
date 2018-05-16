/**
 * 卡牌管理
 */
class CardManager{
    /**
     * 初始化
     */
    public static Init(){
        CardManager._cardSet = [];

        let data = ConfigStaticManager.getList(ConfigTypeName.Card);
        Object.keys(data).map(key => {
            let goods: Card = new Card(data[key]);
            CardManager._cardSet[goods.ID] = goods;
        })
        
    }

    /**
     * 获得卡牌列表
     */
    public static get CardSet(): Card[]{
        return CardManager._cardSet;
    }

    /**
     * 通过ID获得卡牌
     * @param id    卡牌ID
     */
    public static GetCardByID(id: number): Card{
        return this._cardSet[id];
    }

    /**
     * 来自哪个卡牌
     */
    public static fromData(data:any): Card{
        let ret:Card = CardManager.GetCardByID(data.i);
        return ret;
    }

    // 变量
    private static _cardSet : Card[];
}