/**
 * 物品详细页，技能行
 */
class TalismanDetailList extends eui.Component{
    /**
     * 构造函数
     */
    public constructor(_talisman:Talisman, _id:number) {
        super();
        this.skinName = "resource/game_skins/talisman/TalismanDetailListSkins.exml";

        this.talisman = _talisman;
        this.requireLevel = _talisman._skillLevelSet[_id];
        this.sObj = SkillManager.GetTalismanSkillByID(_talisman._skillIDSet[_id]);
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
        this.updateShow();
    }

    /**
     * 更新技能条
     */
    public updateShow(){
        this._iconIma.source = this.sObj.Icon + "_png";
        this._iconIma.alpha = this.talisman.Level >= this.requireLevel ? 1 : 0.1;
        this._jiesuoLevelLabel.text = this.requireLevel.toString();
        this._derLabel.text = this.sObj.Description;
        
        this._nameLabel.text = this.sObj.Name;
    }

    //  变量
    private _iconIma : eui.Image;               // 技能图标
	private _jiesuoLevelLabel : eui.Label;      // 解锁等级文本
	private _derLabel : eui.Label;              // 技能详情
	private _nameLabel : eui.Label;             // 技能名字
     /**
     * 解锁等级
     */
    private requireLevel:number = 0;
    private sObj:TalismanSkill = null;
    private talisman:Talisman = null;
}